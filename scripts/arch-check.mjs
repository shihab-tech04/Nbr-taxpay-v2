import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');

const MAX_IMPL_LINES = 200;
const ALLOWED_CSS = new Set([
  'src/index.css',
  'src/features/home/home2.css',
  'src/features/home/slider2.css',
]);
const PROHIBITED_MUI_PRIMITIVES = new Set([
  'Autocomplete',
  'Button',
  'IconButton',
  'ButtonBase',
  'TextField',
  'Select',
  'Checkbox',
  'Radio',
  'RadioGroup',
  'Switch',
  'FormControlLabel',
  'CircularProgress',
  'FormControl',
  'FormLabel',
  'FormHelperText',
  'InputLabel',
]);
const NATIVE_CONTROLS = new Set(['button', 'input', 'select', 'textarea']);
const DUPLICATE_THEME_HEX = /#(?:0f766e|0d9488|115e59|14b8a6|dc2626|ef4444|f43f5e|2f55a4|1c3d70)\b/i;

function loadTsPathAliases() {
  const tsconfigPath = path.join(ROOT, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) return [];
  const raw = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  const paths = raw?.compilerOptions?.paths ?? {};
  return Object.entries(paths).flatMap(([pattern, targets]) => {
    if (!Array.isArray(targets) || targets.length === 0) return [];
    const prefix = pattern.endsWith('*') ? pattern.slice(0, -1) : pattern;
    return [{ prefix, exact: !pattern.endsWith('*'), targets }];
  });
}

const TS_ALIASES = loadTsPathAliases();

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else results.push(full);
  }
  return results;
}

function rel(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function resolveCandidateFile(base) {
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  for (const candidate of candidates) {
    if (
      /\.(ts|tsx|js|jsx)$/.test(candidate) &&
      fs.existsSync(candidate) &&
      fs.statSync(candidate).isFile()
    ) {
      return candidate;
    }
  }
  return null;
}

function matchPathAlias(specifier) {
  for (const alias of TS_ALIASES) {
    if (alias.exact && specifier === alias.prefix) {
      return { alias, rest: '' };
    }
    if (!alias.exact && specifier.startsWith(alias.prefix)) {
      return { alias, rest: specifier.slice(alias.prefix.length) };
    }
  }
  return null;
}

function resolveImport(fromFile, specifier) {
  if (specifier.startsWith('.')) {
    return { resolved: resolveCandidateFile(path.resolve(path.dirname(fromFile), specifier)), isAlias: false };
  }
  const aliasMatch = matchPathAlias(specifier);
  if (!aliasMatch) return { resolved: null, isAlias: false };
  for (const target of aliasMatch.alias.targets) {
    const cleanTarget = target.endsWith('*') ? target.slice(0, -1) : target;
    const base = path.resolve(ROOT, cleanTarget, aliasMatch.rest);
    const hit = resolveCandidateFile(base);
    if (hit) return { resolved: hit, isAlias: true };
  }
  return { resolved: null, isAlias: true };
}

function extractPkgName(specifier) {
  return specifier.startsWith('@')
    ? specifier.split('/').slice(0, 2).join('/')
    : specifier.split('/')[0];
}

const allSrcFiles = walk(SRC_DIR);
const tsFiles = allSrcFiles.filter((f) => /\.(ts|tsx)$/.test(f));
const cssFiles = allSrcFiles.filter((f) => f.endsWith('.css')).map(rel);

const violations = [];
const warnings = [];
const graph = new Map();
const prodExternalImports = new Set();
const testExternalImports = new Set();
const toolingExternalImports = new Set();

for (const cssRel of cssFiles) {
  if (!ALLOWED_CSS.has(cssRel)) {
    violations.push(`Unexpected custom CSS file outside approved allowlist: ${cssRel}`);
  }
}

for (const file of tsFiles) {
  const fileRel = rel(file);
  const isTest = /\.test\.(ts|tsx)$/.test(fileRel);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n').length;

  if (!isTest && lines > MAX_IMPL_LINES) {
    violations.push(`File exceeds ${MAX_IMPL_LINES} lines (${lines}): ${fileRel}`);
  }

  if (
    !isTest &&
    /^src\/design-system\/(buttons|forms|selection)\//.test(fileRel) &&
    DUPLICATE_THEME_HEX.test(content)
  ) {
    violations.push(`Duplicate brand/error hex literal outside src/design-system/theme/: ${fileRel}`);
  }

  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, kind);
  const deps = [];
  const muiNamespaceAliases = new Set();

  function recordEdge(spec) {
    const { resolved, isAlias } = resolveImport(file, spec);
    if (!spec.startsWith('.') && !isAlias) {
      const pkg = extractPkgName(spec);
      (isTest ? testExternalImports : prodExternalImports).add(pkg);
    } else if (isAlias && !resolved) {
      violations.push(`Unresolved path-alias import '${spec}': ${fileRel}`);
    }
    if (resolved) {
      const targetRel = rel(resolved);
      deps.push(resolved);

      if (!isTest) {
        if (fileRel.startsWith('src/design-system/') && /^src\/(features|components|App)/.test(targetRel)) {
          violations.push(`Design system imports app/feature layer: ${fileRel} -> ${targetRel}`);
        }
        if (
          !fileRel.startsWith('src/design-system/theme/') &&
          fileRel !== 'src/design-system/theme.ts' &&
          targetRel.startsWith('src/design-system/theme/')
        ) {
          violations.push(`Direct internal theme import bypassing barrel: ${fileRel} -> ${targetRel}`);
        }
        if (/^src\/(shared|config)\//.test(fileRel) && /^src\/(features|components)\//.test(targetRel)) {
          violations.push(`Shared/config layer imports feature/component: ${fileRel} -> ${targetRel}`);
        }
        if (
          fileRel.startsWith('src/features/home/services/') &&
          /(mockData|mockLedgerAdapter)/.test(targetRel)
        ) {
          violations.push(`Home service imports mock data: ${fileRel} -> ${targetRel}`);
        }
        const srcFeature = fileRel.match(/^src\/features\/([^/]+)\//)?.[1];
        const dstFeature = targetRel.match(/^src\/features\/([^/]+)\//)?.[1];
        if (srcFeature && dstFeature && srcFeature !== dstFeature) {
          violations.push(`Cross-feature import disallowed: ${fileRel} -> ${targetRel}`);
        }
      }
    }
  }

  function visit(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text;
      recordEdge(spec);

      const clause = node.importClause;
      const isWholeTypeImport = Boolean(clause?.isTypeOnly);
      if (!isTest && !isWholeTypeImport && !fileRel.startsWith('src/design-system/')) {
        if (spec === '@mui/material') {
          if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
            for (const el of clause.namedBindings.elements) {
              if (el.isTypeOnly) continue;
              const importedName = el.propertyName?.text ?? el.name.text;
              if (PROHIBITED_MUI_PRIMITIVES.has(importedName)) {
                const aliasNote = el.propertyName ? ` (aliased as '${el.name.text}')` : '';
                violations.push(
                  `Prohibited direct MUI primitive '${importedName}'${aliasNote} outside design-system: ${fileRel}`
                );
              }
            }
          } else if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
            muiNamespaceAliases.add(clause.namedBindings.name.text);
          }
        } else if (spec.startsWith('@mui/material/')) {
          const sub = spec.slice('@mui/material/'.length).split('/')[0];
          if (PROHIBITED_MUI_PRIMITIVES.has(sub)) {
            violations.push(`Prohibited direct MUI primitive '${sub}' outside design-system: ${fileRel}`);
          }
        }
      }
    } else if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      recordEdge(node.moduleSpecifier.text);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      recordEdge(node.arguments[0].text);
    } else if (
      !isTest &&
      !fileRel.startsWith('src/design-system/') &&
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      muiNamespaceAliases.has(node.expression.text) &&
      PROHIBITED_MUI_PRIMITIVES.has(node.name.text)
    ) {
      violations.push(
        `Prohibited direct MUI primitive '${node.expression.text}.${node.name.text}' outside design-system: ${fileRel}`
      );
    }

    if (
      !isTest &&
      !fileRel.startsWith('src/design-system/') &&
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      ts.isIdentifier(node.tagName) &&
      NATIVE_CONTROLS.has(node.tagName.text)
    ) {
      const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
      violations.push(
        `Native <${node.tagName.text}> element outside src/design-system/: ${fileRel}:${line + 1}`
      );
    }

    ts.forEachChild(node, visit);
  }

  visit(sf);
  graph.set(file, deps);
}

// Scan build & lint config files so dev/build tooling imports stay accounted for
for (const toolRel of ['vite.config.ts', 'eslint.config.js', 'scripts/arch-check.mjs']) {
  const full = path.join(ROOT, toolRel);
  if (!fs.existsSync(full)) continue;
  const code = fs.readFileSync(full, 'utf8');
  const sf = ts.createSourceFile(full, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  ts.forEachChild(sf, function collectTool(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text;
      if (!spec.startsWith('.') && !spec.startsWith('node:')) {
        toolingExternalImports.add(extractPkgName(spec));
      }
    }
    ts.forEachChild(node, collectTool);
  });
}

// Cycle detection (DFS)
const state = new Map();
const stack = [];
function dfsCycle(node) {
  state.set(node, 1);
  stack.push(node);
  for (const next of graph.get(node) ?? []) {
    const nextState = state.get(next) ?? 0;
    if (nextState === 1) {
      const cycleStart = stack.indexOf(next);
      const cycle = [...stack.slice(cycleStart), next].map(rel).join(' -> ');
      violations.push(`Circular dependency detected: ${cycle}`);
    } else if (nextState === 0) {
      dfsCycle(next);
    }
  }
  stack.pop();
  state.set(node, 2);
}
for (const file of tsFiles) {
  if ((state.get(file) ?? 0) === 0) dfsCycle(file);
}

function collectReachable(rootFiles) {
  const visited = new Set();
  const queue = [...rootFiles];
  while (queue.length > 0) {
    const cur = queue.shift();
    if (visited.has(cur)) continue;
    visited.add(cur);
    for (const next of graph.get(cur) ?? []) {
      if (!visited.has(next)) queue.push(next);
    }
  }
  return visited;
}

const prodRoots = tsFiles.filter((f) => rel(f) === 'src/main.tsx' || rel(f) === 'src/vite-env.d.ts');
const testRoots = tsFiles.filter((f) => /\.test\.(ts|tsx)$/.test(rel(f)));

const prodReachable = collectReachable(prodRoots);
const testReachable = collectReachable(testRoots);
const testOnlyImplFiles = [];

for (const file of tsFiles) {
  const fileRel = rel(file);
  const isTest = /\.test\.(ts|tsx)$/.test(fileRel);
  const inProd = prodReachable.has(file);
  const inTest = testReachable.has(file);
  if (!inProd && !inTest) {
    violations.push(`Orphaned/unreachable source file: ${fileRel}`);
  } else if (!isTest && !inProd && inTest) {
    testOnlyImplFiles.push(fileRel);
    warnings.push(`Implementation module reachable only from tests (not production entry): ${fileRel}`);
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const RUNTIME_PEER_DEPS = new Set(['react-dom', '@emotion/react', '@emotion/styled']);
for (const dep of Object.keys(pkg.dependencies ?? {})) {
  if (
    !prodExternalImports.has(dep) &&
    !toolingExternalImports.has(dep) &&
    !RUNTIME_PEER_DEPS.has(dep)
  ) {
    if (testExternalImports.has(dep)) {
      warnings.push(`Dependency used only in tests belongs in devDependencies: ${dep}`);
    } else {
      warnings.push(`Unused dependency in package.json: ${dep}`);
    }
  }
}

const implCount = tsFiles.filter((f) => !/\.test\.(ts|tsx)$/.test(rel(f))).length;
console.log(
  `Checked ${tsFiles.length} TypeScript files (${implCount} implementation files, ${prodReachable.size} production-reachable, ${testRoots.length} test files, ${testOnlyImplFiles.length} test-only) and ${cssFiles.length} CSS files.`
);
for (const w of warnings) console.log(`WARN: ${w}`);
if (violations.length > 0) {
  console.error(`\nArchitecture check FAILED with ${violations.length} violation(s):`);
  for (const v of violations) console.error(` - ${v}`);
  process.exit(1);
}
console.log('Architecture check PASSED with 0 violations.');

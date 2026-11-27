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

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromFile), specifier);
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
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

const allSrcFiles = walk(SRC_DIR);
const tsFiles = allSrcFiles.filter((f) => /\.(ts|tsx)$/.test(f));
const cssFiles = allSrcFiles.filter((f) => f.endsWith('.css')).map(rel);

const violations = [];
const warnings = [];
const graph = new Map();
const externalImports = new Set();

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

  function recordEdge(spec) {
    if (!spec.startsWith('.')) {
      const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      externalImports.add(pkg);
    }
    const resolved = resolveImport(file, spec);
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

      if (!isTest && !fileRel.startsWith('src/design-system/')) {
        if (spec === '@mui/material' && node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
          for (const el of node.importClause.namedBindings.elements) {
            if (PROHIBITED_MUI_PRIMITIVES.has(el.name.text)) {
              violations.push(`Prohibited direct MUI primitive '${el.name.text}' outside design-system: ${fileRel}`);
            }
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

// Reachability from main.tsx and tests
const reachable = new Set();
const roots = tsFiles.filter(
  (f) => rel(f) === 'src/main.tsx' || rel(f) === 'src/vite-env.d.ts' || /\.test\.(ts|tsx)$/.test(rel(f))
);
const queue = [...roots];
while (queue.length > 0) {
  const cur = queue.shift();
  if (reachable.has(cur)) continue;
  reachable.add(cur);
  for (const next of graph.get(cur) ?? []) {
    if (!reachable.has(next)) queue.push(next);
  }
}
for (const file of tsFiles) {
  if (!reachable.has(file)) {
    violations.push(`Orphaned/unreachable source file: ${rel(file)}`);
  }
}

// Informational check for template runtime dependencies not imported in src/
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
for (const dep of Object.keys(pkg.dependencies ?? {})) {
  if (!externalImports.has(dep) && !['react-dom', '@emotion/react', '@emotion/styled', '@tailwindcss/vite', '@vitejs/plugin-react', 'vite'].includes(dep)) {
    warnings.push(`Unused dependency in package.json (retained for lockfile compatibility): ${dep}`);
  }
}

console.log(`Checked ${tsFiles.length} TypeScript files (${tsFiles.filter((f) => !/\.test\./.test(f)).length} implementation files) and ${cssFiles.length} CSS files.`);
for (const w of warnings) console.log(`WARN: ${w}`);
if (violations.length > 0) {
  console.error(`\nArchitecture check FAILED with ${violations.length} violation(s):`);
  for (const v of violations) console.error(` - ${v}`);
  process.exit(1);
}
console.log('Architecture check PASSED with 0 violations.');

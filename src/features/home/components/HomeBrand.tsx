import React, { type ReactNode } from 'react';

export function HomeLogo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const lg = size === 'lg';
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`grid place-items-center bg-gradient-to-br from-[#f2a516] to-[#e0761b] shadow-[0_4px_12px_-4px_rgba(224,118,27,0.6)] ${
          lg ? 'size-10 rounded-[12px]' : 'size-9 rounded-[11px]'
        }`}
      >
        <div
          className={`grid place-items-center bg-white/95 ${
            lg ? 'size-[26px] rounded-[8px]' : 'size-6 rounded-[7px]'
          }`}
        >
          <span
            className={`home2-font-bn leading-none font-bold text-[#1c3d70] ${
              lg ? 'text-[15px]' : 'text-[13px]'
            }`}
          >
            ৳
          </span>
        </div>
      </div>
      <div className="leading-none">
        <div
          className={`home2-font-bn font-bold tracking-tight text-[#0f1d34] ${
            lg ? 'text-[21px]' : 'text-[19px]'
          }`}
        >
          সহজকর
        </div>
        <div
          className={`home2-font-bn mt-0.5 font-medium text-[#5d697e] ${
            lg ? 'text-[10.5px]' : 'text-[9.5px]'
          }`}
        >
          আমার করেই গড়ব স্বদেশ
        </div>
      </div>
    </div>
  );
}

export function HomeTile({
  className = '',
  children,
  delay = 0,
}: {
  className?: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <div className={`home2-rise ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

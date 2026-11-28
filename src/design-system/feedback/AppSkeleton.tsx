import React from 'react';

export interface AppSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table-row';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export const AppSkeleton: React.FC<AppSkeletonProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full aspect-square';
      case 'card':
        return 'rounded-2xl h-36 w-full';
      case 'table-row':
        return 'rounded-lg h-10 w-full';
      case 'rectangular':
        return 'rounded-lg';
      case 'text':
      default:
        return 'rounded h-4 w-full';
    }
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  const items = Array.from({ length: count });

  return (
    <div className="flex flex-col gap-2 w-full" aria-busy="true" aria-live="polite">
      {items.map((_, idx) => (
        <div
          key={idx}
          style={style}
          className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${getVariantStyles()} ${className}`}
        />
      ))}
    </div>
  );
};

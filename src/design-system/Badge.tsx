import React from 'react';

export type BadgeVariant = 'emerald' | 'teal' | 'amber' | 'indigo' | 'slate' | 'rose';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  icon,
  className = '',
  id,
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    teal: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap select-none ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
};

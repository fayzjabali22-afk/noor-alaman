import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  accentBar?: 'PLATINUM' | 'GOLD' | 'BASIC' | 'NONE';
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  accentBar = 'NONE',
  className = '',
  onClick,
  id,
}) => {
  const accentBarStyles = {
    PLATINUM: 'bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400',
    GOLD: 'bg-gradient-to-r from-amber-400 to-emerald-500',
    BASIC: 'bg-slate-700',
    NONE: '',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden transition-all duration-200 shadow-lg ${
        onClick ? 'cursor-pointer hover:border-slate-700 hover:shadow-2xl' : ''
      } ${className}`}
    >
      {accentBar !== 'NONE' && (
        <div className={`absolute top-0 right-0 left-0 h-1 ${accentBarStyles[accentBar]}`} />
      )}
      {children}
    </div>
  );
};

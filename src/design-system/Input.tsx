import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  id: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="space-y-1.5 text-right" dir="rtl">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-300">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full bg-slate-950 border text-xs text-white placeholder-slate-500 rounded-xl py-2.5 px-3.5 transition focus:outline-none focus:border-emerald-500 ${
            icon ? 'pr-10' : ''
          } ${error ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800'} ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-[11px] text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  id: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="space-y-1.5 text-right" dir="rtl">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-300">
          {label}
        </label>
      )}

      <textarea
        id={id}
        className={`w-full bg-slate-950 border text-xs text-white placeholder-slate-500 rounded-xl p-3.5 transition focus:outline-none focus:border-emerald-500 ${
          error ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-[11px] text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

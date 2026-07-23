import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

// Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 hover:-translate-y-[1px] active:scale-[0.98] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 disabled:translate-y-0 disabled:scale-100 cursor-pointer",
          {
            "bg-gradient-to-b from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 shadow-[0_2px_8px_-3px_rgba(15,23,42,0.4)] ring-1 ring-inset ring-gray-700/50": variant === 'primary',
            "bg-white text-gray-700 border border-gray-200/80 hover:bg-gray-50 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]": variant === 'secondary',
            "bg-red-50 text-red-600 hover:bg-red-100": variant === 'danger',
            "hover:bg-gray-100/80 text-gray-700": variant === 'ghost',
            "h-8 px-3 text-xs rounded-lg": size === 'sm',
            "h-9 px-4 text-sm rounded-[10px]": size === 'md',
            "h-11 px-6 text-base rounded-xl": size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Card
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-white rounded-[20px] border border-gray-200/60 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02),0_4px_10px_-2px_rgba(0,0,0,0.01)]", className)} {...props} />;
}

// Badge
export function Badge({ className, variant = 'neutral', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'neutral' | 'success' | 'warning' | 'error' | 'brand' }) {
  return (
    <div className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border",
      {
        "bg-gray-50 text-gray-600 border-gray-200/60": variant === 'neutral',
        "bg-green-50/80 text-green-700 border-green-200/60": variant === 'success',
        "bg-amber-50/80 text-amber-700 border-amber-200/60": variant === 'warning',
        "bg-red-50/80 text-red-700 border-red-200/60": variant === 'error',
        "bg-blue-50/80 text-blue-700 border-blue-200/60": variant === 'brand',
      },
      className
    )} {...props} />
  );
}

// Input
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-gray-200/80 bg-white/50 px-3 py-2 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900/20 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Drawer
export function Drawer({ isOpen, onClose, children, title }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, title: string }) {
  if (!isOpen) return null;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%', opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0.5 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
        className="fixed inset-y-0 right-0 w-full max-w-[520px] bg-white/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col border-l border-gray-200/50"
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100/80 bg-white/50">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </>
  );
}

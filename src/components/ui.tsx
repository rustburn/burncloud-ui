import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

// ==========================================
// 1. BUTTONS (Tactile feedback, optical precision)
// ==========================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost' | 'brand';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const BCButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium tracking-tight transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/20 focus-visible:ring-offset-1",
          {
            // Primary & Brand (Precision Matte Space Black Titanium with silky specular top highlight)
            "bg-zinc-950 text-white hover:bg-zinc-850 active:bg-black shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.12)] border border-zinc-800 font-semibold": variant === 'primary' || variant === 'brand',
            // Secondary (Crisp White surface with hairline border & optical depth)
            "bg-white text-gray-900 border border-gray-200/90 hover:bg-gray-50 hover:border-gray-300 shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:bg-gray-100 font-semibold": variant === 'secondary',
            // Tertiary (Subtle tinted button)
            "bg-gray-100/90 text-gray-700 hover:bg-gray-200/80 border border-transparent active:bg-gray-200 font-medium": variant === 'tertiary',
            // Danger (Soft red warning)
            "bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100/80 hover:border-rose-300 active:bg-rose-200/60 font-medium": variant === 'danger',
            // Ghost (Zero chrome)
            "bg-transparent text-gray-600 hover:text-gray-950 hover:bg-gray-100/80 active:bg-gray-200/60 font-medium": variant === 'ghost',
            // Proportional Sizes
            "h-7 px-2.5 text-xs rounded-lg gap-1.5 font-medium": size === 'xs',
            "h-8.5 px-3 text-xs rounded-xl gap-1.5 font-medium": size === 'sm',
            "h-10 px-4 text-[13px] rounded-xl gap-2 font-semibold": size === 'md',
            "h-11 px-5 text-sm rounded-2xl gap-2.5 font-semibold": size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
        )}
        {children}
      </button>
    );
  }
);
BCButton.displayName = "BCButton";
export const Button = BCButton;

// ==========================================
// 2. BADGE & STATUS INDICATORS
// ==========================================
export type StatusType = 'Healthy' | 'Ready' | 'Online' | 'Running' | 'Degraded' | 'At Risk' | 'Offline' | 'Critical' | 'Draining' | 'Active' | 'Revoked';

export function BCBadge({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'brand' | 'accent';
  size?: 'sm' | 'md';
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center font-medium font-mono uppercase tracking-wider border rounded-full select-none whitespace-nowrap",
        {
          "bg-gray-100/80 text-gray-700 border-gray-200/80": variant === 'neutral',
          "bg-emerald-50 text-emerald-800 border-emerald-200/80": variant === 'success',
          "bg-amber-50 text-amber-800 border-amber-200/80": variant === 'warning',
          "bg-rose-50 text-rose-800 border-rose-200/80": variant === 'error',
          "bg-zinc-900 text-zinc-100 border-zinc-800": variant === 'brand',
          "bg-zinc-100 text-zinc-800 border-zinc-200/90": variant === 'accent',
          "text-[10px] px-2 py-0.5 leading-none font-semibold": size === 'sm',
          "text-[11px] px-2.5 py-0.5 leading-tight font-semibold": size === 'md',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
export const Badge = BCBadge;

export function BCStatus({
  status,
  label,
  className
}: {
  status: StatusType | string;
  label?: string;
  className?: string;
}) {
  const isHealthy = ['Healthy', 'Ready', 'Online', 'Running', 'Active'].includes(status);
  const isWarning = ['Degraded', 'At Risk', 'Draining'].includes(status);
  const isDanger = ['Offline', 'Critical', 'Revoked'].includes(status);

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium tracking-tight", className)}>
      <span
        className={cn("w-2 h-2 rounded-full flex-shrink-0", {
          "bg-emerald-500 ring-4 ring-emerald-500/10": isHealthy,
          "bg-amber-500 ring-4 ring-amber-500/15 animate-pulse": isWarning,
          "bg-rose-500 ring-4 ring-rose-500/15": isDanger,
          "bg-gray-400 ring-4 ring-gray-400/10": !isHealthy && !isWarning && !isDanger,
        })}
      />
      <span className={cn({
        "text-gray-900 font-semibold": isHealthy,
        "text-amber-800 font-semibold": isWarning,
        "text-rose-800 font-semibold": isDanger,
        "text-gray-600": !isHealthy && !isWarning && !isDanger,
      })}>
        {label || status}
      </span>
    </span>
  );
}

// ==========================================
// 3. CARDS & CONTAINERS (Crisp, mathematically pure)
// ==========================================
export function BCCard({
  className,
  hoverable = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hoverable?: boolean }) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-200",
        hoverable && "hover:border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}
export const Card = BCCard;

// ==========================================
// 4. METRICS WIDGET (Mathematical, punchy, scan-friendly)
// ==========================================
export function BCMetric({
  label,
  value,
  unit,
  trend,
  trendPositive,
  subtitle,
  status,
  className
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  trend?: string;
  trendPositive?: boolean;
  subtitle?: string;
  status?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-5 sm:p-6 bg-white rounded-2xl border border-gray-200/80 space-y-2.5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:border-gray-300/90 transition-colors", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">{label}</span>
        {status}
      </div>
      <div className="flex items-baseline gap-2 pt-0.5">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 font-mono tabular-nums">
          {value}
        </span>
        {unit && <span className="text-xs font-semibold text-gray-400 font-sans tracking-normal">{unit}</span>}
      </div>
      {(trend || subtitle) && (
        <div className="flex items-center gap-2 text-xs pt-0.5">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md font-mono font-semibold text-[11px]",
                trendPositive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-gray-100 text-gray-600 border border-gray-200/60"
              )}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-gray-500 text-[11px] truncate font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. PAGE HEADER (Visual breathing room & hierarchy)
// ==========================================
export function BCPageHeader({
  title,
  subtitle,
  conclusion,
  actions,
  badge,
  className
}: {
  title: string;
  subtitle?: string;
  conclusion?: {
    text: string;
    type?: 'healthy' | 'warning' | 'critical' | 'info';
  };
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-7 space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-gray-950 font-sans">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="text-sm text-gray-500 font-medium">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2.5 flex-shrink-0">{actions}</div>}
      </div>

      {conclusion && (
        <div
          className={cn(
            "px-4 py-2.5 rounded-xl border flex items-center gap-3 text-xs font-medium transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]",
            {
              "bg-emerald-50/70 border-emerald-200/80 text-emerald-900": conclusion.type === 'healthy' || !conclusion.type,
              "bg-amber-50/80 border-amber-200 text-amber-900": conclusion.type === 'warning',
              "bg-rose-50/80 border-rose-200 text-rose-900": conclusion.type === 'critical',
              "bg-zinc-100/90 border-zinc-200 text-zinc-900": conclusion.type === 'info',
            }
          )}
        >
          {conclusion.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
          {conclusion.type === 'critical' && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
          {(conclusion.type === 'healthy' || !conclusion.type) && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          )}
          {conclusion.type === 'info' && <Info className="w-4 h-4 text-zinc-700 flex-shrink-0" />}
          <span className="leading-snug font-medium">{conclusion.text}</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. FORM INPUTS & SEARCH
// ==========================================
export const BCInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9.5 w-full rounded-xl border border-gray-200/90 bg-white px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
BCInput.displayName = "BCInput";
export const Input = BCInput;

export function BCSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative w-full", className)}>
      <svg
        className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-9.5 bg-gray-50/90 hover:bg-gray-100/70 border border-gray-200/80 rounded-xl pl-9.5 pr-3.5 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all font-sans"
        {...props}
      />
    </div>
  );
}

// ==========================================
// 7. ALERT BOX
// ==========================================
export function BCAlert({
  title,
  description,
  variant = 'info',
  action,
  className
}: {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-4.5 rounded-2xl border flex items-start gap-3.5 text-xs shadow-xs",
        {
          "bg-zinc-100/90 border-zinc-200/90 text-zinc-900": variant === 'info',
          "bg-emerald-50/70 border-emerald-200/80 text-emerald-900": variant === 'success',
          "bg-amber-50/80 border-amber-200 text-amber-900": variant === 'warning',
          "bg-rose-50/80 border-rose-200 text-rose-900": variant === 'danger',
        },
        className
      )}
    >
      <div className="flex-1 space-y-1">
        <h4 className="font-bold text-gray-950">{title}</h4>
        {description && <p className="text-[11px] opacity-90 leading-relaxed font-medium">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ==========================================
// 8. MODAL DIALOG (Apple Spring Physics)
// ==========================================
export function BCModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg"
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-gray-950/30 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 26, stiffness: 350 }}
          className={cn(
            "relative w-full bg-white rounded-2xl border border-gray-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden z-10 my-8",
            maxWidth
          )}
        >
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-950">{title}</h3>
              {subtitle && <p className="text-xs text-gray-500 mt-0.5 font-medium">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ==========================================
// 9. DRAWER / SLIDEOVER (Fluid iOS-like Slide)
// ==========================================
export function BCDrawer({
  isOpen,
  onClose,
  children,
  title,
  subtitle
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-gray-950/25 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          className="w-screen max-w-md md:max-w-xl bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col border-l border-gray-200/90"
        >
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-950">{title}</h2>
              {subtitle && <p className="text-xs text-gray-500 mt-0.5 font-medium">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
export const Drawer = BCDrawer;

// ==========================================
// 10. EMPTY STATE
// ==========================================
export function BCEmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="p-12 text-center bg-white rounded-2xl border border-gray-200/80 space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="w-11 h-11 mx-auto rounded-xl bg-gray-100/90 flex items-center justify-center text-gray-600">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-bold text-gray-900">{title}</h4>
      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed font-medium">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

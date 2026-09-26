import { LoaderCircle } from 'lucide-react';

export function BrandMark({ brand, compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="bg-accent-gradient grid size-9 place-items-center rounded-xl text-white shadow-soft">
        <svg viewBox="0 0 32 32" className="size-5" aria-hidden="true">
          <path d="M8 23V13.5l8-6 8 6V23" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="16" cy="18" r="2.4" fill="currentColor" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-[17px] font-semibold tracking-tight">{brand.companyName}</span>
          <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Design Studio</span>
        </span>
      )}
    </div>
  );
}

const VARIANTS = {
  primary: 'bg-accent-gradient text-white shadow-soft hover:shadow-lift hover:-translate-y-px',
  secondary: 'bg-surface text-ink border border-line hover:border-ink/30 shadow-soft',
  ghost: 'text-muted hover:text-ink hover:bg-surface-2'
};
const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-14 px-7 text-base gap-2.5'
};

export function Button({ variant = 'primary', size = 'md', loading = false, disabled = false, icon: Icon, children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" /> : Icon && <Icon className="size-4" />}
      {children}
    </button>
  );
}

// Striscia di colori; usata per opzioni, palette e prodotti
export function SwatchStrip({ colors, className = 'h-3' }) {
  if (!colors?.length) return null;
  return (
    <div className={`flex overflow-hidden rounded-full ${className}`}>
      {colors.map((c, i) => <span key={`${c}-${i}`} className="flex-1" style={{ background: c }} />)}
    </div>
  );
}

// Sfondo "atmosfera" a partire da 1-3 colori
export function moodGradient(colors) {
  const [a = '#e7e0d6', b = a, c = b] = colors ?? [];
  return `radial-gradient(120% 90% at 0% 0%, ${a} 0%, transparent 60%), radial-gradient(120% 90% at 100% 100%, ${c} 0%, transparent 65%), linear-gradient(135deg, ${a}, ${b})`;
}

export function Eyebrow({ children, className = '' }) {
  return <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] text-muted ${className}`}>{children}</p>;
}

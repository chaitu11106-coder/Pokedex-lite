import { TYPE_COLORS } from '@/types/pokemon';
import { cn } from '@/utils/helpers';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function TypeBadge({ type, size = 'md', className }: TypeBadgeProps) {
  const colors = TYPE_COLORS[type] ?? { bg: '#444', text: '#fff', border: '#666', glow: 'rgba(68,68,68,0.5)' };

  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5 tracking-widest',
    md: 'text-[10px] px-3 py-1 tracking-[0.15em]',
    lg: 'text-xs px-4 py-1.5 tracking-[0.18em]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm font-orbitron font-semibold uppercase clip-corner-sm',
        sizeClasses[size],
        className
      )}
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 0 8px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
    >
      {type}
    </span>
  );
}

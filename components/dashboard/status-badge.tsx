import React from 'react';
import { cn } from '@/lib/utils';
import { STATUS_COLORS } from '@/types/common';

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'dot' | 'outline';
}

export function StatusBadge({
  status,
  label,
  className,
  variant = 'default',
}: StatusBadgeProps) {
  const displayLabel = label || status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS.pending;

  if (variant === 'dot') {
    return (
      <div className="flex items-center gap-2">
        <div className={cn('w-2 h-2 rounded-full', colorClass)} />
        <span className="text-sm text-foreground">{displayLabel}</span>
      </div>
    );
  }

  if (variant === 'outline') {
    return (
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
          colorClass,
          className
        )}
      >
        {displayLabel}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
        colorClass,
        className
      )}
    >
      {displayLabel}
    </span>
  );
}

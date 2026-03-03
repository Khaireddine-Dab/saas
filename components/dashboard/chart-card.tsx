'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export function ChartCard({
  title,
  description,
  children,
  className,
  footer,
}: ChartCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-lg p-6', className)}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>

      {/* Chart */}
      <div className="w-full h-80 mb-4">{children}</div>

      {/* Footer */}
      {footer && <div className="text-sm text-muted-foreground border-t border-border pt-4">{footer}</div>}
    </div>
  );
}

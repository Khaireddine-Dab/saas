import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, formatPercentage } from '@/lib/helpers';

interface KPICardProps {
  label: string;
  value: number | string;
  change?: number;
  percentageChange?: number;
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'currency' | 'percentage';
  icon?: React.ReactNode;
  className?: string;
}

export function KPICard({
  label,
  value,
  change,
  percentageChange,
  trend = 'stable',
  format = 'number',
  icon,
  className,
}: KPICardProps) {
  const displayValue =
    typeof value === 'number' && format === 'number' ? formatNumber(value) : value;

  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg p-6 flex flex-col gap-4 hover:border-muted transition-colors',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-foreground">{displayValue}</h3>
        </div>
        {icon && <div className="text-muted-foreground flex-shrink-0">{icon}</div>}
      </div>

      {/* Footer - Change info */}
      {(change !== undefined || percentageChange !== undefined) && (
        <div className="flex items-center gap-2 text-sm">
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded',
              trend === 'up' && 'bg-green-500/20 text-green-400',
              trend === 'down' && 'bg-red-500/20 text-red-400',
              trend === 'stable' && 'bg-muted text-muted-foreground'
            )}
          >
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'stable' && <Minus className="w-3 h-3" />}
            <span>
              {trend === 'stable' ? 'No change' : `${percentageChange || 0}% vs last period`}
            </span>
          </div>
          {change !== undefined && (
            <span className="text-muted-foreground">
              ({change > 0 ? '+' : ''}{formatNumber(change)})
            </span>
          )}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskLevel, RISK_COLORS } from '@/types/common';

interface RiskScoreBadgeProps {
  score: number;
  level?: RiskLevel;
  showScore?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskScoreBadge({
  score,
  level,
  showScore = true,
  className,
  size = 'md',
}: RiskScoreBadgeProps) {
  // Determine risk level from score if not provided
  const getRiskLevel = (): RiskLevel => {
    if (level) return level;
    if (score <= 20) return 'low';
    if (score <= 50) return 'medium';
    if (score <= 75) return 'high';
    return 'critical';
  };

  const riskLevel = getRiskLevel();
  const colorClass = RISK_COLORS[riskLevel];

  const getIcon = () => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'medium':
        return <Info className="w-4 h-4" />;
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const labelText = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-medium',
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      {getIcon()}
      <span>{labelText}</span>
      {showScore && <span className="ml-1 font-bold">{score}</span>}
    </span>
  );
}

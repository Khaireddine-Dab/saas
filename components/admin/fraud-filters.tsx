'use client';

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { AlertSeverity, AlertStatus, AlertType } from '@/types/fraud';

interface FraudFiltersProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedSeverity?: AlertSeverity[];
  onSeverityChange?: (severity: AlertSeverity[]) => void;
  selectedStatus?: AlertStatus[];
  onStatusChange?: (status: AlertStatus[]) => void;
  selectedType?: AlertType[];
  onTypeChange?: (type: AlertType[]) => void;
  selectedEntityType?: string[];
  onEntityTypeChange?: (type: string[]) => void;
}

const severityOptions: AlertSeverity[] = ['critical', 'high', 'medium', 'low'];
const statusOptions: AlertStatus[] = ['open', 'investigating', 'resolved', 'false_positive'];
const typeOptions: AlertType[] = ['suspicious_activity', 'fake_review', 'unusual_spike', 'suspicious_seller', 'payment_fraud', 'bot_activity'];
const entityTypes = ['user', 'order', 'business', 'product', 'review'];

const severityColors = {
  critical: 'bg-red-500/30 text-red-300 hover:bg-red-500/40',
  high: 'bg-orange-500/30 text-orange-300 hover:bg-orange-500/40',
  medium: 'bg-yellow-500/30 text-yellow-300 hover:bg-yellow-500/40',
  low: 'bg-green-500/30 text-green-300 hover:bg-green-500/40',
};

const statusColors = {
  open: 'bg-red-500/30 text-red-300 hover:bg-red-500/40',
  investigating: 'bg-yellow-500/30 text-yellow-300 hover:bg-yellow-500/40',
  resolved: 'bg-green-500/30 text-green-300 hover:bg-green-500/40',
  false_positive: 'bg-slate-500/30 text-slate-300 hover:bg-slate-500/40',
};

export function FraudFilters({
  searchQuery = '',
  onSearchChange,
  selectedSeverity = [],
  onSeverityChange,
  selectedStatus = [],
  onStatusChange,
  selectedType = [],
  onTypeChange,
  selectedEntityType = [],
  onEntityTypeChange,
}: FraudFiltersProps) {
  const toggleSeverity = (severity: AlertSeverity) => {
    const updated = selectedSeverity.includes(severity)
      ? selectedSeverity.filter(s => s !== severity)
      : [...selectedSeverity, severity];
    onSeverityChange?.(updated);
  };

  const toggleStatus = (status: AlertStatus) => {
    const updated = selectedStatus.includes(status)
      ? selectedStatus.filter(s => s !== status)
      : [...selectedStatus, status];
    onStatusChange?.(updated);
  };

  const toggleType = (type: AlertType) => {
    const updated = selectedType.includes(type)
      ? selectedType.filter(t => t !== type)
      : [...selectedType, type];
    onTypeChange?.(updated);
  };

  const toggleEntityType = (type: string) => {
    const updated = selectedEntityType.includes(type)
      ? selectedEntityType.filter(t => t !== type)
      : [...selectedEntityType, type];
    onEntityTypeChange?.(updated);
  };

  const hasActiveFilters = searchQuery || selectedSeverity.length > 0 || selectedStatus.length > 0 || selectedType.length > 0 || selectedEntityType.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search alerts by title, entity name..."
          value={searchQuery}
          onChange={e => onSearchChange?.(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Severity Filter */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Severity</div>
          <div className="flex flex-wrap gap-2">
            {severityOptions.map(severity => (
              <button
                key={severity}
                onClick={() => toggleSeverity(severity)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                  selectedSeverity.includes(severity)
                    ? severityColors[severity]
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {severity}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Status</div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                  selectedStatus.includes(status)
                    ? statusColors[status]
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Entity Type Filter */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Entity Type</div>
          <div className="flex flex-wrap gap-2">
            {entityTypes.map(type => (
              <button
                key={type}
                onClick={() => toggleEntityType(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                  selectedEntityType.includes(type)
                    ? 'bg-primary/30 text-primary hover:bg-primary/40'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Alert Type Filter */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Alert Type</div>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map(type => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedType.includes(type)
                    ? 'bg-secondary/30 text-secondary hover:bg-secondary/40'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {type.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Active Filters</div>
          <div className="flex flex-wrap gap-2">
            {selectedSeverity.map(s => (
              <Badge
                key={`severity-${s}`}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleSeverity(s)}
              >
                {s}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {selectedStatus.map(s => (
              <Badge
                key={`status-${s}`}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleStatus(s)}
              >
                {s.replace(/_/g, ' ')}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {selectedEntityType.map(t => (
              <Badge
                key={`entity-${t}`}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleEntityType(t)}
              >
                {t}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {selectedType.map(t => (
              <Badge
                key={`type-${t}`}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleType(t)}
              >
                {t.replace(/_/g, ' ')}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {searchQuery && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => onSearchChange?.('')}
              >
                Search: {searchQuery}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

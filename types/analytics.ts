export interface AnalyticsMetric {
  date: string;
  value: number;
  label?: string;
}

export interface TopSearchTerm {
  term: string;
  searchCount: number;
  resultCount: number;
  conversionCount: number;
  conversionRate: number;
  position?: number;
}

export interface SearchAnalytics {
  term: string;
  totalSearches: number;
  successfulSearches: number;
  failedSearches: number;
  averageResultsPerSearch: number;
  clickThroughRate: number;
  conversionRate: number;
}

export interface CategoryDemand {
  category: string;
  searchCount: number;
  productCount: number;
  businessCount: number;
  demandTrend: 'up' | 'down' | 'stable';
  percentageChange: number;
}

export interface UserBehaviorMetric {
  metric: string;
  value: number;
  change: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ConversionFunnel {
  stage: string;
  count: number;
  rate: number;
}

export interface HeatmapData {
  category: string;
  value: number;
  intensity: 'low' | 'medium' | 'high';
}

export interface KPIData {
  label: string;
  value: number;
  change: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'stable';
  icon?: string;
}

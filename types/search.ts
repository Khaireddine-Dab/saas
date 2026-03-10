export type SearchResultType = 'user' | 'order' | 'business' | 'product' | 'review' | 'coupon' | 'banner';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  url: string;
  metadata?: Record<string, any>;
  score: number;
}

export interface CommandGroup {
  label: string;
  commands: Command[];
}

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  action: () => void;
  shortcut?: string;
  category?: string;
}

export interface AdminSearchState {
  query: string;
  results: SearchResult[];
  recentSearches: string[];
  isLoading: boolean;
}

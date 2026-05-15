'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  AnalyticsMetric,
  TopSearchTerm,
  CategoryDemand,
  SearchAnalytics,
} from '@/types/analytics';

interface UseAnalyticsReturn {
  topSearchTerms: TopSearchTerm[];
  categoryDemand: CategoryDemand[];
  isLoading: boolean;
  error: string | null;
  fetchTopSearchTerms: () => Promise<void>;
  fetchCategoryDemand: () => Promise<void>;
}

// Données mock pour l'instant (à remplacer par des appels API)
const generateMockTopSearchTerms = (): TopSearchTerm[] => [
  { term: 'Wireless Headphones', searchCount: 15200, resultCount: 842, conversionCount: 156, conversionRate: 1.03, position: 1 },
  { term: 'Smartphone Cases', searchCount: 12400, resultCount: 3201, conversionCount: 142, conversionRate: 1.15, position: 2 },
  { term: 'Running Shoes', searchCount: 11800, resultCount: 2156, conversionCount: 198, conversionRate: 1.68, position: 3 },
  { term: 'Laptop Stand', searchCount: 9600, resultCount: 456, conversionCount: 89, conversionRate: 0.93, position: 4 },
  { term: 'USB Type-C Cable', searchCount: 8950, resultCount: 1232, conversionCount: 156, conversionRate: 1.74, position: 5 },
];

const generateMockCategoryDemand = (): CategoryDemand[] => [
  { category: 'Electronics', searchCount: 45200, productCount: 12400, businessCount: 856, demandTrend: 'up', percentageChange: 12.5 },
  { category: 'Fashion', searchCount: 38900, productCount: 8932, businessCount: 654, demandTrend: 'up', percentageChange: 8.3 },
  { category: 'Home & Garden', searchCount: 32100, productCount: 6234, businessCount: 432, demandTrend: 'stable', percentageChange: 2.1 },
  { category: 'Beauty & Personal Care', searchCount: 28500, productCount: 4856, businessCount: 324, demandTrend: 'down', percentageChange: -3.2 },
  { category: 'Sports & Outdoors', searchCount: 25600, productCount: 5123, businessCount: 298, demandTrend: 'up', percentageChange: 6.8 },
];

export function useAnalytics(): UseAnalyticsReturn {
  const [topSearchTerms, setTopSearchTerms] = useState<TopSearchTerm[]>([]);
  const [categoryDemand, setCategoryDemand] = useState<CategoryDemand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch top search terms
  const fetchTopSearchTerms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Remplacer par un appel API réel
      // const data = await analyticsApi.getTopSearchTerms();
      const data = generateMockTopSearchTerms();
      setTopSearchTerms(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des termes de recherche';
      setError(message);
      console.error('Error fetching top search terms:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch category demand
  const fetchCategoryDemand = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Remplacer par un appel API réel
      // const data = await analyticsApi.getCategoryDemand();
      const data = generateMockCategoryDemand();
      setCategoryDemand(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement de la demande par catégorie';
      setError(message);
      console.error('Error fetching category demand:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les données au montage
  useEffect(() => {
    fetchTopSearchTerms();
    fetchCategoryDemand();
  }, [fetchTopSearchTerms, fetchCategoryDemand]);

  return {
    topSearchTerms,
    categoryDemand,
    isLoading,
    error,
    fetchTopSearchTerms,
    fetchCategoryDemand,
  };
}

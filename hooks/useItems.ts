'use client';

import { useCallback, useMemo, useState } from 'react';
import { itemsApi } from '@/lib/api';
import { mapBackendItemsToFrontend, mapBackendItemToFrontend } from '@/lib/item-mapper';
import type { Item } from '@/types/item';

interface UseItemsReturn {
  items: Item[];
  allItems: Item[];
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  fetchItemsByStore: (storeId: number | string) => Promise<Item[]>;
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupère tous les items (produits et services)
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await itemsApi.getAll();
      const mappedItems = mapBackendItemsToFrontend(Array.isArray(data) ? data : []);
      setItems(mappedItems);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des items';
      setError(message);
      console.error('Erreur lors de la récupération des items:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupère les items d'une boutique spécifique
  const fetchItemsByStore = useCallback(async (storeId: number | string): Promise<Item[]> => {
    setError(null);
    try {
      const data = await itemsApi.getByStore(storeId as number);
      return mapBackendItemsToFrontend(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des items';
      setError(message);
      throw err;
    }
  }, []);

  return {
    items,
    allItems: items,
    isLoading,
    error,
    fetchItems,
    fetchItemsByStore,
  };
}

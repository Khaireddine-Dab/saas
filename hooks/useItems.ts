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
  deleteOrphanedItems: () => Promise<void>;
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
      // Gérer la réponse paginée de Django REST Framework
      const itemsList = Array.isArray(data) ? data : (data?.results || []);
      const mappedItems = mapBackendItemsToFrontend(itemsList);
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
      // Gérer la réponse paginée de Django REST Framework
      const itemsList = Array.isArray(data) ? data : (data?.results || []);
      return mapBackendItemsToFrontend(itemsList);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des items';
      setError(message);
      throw err;
    }
  }, []);

  // Supprime tous les items orphelins
  const deleteOrphanedItems = useCallback(async () => {
    setError(null);
    try {
      await itemsApi.deleteOrphaned();
      // Recharger les items après suppression
      await fetchItems();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression des items orphelins';
      setError(message);
      throw err;
    }
  }, [fetchItems]);

  return {
    items,
    allItems: items,
    isLoading,
    error,
    fetchItems,
    fetchItemsByStore,
    deleteOrphanedItems,
  };
}

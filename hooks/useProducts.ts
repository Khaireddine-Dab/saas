'use client';

import { useCallback, useMemo, useState } from 'react';
import { productsApi } from '@/lib/api';
import { mapBackendProductsToFrontend, mapBackendProductToFrontend } from '@/lib/product-mapper';
import type { Product } from '@/types/product';

interface UseProductsReturn {
  products: Product[];
  allProducts: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductsByStore: (storeId: number | string) => Promise<Product[]>;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupère tous les produits
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll();
      const mappedProducts = mapBackendProductsToFrontend(Array.isArray(data) ? data : []);
      setProducts(mappedProducts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des produits';
      setError(message);
      console.error('Erreur lors de la récupération des produits:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupère les produits d'une boutique spécifique
  const fetchProductsByStore = useCallback(async (storeId: number | string): Promise<Product[]> => {
    setError(null);
    try {
      const data = await productsApi.getByStore(storeId as number);
      return mapBackendProductsToFrontend(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des produits';
      setError(message);
      throw err;
    }
  }, []);

  return {
    products,
    allProducts: products,
    isLoading,
    error,
    fetchProducts,
    fetchProductsByStore,
  };
}

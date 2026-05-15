/**
 * useTransactions Hook
 * Fetches and manages transactions from the backend API
 * Supports filtering, searching, and pagination
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { BackendTransactionListResponse, BackendTransactionStats } from '@/types/backend-transaction';
import { mapBackendTransactionsToFrontend, FrontendTransaction } from '@/lib/transaction-mapper';

interface UseTransactionsOptions {
  status?: string;
  type?: string;
  merchant_id?: number;
  customer_id?: string;
  page?: number;
}

interface UseTransactionsReturn {
  transactions: FrontendTransaction[];
  stats: BackendTransactionStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  refetch: () => Promise<void>;
}

export function useTransactions(options: UseTransactionsOptions = {}): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<FrontendTransaction[]>([]);
  const [stats, setStats] = useState<BackendTransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });
  const [isMounted, setIsMounted] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!isMounted) return;

    try {
      setLoading(true);
      setError(null);

      // Build query string
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.type) params.append('type', options.type);
      if (options.merchant_id) params.append('merchant_id', options.merchant_id.toString());
      if (options.customer_id) params.append('customer_id', options.customer_id);
      if (options.page) params.append('page', options.page.toString());

      const queryString = params.toString();
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const url = `${baseUrl}/api/transactions/${queryString ? '?' + queryString : ''}`;

      // Get token from localStorage (only available on client)
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      // Fetch transactions
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
          errorData.errors ||
          `Failed to fetch transactions: ${response.statusText}`
        );
      }

      const data: BackendTransactionListResponse = await response.json();
      const mappedTransactions = mapBackendTransactionsToFrontend(data.results);
      setTransactions(mappedTransactions);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });

      // Fetch stats separately
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const statsResponse = await fetch(`${baseUrl}/api/transactions/stats/`, { headers });

        if (statsResponse.ok) {
          const statsData: BackendTransactionStats = await statsResponse.json();
          setStats(statsData);
        }
      } catch (statsError) {
        console.warn('Failed to fetch transaction stats:', statsError);
        // Don't fail the whole operation if stats fail
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      console.error('useTransactions error:', err);
    } finally {
      setLoading(false);
    }
  }, [options.status, options.type, options.merchant_id, options.customer_id, options.page, isMounted]);

  // Set mounted flag on client only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch on mount and when options change (only if mounted)
  useEffect(() => {
    if (isMounted) {
      fetchTransactions();
    }
  }, [isMounted, fetchTransactions]);

  return {
    transactions,
    stats,
    loading,
    error,
    pagination,
    refetch: fetchTransactions,
  };
}

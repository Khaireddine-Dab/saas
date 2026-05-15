'use client';

import { useState } from 'react';
import type { Banner } from '@/types/banner';
import type { BannerAPIResponse } from '@/types/backend-banner';
import { mapBannerFromAPI } from '@/lib/banner-mapper';

export interface CreateBannerInput {
  title: string;
  description?: string;
  image_url?: string;
  target_url?: string;
  placement: 'homepage' | 'category' | 'checkout' | 'popup';
  status: 'draft' | 'scheduled' | 'active' | 'inactive' | 'expired';
  priority: number;
  start_date: string;
  end_date: string;
  conversion_rate?: number;
  created_by?: string;
  store_id: number;
}

export interface UpdateBannerInput extends Partial<CreateBannerInput> {
  id: number;
}

export function useBannerMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  };

  const createBanner = async (data: CreateBannerInput): Promise<Banner | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/banners/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Failed to create banner: ${response.statusText}`
        );
      }

      const bannerAPI: BannerAPIResponse = await response.json();
      return mapBannerFromAPI(bannerAPI);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create banner';
      setError(errorMsg);
      console.error('[useBannerMutations] Create error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBanner = async (id: number, data: Partial<CreateBannerInput>): Promise<Banner | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/banners/${id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Failed to update banner: ${response.statusText}`
        );
      }

      const bannerAPI: BannerAPIResponse = await response.json();
      return mapBannerFromAPI(bannerAPI);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update banner';
      setError(errorMsg);
      console.error('[useBannerMutations] Update error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBanner = async (id: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/banners/${id}/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete banner: ${response.statusText}`);
      }

      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete banner';
      setError(errorMsg);
      console.error('[useBannerMutations] Delete error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBanner,
    updateBanner,
    deleteBanner,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

import { RiskLevel } from '@/types/common';
import { RISK_THRESHOLDS } from '@/lib/constants';

// Format currency
export const formatCurrency = (amount: number, currency: string = 'AED'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date and time
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format time ago
export const formatTimeAgo = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;

  return formatDate(d);
};

// Get risk level from score
export const getRiskLevel = (score: number): RiskLevel => {
  if (score <= RISK_THRESHOLDS.LOW) return 'low';
  if (score <= RISK_THRESHOLDS.MEDIUM) return 'medium';
  if (score <= RISK_THRESHOLDS.HIGH) return 'high';
  return 'critical';
};

// Format percentage
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Format number with commas
export const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US');
};

// Truncate text
export const truncateText = (text: string, length: number = 50): string => {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

// Check if email is valid
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate avatar URL (using DiceBear)
export const generateAvatarUrl = (seed: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
};

// Sort array of objects by key
export const sortBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Filter array of objects
export const filterBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  value: any
): T[] => {
  return array.filter((item) => item[key] === value);
};

// Group array by key
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

// Get statistics from array
export const getStats = (
  array: number[]
): {
  total: number;
  average: number;
  min: number;
  max: number;
} => {
  if (array.length === 0) {
    return { total: 0, average: 0, min: 0, max: 0 };
  }

  const total = array.reduce((sum, val) => sum + val, 0);
  const average = total / array.length;
  const min = Math.min(...array);
  const max = Math.max(...array);

  return { total, average, min, max };
};

// Calculate percentage change
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

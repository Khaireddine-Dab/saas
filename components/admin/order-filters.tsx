'use client';

import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import type { OrderFilter } from '@/types/order-extended';

interface OrderFiltersProps {
  onApplyFilters: (filters: OrderFilter) => void;
  onClearFilters: () => void;
}

export function OrderFilters({ onApplyFilters, onClearFilters }: OrderFiltersProps) {
  const [filters, setFilters] = useState<OrderFilter>({});
  const [isOpen, setIsOpen] = useState(false);

  const statuses = ['pending', 'approved', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
  const paymentMethods = ['credit_card', 'debit_card', 'wallet', 'bank_transfer', 'cod'];

  const handleStatusToggle = (status: string) => {
    setFilters(prev => {
      const current = prev.status || [];
      return {
        ...prev,
        status: current.includes(status)
          ? current.filter(s => s !== status)
          : [...current, status]
      };
    });
  };

  const handlePaymentStatusToggle = (status: string) => {
    setFilters(prev => {
      const current = prev.paymentStatus || [];
      return {
        ...prev,
        paymentStatus: current.includes(status)
          ? current.filter(s => s !== status)
          : [...current, status]
      };
    });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value ? parseInt(value) : undefined
      }
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({});
    onClearFilters();
    setIsOpen(false);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined).length;

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        Filters
        {activeFilterCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 bg-primary text-white text-xs rounded-full transform translate-x-2 -translate-y-2">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 p-4 z-50 shadow-lg">
          <div className="space-y-4">
            {/* Status Filter */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Order Status</h4>
              <div className="space-y-2">
                {statuses.map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(status) || false}
                      onChange={() => handleStatusToggle(status)}
                      className="w-4 h-4 rounded border-neutral-300"
                    />
                    <span className="text-sm capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Status Filter */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Payment Status</h4>
              <div className="space-y-2">
                {paymentStatuses.map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.paymentStatus?.includes(status) || false}
                      onChange={() => handlePaymentStatusToggle(status)}
                      className="w-4 h-4 rounded border-neutral-300"
                    />
                    <span className="text-sm capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Price Range</h4>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.min || ''}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.max || ''}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Button onClick={handleApply} size="sm" className="flex-1">
                Apply
              </Button>
              <Button onClick={handleClear} variant="outline" size="sm" className="flex-1">
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

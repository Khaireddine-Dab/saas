'use client';

import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrderScheduleCardProps {
  orderId: string;
  merchantName: string;
  category: string;
  price: number;
  currency: string;
  scheduledTime: string;
  status: 'pending' | 'accepted' | 'cancelled';
  onAccept: () => void;
  onCancel: () => void;
  onSchedule?: () => void;
}

export function OrderScheduleCard({
  orderId,
  merchantName,
  category,
  price,
  currency,
  scheduledTime,
  status,
  onAccept,
  onCancel,
  onSchedule,
}: OrderScheduleCardProps) {
  const statusBgColor = {
    pending: 'bg-yellow-50 border-yellow-200',
    accepted: 'bg-green-50 border-green-200',
    cancelled: 'bg-red-50 border-red-200',
  }[status];

  return (
    <div className={cn('border rounded-xl p-4 w-full max-w-sm transition-all', statusBgColor)}>
      {/* Status Badge */}
      <div className="flex items-start justify-between mb-3">
        <span className={cn(
          'inline-block px-3 py-1 rounded-full text-xs font-medium capitalize',
          status === 'pending' && 'bg-yellow-100 text-yellow-700',
          status === 'accepted' && 'bg-green-100 text-green-700',
          status === 'cancelled' && 'bg-red-100 text-red-700',
        )}>
          {status}
        </span>
      </div>

      {/* Merchant and Category */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1">{category}</div>
        <h3 className="text-base font-semibold text-gray-900">{merchantName}</h3>
        <div className="text-xs text-gray-500 mt-2">Order No.{orderId}</div>
      </div>

      {/* Driver/Details Link */}
      <div className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer mb-3">N/A</div>

      {/* Price and Time Box */}
      <div className="bg-yellow-300 rounded-lg p-3 mb-4">
        <div className="text-sm text-gray-700 mb-2">{scheduledTime}</div>
        <div className="text-xl font-bold text-gray-900">
          {currency} {price.toFixed(2)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-green-400 hover:bg-green-500 text-white rounded-full"
            onClick={onAccept}
            disabled={status !== 'pending'}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 bg-white hover:bg-gray-100 text-red-500 border border-red-200 rounded-full"
            onClick={onCancel}
            disabled={status !== 'pending'}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-full text-gray-700 border-gray-300"
          onClick={onSchedule}
        >
          SCHEDULE
        </Button>
      </div>
    </div>
  );
}

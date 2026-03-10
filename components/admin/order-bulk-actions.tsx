'use client';

import { useState } from 'react';
import { Trash2, CheckCircle, Clock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { BulkOrderAction } from '@/types/order-extended';

interface OrderBulkActionsProps {
  selectedOrderIds: string[];
  onApplyAction: (action: BulkOrderAction) => void;
  onClearSelection: () => void;
}

export function OrderBulkActions({
  selectedOrderIds,
  onApplyAction,
  onClearSelection,
}: OrderBulkActionsProps) {
  const [showMenu, setShowMenu] = useState(false);

  if (selectedOrderIds.length === 0) return null;

  const handleStatusUpdate = (newStatus: string) => {
    onApplyAction({
      action: 'status_update',
      selectedOrderIds,
      details: { newStatus },
    });
    setShowMenu(false);
  };

  const handleProcessRefund = () => {
    onApplyAction({
      action: 'process_refund',
      selectedOrderIds,
    });
    setShowMenu(false);
  };

  const handleSendNotification = () => {
    onApplyAction({
      action: 'send_notification',
      selectedOrderIds,
    });
    setShowMenu(false);
  };

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-blue-900">
          {selectedOrderIds.length} order(s) selected
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Actions
            </Button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Orders
                </button>
                <button
                  onClick={() => handleStatusUpdate('processing')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <Clock className="w-4 h-4" />
                  Mark as Processing
                </button>
                <button
                  onClick={() => handleStatusUpdate('shipped')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <Truck className="w-4 h-4" />
                  Mark as Shipped
                </button>
                <hr />
                <button
                  onClick={handleSendNotification}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Send Notification
                </button>
                <button
                  onClick={handleProcessRefund}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 text-sm"
                >
                  Process Refund
                </button>
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
        </div>
      </div>
    </Card>
  );
}

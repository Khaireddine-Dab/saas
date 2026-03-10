'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Truck, Clock, DollarSign, User } from 'lucide-react';
import { formatDate } from '@/lib/helpers';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderId: string;
  userName: string;
  status: 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt?: Date;
  estimatedDelivery?: Date;
  assignedDriver?: string;
  deliveryAddress?: string;
}

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
  onAssignDriver?: (orderId: string) => void;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onApprove,
  onCancel,
  onAssignDriver,
}: OrderDetailModalProps) {
  if (!order) return null;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-cyan-100 text-cyan-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const paymentStatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800',
  };

  const timelineEvents = [
    { status: 'pending', label: 'Order Created', icon: ShoppingCart },
    { status: 'approved', label: 'Approved', icon: Clock },
    { status: 'processing', label: 'Processing', icon: Clock },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: Clock },
  ];

  const currentStatusIndex = timelineEvents.findIndex(
    (e) => e.status === order.status
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - {order.orderId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Order Status</span>
              </div>
              <Badge className={statusColors[order.status]}>{order.status}</Badge>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Payment Status</span>
              </div>
              <Badge className={paymentStatusColors[order.paymentStatus]}>
                {order.paymentStatus}
              </Badge>
            </Card>
          </div>

          {/* Timeline */}
          <div className="py-4">
            <h3 className="font-semibold mb-4">Order Timeline</h3>
            <div className="flex gap-2">
              {timelineEvents.map((event, index) => {
                const IconComponent = event.icon;
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={event.status} className="flex items-center flex-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isCompleted
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 bg-gray-50'
                      } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${
                          isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    {index < timelineEvents.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-1 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h3>
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Customer Name</div>
                  <div className="font-medium">{order.userName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Created At</div>
                  <div className="font-medium">{formatDate(order.createdAt)}</div>
                </div>
                {order.deliveryAddress && (
                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground">Delivery Address</div>
                    <div className="font-medium">{order.deliveryAddress}</div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-end">
            <Card className="p-4 w-full md:w-64">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-green-600">${order.totalAmount.toFixed(2)}</span>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {order.status === 'pending' && onApprove && (
              <Button onClick={() => onApprove(order.id)} className="bg-green-600 hover:bg-green-700">
                Approve Order
              </Button>
            )}
            {order.status === 'pending' && onCancel && (
              <Button onClick={() => onCancel(order.id)} variant="destructive">
                Cancel Order
              </Button>
            )}
            {order.status === 'approved' && onAssignDriver && (
              <Button onClick={() => onAssignDriver(order.id)} variant="outline">
                <Truck className="w-4 h-4 mr-2" />
                Assign Driver
              </Button>
            )}
            <Button onClick={onClose} className="ml-auto">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

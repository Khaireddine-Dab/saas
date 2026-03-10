'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin, Calendar, Shield, Clock } from 'lucide-react';
import { formatDate } from '@/lib/helpers';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  joinDate: Date;
  activityScore: number;
  lastLogin?: Date;
  location?: string;
  subscriptionTier?: 'free' | 'premium' | 'enterprise';
  totalOrders?: number;
  totalSpent?: number;
}

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onBlock?: (userId: string) => void;
  onUnblock?: (userId: string) => void;
  onEdit?: (user: User) => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onBlock,
  onUnblock,
  onEdit,
}: UserDetailModalProps) {
  if (!user) return null;

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    banned: 'bg-red-100 text-red-800',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-start justify-between border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{user.role}</Badge>
                <Badge className={statusColors[user.status]}>{user.status}</Badge>
                {user.subscriptionTier && (
                  <Badge variant="secondary">{user.subscriptionTier}</Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Activity Score</div>
              <div className="text-2xl font-bold text-primary">{user.activityScore}%</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium truncate">{user.email}</div>
                </div>
              </div>
            </Card>

            {user.phone && (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium">{user.phone}</div>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Join Date</div>
                  <div className="font-medium">{formatDate(user.joinDate)}</div>
                </div>
              </div>
            </Card>

            {user.lastLogin && (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Last Login</div>
                    <div className="font-medium">{formatDate(user.lastLogin)}</div>
                  </div>
                </div>
              </Card>
            )}

            {user.location && (
              <Card className="p-4 md:col-span-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium">{user.location}</div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Account Statistics */}
          {(user.totalOrders || user.totalSpent) && (
            <div className="grid grid-cols-2 gap-4">
              {user.totalOrders !== undefined && (
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                  <div className="text-2xl font-bold text-foreground">{user.totalOrders}</div>
                </Card>
              )}
              {user.totalSpent !== undefined && (
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                  <div className="text-2xl font-bold text-foreground">${user.totalSpent.toLocaleString()}</div>
                </Card>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {onEdit && (
              <Button onClick={() => onEdit(user)} variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
            {user.status === 'active' && onBlock && (
              <Button onClick={() => onBlock(user.id)} variant="destructive">
                Block User
              </Button>
            )}
            {user.status === 'suspended' && onUnblock && (
              <Button onClick={() => onUnblock(user.id)} variant="outline">
                Unblock User
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

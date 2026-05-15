'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { formatNumber } from '@/lib/helpers';
import { storesApi } from '@/lib/api';

interface Store {
  id: number;
  name: string;
  slug: string;
  description?: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  status: string;
  rne?: string;
  latitude: number;
  longitude: number;
  rating_average: number;
  total_reviews: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
  owner: string;
  owner_details?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
  };
}

export default function BusinessesPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof Store>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    storesApi.getAll()
      .then((data: any) => {
        const list = Array.isArray(data) ? data : (data?.results ?? []);
        setStores(list);
      })
      .catch((err: any) => console.error('Failed to fetch stores:', err))
      .finally(() => setLoading(false));
  }, []);

  const statusOptions = ['PENDING', 'PUBLISHED', 'REJECTED'];

  const statusCounts = {
    PENDING: stores.filter(s => s.status === 'PENDING').length,
    PUBLISHED: stores.filter(s => s.status === 'PUBLISHED').length,
    REJECTED: stores.filter(s => s.status === 'REJECTED').length,
  };

  const filtered = stores.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.owner_details?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.owner_details?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Store, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const avgRating = stores.length
    ? (stores.reduce((sum, s) => sum + Number(s.rating_average), 0) / stores.length).toFixed(1)
    : '—';

  const totalOrders = stores.reduce((sum, s) => sum + (s.total_orders || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Boutiques</h1>
          <p className="text-muted-foreground mt-2">Gérez toutes les boutiques et vendeurs de la marketplace</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom, ville, propriétaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={!statusFilter ? 'default' : 'outline'}
            size="default"
            onClick={() => setStatusFilter(null)}
          >
            Toutes ({stores.length})
          </Button>
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="default"
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()} ({statusCounts[status as keyof typeof statusCounts]})
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total boutiques</p>
          <p className="text-2xl font-bold text-foreground">{loading ? '...' : formatNumber(stores.length)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Note moyenne</p>
          <p className="text-2xl font-bold text-foreground">{loading ? '...' : `${avgRating} ⭐`}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total commandes</p>
          <p className="text-2xl font-bold text-foreground">{loading ? '...' : formatNumber(totalOrders)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">En attente</p>
          <p className="text-2xl font-bold text-yellow-500">{loading ? '...' : statusCounts.PENDING}</p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
          Chargement des boutiques...
        </div>
      ) : (
        <DataTable<Store>
          columns={[
            {
              key: 'name',
              label: 'Boutique',
              sortable: true,
              render: (value, row) => (
                <div>
                  <p className="font-medium text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{row.owner_details?.full_name ?? '—'}</p>
                </div>
              ),
            },
            {
              key: 'city',
              label: 'Localisation',
              sortable: true,
              render: (value, row) => (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{row.city}</span>
                </div>
              ),
            },
            {
              key: 'status',
              label: 'Statut',
              sortable: true,
              render: (value) => <StatusBadge status={value} />,
            },
            {
              key: 'rating_average',
              label: 'Note',
              sortable: true,
              render: (value, row) => (
                <div>
                  <p className="font-medium text-foreground">{Number(value).toFixed(1)} ⭐</p>
                  <p className="text-xs text-muted-foreground">{row.total_reviews} avis</p>
                </div>
              ),
            },
            {
              key: 'total_orders',
              label: 'Commandes',
              sortable: true,
              render: (value) => formatNumber(value ?? 0),
            },
            {
              key: 'created_at',
              label: 'Inscrit le',
              sortable: true,
              render: (value) => value ? new Date(value).toLocaleDateString('fr-FR') : '—',
            },
          ]}
          data={sorted}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
      )}
    </div>
  );
}

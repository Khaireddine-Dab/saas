'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { RiskScoreBadge } from '@/components/dashboard/risk-score-badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus } from 'lucide-react';
import { formatDate } from '@/lib/helpers';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'analyst' | 'user';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  joinDate: Date;
  activityScore: number;
  lastLogin?: Date;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Mohammed Al-Mansoori',
    email: 'mohammed@example.com',
    role: 'user',
    status: 'active',
    joinDate: new Date('2023-01-15'),
    activityScore: 95,
    lastLogin: new Date(),
  },
  {
    id: '2',
    name: 'Layla Al-Kaabi',
    email: 'layla@example.com',
    role: 'user',
    status: 'active',
    joinDate: new Date('2023-03-20'),
    activityScore: 78,
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Fatima Al-Mazrouei',
    email: 'fatima@example.com',
    role: 'user',
    status: 'suspended',
    joinDate: new Date('2022-06-10'),
    activityScore: 45,
  },
  {
    id: '4',
    name: 'Ahmed Al-Mansouri',
    email: 'ahmed@example.com',
    role: 'user',
    status: 'active',
    joinDate: new Date('2023-09-05'),
    activityScore: 82,
    lastLogin: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: '5',
    name: 'Noor Al-Mazrouei',
    email: 'noor@example.com',
    role: 'user',
    status: 'banned',
    joinDate: new Date('2022-11-20'),
    activityScore: 12,
  },
  {
    id: '6',
    name: 'Hassan Al-Mansoori',
    email: 'hassan@example.com',
    role: 'user',
    status: 'active',
    joinDate: new Date('2024-01-10'),
    activityScore: 68,
    lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

export default function UsersPage() {
  const [sortKey, setSortKey] = useState<keyof User>('joinDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof User, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor all platform users</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <Button variant="outline" size="default">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold text-foreground">{mockUsers.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">{mockUsers.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Suspended</p>
          <p className="text-2xl font-bold text-yellow-600">{mockUsers.filter(u => u.status === 'suspended').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Banned</p>
          <p className="text-2xl font-bold text-red-600">{mockUsers.filter(u => u.status === 'banned').length}</p>
        </div>
      </div>

      {/* Table */}
      <DataTable<User>
        columns={[
          {
            key: 'name',
            label: 'Name',
            sortable: true,
          },
          {
            key: 'email',
            label: 'Email',
            sortable: true,
          },
          {
            key: 'role',
            label: 'Role',
            sortable: true,
            render: (value) => (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                {value}
              </span>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => <StatusBadge status={value} />,
          },
          {
            key: 'joinDate',
            label: 'Joined',
            sortable: true,
            render: (value) => formatDate(value),
          },
          {
            key: 'activityScore',
            label: 'Activity',
            sortable: true,
            render: (value) => (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2 w-12">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-sm text-foreground">{value}%</span>
              </div>
            ),
          },
        ]}
        data={sortedUsers}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />
    </div>
  );
}

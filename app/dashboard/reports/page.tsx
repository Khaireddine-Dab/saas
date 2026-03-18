'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { formatDate } from '@/lib/helpers';
import { mockReports } from '@/lib/mock-moderation-data';
import { Report } from '@/types/report';

export default function ReportsPage() {
  const [sortKey, setSortKey] = useState<keyof Report>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  let filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || report.status === statusFilter;
    const matchesPriority = !priorityFilter || report.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal === undefined || bVal === undefined) return 0;
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Report, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const statusOptions = ['pending', 'investigating', 'waiting_response', 'resolved', 'escalated'];
  const priorityOptions = ['low', 'medium', 'high', 'critical'];

  const statusCounts = {
    pending: mockReports.filter(r => r.status === 'pending').length,
    investigating: mockReports.filter(r => r.status === 'investigating').length,
    waiting_response: mockReports.filter(r => r.status === 'waiting_response').length,
    resolved: mockReports.filter(r => r.status === 'resolved').length,
    escalated: mockReports.filter(r => r.status === 'escalated').length,
  };

  const priorityCounts = {
    low: mockReports.filter(r => r.priority === 'low').length,
    medium: mockReports.filter(r => r.priority === 'medium').length,
    high: mockReports.filter(r => r.priority === 'high').length,
    critical: mockReports.filter(r => r.priority === 'critical').length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Disputes</h1>
        <p className="text-muted-foreground mt-2">Manage user reports and dispute resolution</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter ? 'outline' : 'default'}
            size="default"
            onClick={() => setStatusFilter(null)}
          >
            All ({mockReports.length})
          </Button>
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="default"
              onClick={() => setStatusFilter(status)}
            >
              {status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ({statusCounts[status as keyof typeof statusCounts]})
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground py-2">Priority:</span>
          {priorityOptions.map((priority) => (
            <Button
              key={priority}
              variant={priorityFilter === priority ? 'default' : 'outline'}
              size="default"
              onClick={() => setPriorityFilter(priority)}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)} ({priorityCounts[priority as keyof typeof priorityCounts]})
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Reports</p>
          <p className="text-2xl font-bold text-foreground">{mockReports.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{statusCounts.pending}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Critical</p>
          <p className="text-2xl font-bold text-destructive">{priorityCounts.critical}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold text-green-500">{statusCounts.resolved}</p>
        </div>
      </div>

      {/* Table */}
      <DataTable<Report>
        columns={[
          {
            key: 'id',
            label: 'Report ID',
            sortable: true,
            render: (value) => (
              <span className="font-mono text-sm font-medium text-foreground">{value}</span>
            ),
          },
          {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (value) => (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                {value}
              </span>
            ),
          },
          {
            key: 'targetName',
            label: 'Target',
            sortable: true,
            render: (value, row) => (
              <div>
                <p className="font-medium text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{row.reporterName}</p>
              </div>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => <StatusBadge status={value} />,
          },
          {
            key: 'priority',
            label: 'Priority',
            sortable: true,
            render: (value) => (
              <span className={`font-medium ${getPriorityColor(value)}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            ),
          },
          {
            key: 'assignedAdminName',
            label: 'Assigned To',
            sortable: false,
            render: (value) => (
              <span className="text-sm">{value || 'Unassigned'}</span>
            ),
          },
          {
            key: 'createdAt',
            label: 'Created',
            sortable: true,
            render: (value) => formatDate(value),
          },
        ]}
        data={sortedReports}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />
    </div>
  );
}

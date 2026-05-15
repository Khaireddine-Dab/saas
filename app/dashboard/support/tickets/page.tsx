'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supportApi } from '@/lib/api';
import Link from 'next/link';

const priorityColors = {
  low: 'bg-primary/20 text-primary border-primary/40',
  medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  high: 'bg-orange-500/20 text-orange-500 border-orange-500/40',
  urgent: 'bg-red-500/20 text-red-500 border-red-500/40',
};

const statusColors = {
  open: 'bg-green-500/20 text-green-500 border-green-500/40',
  in_progress: 'bg-primary/20 text-primary border-primary/40',
  waiting: 'bg-orange-500/20 text-orange-500 border-orange-500/40',
  resolved: 'bg-blue-500/20 text-blue-500 border-blue-500/40',
  closed: 'bg-muted text-muted-foreground border-border/50',
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  useEffect(() => {
    fetchTickets();
  }, [priorityFilter, statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (priorityFilter) filters.priority = priorityFilter;
      if (statusFilter) filters.status = statusFilter;
      
      const data = await supportApi.getTickets(filters);
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
        ticket.ticket_number?.toString().includes(searchQuery) || 
        ticket.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const openTickets = tickets.filter(t => t.status === 'open').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
          <p className="text-muted-foreground">Manage customer support requests</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Open Tickets</div>
          <div className="text-2xl font-bold text-destructive">{openTickets}</div>
          <div className="text-xs text-muted-foreground mt-1">Pending response</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Active</div>
          <div className="text-2xl font-bold text-primary">
            {tickets.filter(t => t.status !== 'closed').length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Being handled</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ticket #, customer or subject..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || undefined)}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={priorityFilter || ''}
            onChange={(e) => setPriorityFilter(e.target.value || undefined)}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Ticket #</th>
                <th className="px-6 py-3 text-left font-semibold">Store</th>
                <th className="px-6 py-3 text-left font-semibold">Customer</th>
                <th className="px-6 py-3 text-left font-semibold">Subject</th>
                <th className="px-6 py-3 text-left font-semibold">Channel</th>
                <th className="px-6 py-3 text-left font-semibold">Priority</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">Loading tickets...</td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">No tickets found.</td>
                </tr>
              ) : filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-medium">#{ticket.ticket_number}</td>
                  <td className="px-6 py-4">{ticket.store_details?.name || 'Unknown Store'}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-sm">{ticket.customer_name || ticket.customer_details?.full_name || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm truncate">{ticket.subject}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {ticket.channel === 'chat' ? <MessageSquare className="w-4 h-4 text-primary" /> : <Phone className="w-4 h-4 text-primary" />}
                      <span className="text-sm capitalize">{ticket.channel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {ticket.channel === 'chat' ? (
                        <Link href={`/dashboard/support/chat?ticket_id=${ticket.id}`}>
                            <Button size="sm" variant="default">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Open Chat
                            </Button>
                        </Link>
                    ) : (
                        <Button size="sm" variant="outline" disabled>
                            <Phone className="w-4 h-4 mr-2" />
                            Call Owner
                        </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

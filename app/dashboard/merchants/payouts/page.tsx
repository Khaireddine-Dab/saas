'use client';

import { useEffect, useState } from 'react';
import { Download, Send, Plus, Search, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { payoutsApi } from '@/lib/api';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  processing: 'bg-primary/20 text-primary border-primary/40',
  completed: 'bg-green-500/20 text-green-500 border-green-500/40',
  failed: 'bg-red-500/20 text-red-500 border-red-500/40',
};

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [payoutsData, statsData] = await Promise.all([
        payoutsApi.getPayouts({ status: statusFilter }),
        payoutsApi.getPayoutStats()
      ]);
      setPayouts(payoutsData.results || []);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.merchant_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPendingAmount = stats?.status?.pending_amount || 
    payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.net_amount || 0), 0);

  const handleBulkPayout = async () => {
    const confirmed = confirm(`Process ${selectedPayouts.length} payouts?`);
    if (!confirmed) return;

    try {
      await Promise.all(selectedPayouts.map(id => 
        payoutsApi.updatePayoutStatus(id, 'processing')
      ));
      setSelectedPayouts([]);
      loadData();
    } catch (error) {
      console.error('Failed to process payouts:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Merchant Payouts</h1>
          <p className="text-muted-foreground">Manage and process merchant settlements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {selectedPayouts.length > 0 && (
            <Button onClick={handleBulkPayout}>
              <Send className="w-4 h-4 mr-2" />
              Process ({selectedPayouts.length})
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pending Payouts</div>
          <div className="text-2xl font-bold text-yellow-500">
            {stats?.status?.pending || payouts.filter(p => p.status === 'pending').length}
          </div>
          <div className="text-xs text-yellow-500 mt-1">${totalPendingAmount.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Processing</div>
          <div className="text-2xl font-bold text-primary">
            {stats?.status?.processing || payouts.filter(p => p.status === 'processing').length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">In transit</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Completed</div>
          <div className="text-2xl font-bold text-green-500">
            {stats?.status?.completed || payouts.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">This month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Failed</div>
          <div className="text-2xl font-bold text-destructive">
            {stats?.status?.failed || payouts.filter(p => p.status === 'failed').length}
          </div>
          <div className="text-xs text-destructive mt-1">Needs action</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search merchant..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter || ''}
            onChange={e => setStatusFilter(e.target.value || undefined)}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          {loading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
        </div>
      </Card>

      {/* Payouts Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPayouts(filteredPayouts.map(p => p.id));
                      } else {
                        setSelectedPayouts([]);
                      }
                    }}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-6 py-3 text-left font-semibold">Merchant</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-right font-semibold">Amount</th>
                <th className="px-6 py-3 text-right font-semibold">Fee</th>
                <th className="px-6 py-3 text-right font-semibold">Net</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPayouts.includes(payout.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPayouts([...selectedPayouts, payout.id]);
                        } else {
                          setSelectedPayouts(selectedPayouts.filter(id => id !== payout.id));
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{payout.merchant_name || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">{payout.transaction_code}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{new Date(payout.time_created).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold">${Number(payout.amount).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold">${Number(payout.fee).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-foreground">${(payout.net_amount || (payout.amount - payout.fee)).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[payout.status as keyof typeof statusColors]}>
                      {payout.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {payout.status === 'failed' && (
                      <Button size="sm" variant="outline" onClick={() => payoutsApi.updatePayoutStatus(payout.id, 'pending').then(loadData)}>Retry</Button>
                    )}
                    {payout.status === 'pending' && (
                      <Button size="sm" onClick={() => payoutsApi.updatePayoutStatus(payout.id, 'processing').then(loadData)}>Send</Button>
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

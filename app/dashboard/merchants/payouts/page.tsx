'use client';

import { useState } from 'react';
import { Download, Send, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockPayouts = Array.from({ length: 25 }, (_, i) => ({
  id: `payout-${i + 1}`,
  merchantId: `merchant-${Math.floor(i / 3) + 1}`,
  merchantName: `Store ${Math.floor(i / 3) + 1}`,
  period: {
    from: new Date(Date.now() - (7 - (i % 7)) * 24 * 60 * 60 * 1000),
    to: new Date(Date.now() - (6 - (i % 7)) * 24 * 60 * 60 * 1000),
  },
  grossSales: Math.floor(Math.random() * 50000) + 5000,
  refunds: Math.floor(Math.random() * 5000),
  commissions: Math.floor(Math.random() * 10000),
  adjustments: Math.floor(Math.random() * 1000),
  netAmount: Math.floor(Math.random() * 30000) + 1000,
  status: ['pending', 'processing', 'completed', 'failed'][i % 4] as any,
  paymentMethod: 'bank_transfer',
  transactionId: i % 4 === 3 ? null : `TXN-${String(i + 1).padStart(8, '0')}`,
  processedAt: i % 4 === 3 ? null : new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
}));

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
  processing: 'bg-primary/20 text-primary border-primary/40',
  completed: 'bg-green-500/20 text-green-500 border-green-500/40',
  failed: 'bg-red-500/20 text-red-500 border-red-500/40',
};

export default function PayoutsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);

  const filteredPayouts = mockPayouts.filter(payout => {
    const matchesSearch = payout.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPending = filteredPayouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.netAmount, 0);

  const handleBulkPayout = () => {
    alert(`Processing ${selectedPayouts.length} payouts totaling $${mockPayouts
      .filter(p => selectedPayouts.includes(p.id))
      .reduce((sum, p) => sum + p.netAmount, 0)
      }`);
    setSelectedPayouts([]);
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
            {mockPayouts.filter(p => p.status === 'pending').length}
          </div>
          <div className="text-xs text-yellow-500 mt-1">${totalPending.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Processing</div>
          <div className="text-2xl font-bold text-primary">
            {mockPayouts.filter(p => p.status === 'processing').length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">In transit</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Completed</div>
          <div className="text-2xl font-bold text-green-500">
            {mockPayouts.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">This month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Failed</div>
          <div className="text-2xl font-bold text-destructive">
            {mockPayouts.filter(p => p.status === 'failed').length}
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
                <th className="px-6 py-3 text-left font-semibold">Period</th>
                <th className="px-6 py-3 text-right font-semibold">Gross Sales</th>
                <th className="px-6 py-3 text-right font-semibold">Commission</th>
                <th className="px-6 py-3 text-right font-semibold">Net Amount</th>
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
                    <p className="font-semibold">{payout.merchantName}</p>
                    <p className="text-xs text-muted-foreground">{payout.merchantId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{payout.period.from.toLocaleDateString()} - {payout.period.to.toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold">${payout.grossSales.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold">${payout.commissions.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-foreground">${payout.netAmount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[payout.status as keyof typeof statusColors]}>
                      {payout.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {payout.status === 'failed' && (
                      <Button size="sm" variant="outline">Retry</Button>
                    )}
                    {payout.status === 'pending' && (
                      <Button size="sm">Send</Button>
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

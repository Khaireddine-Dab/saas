'use client';

import { useEffect, useState } from 'react';
import { 
  Download, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  RefreshCcw, 
  AlertCircle,
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { transactionsApi } from '@/lib/api';

const statusColors = {
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  refunded: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const typeIcons = {
  payment: <ArrowDownLeft className="w-4 h-4 text-green-500" />,
  payout: <ArrowUpRight className="w-4 h-4 text-blue-500" />,
  refund: <RefreshCcw className="w-4 h-4 text-orange-500" />,
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [statusFilter, typeFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;

      const [txData, statsData] = await Promise.all([
        transactionsApi.getTransactions(params),
        transactionsApi.getTransactionStats()
      ]);
      
      setTransactions(txData.results || []);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.transaction_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.merchant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Transactions</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage all financial flows across the platform.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold">Total Volume</Badge>
          </div>
          <div className="text-2xl font-bold">${stats?.total_amount?.toLocaleString() || '0'}</div>
          <p className="text-xs text-muted-foreground mt-1">Across {stats?.total_transactions || 0} transactions</p>
        </Card>

        <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50 hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-green-500 border-green-500/20">Success Rate</Badge>
          </div>
          <div className="text-2xl font-bold text-green-500">{stats?.success_rate || 0}%</div>
          <p className="text-xs text-muted-foreground mt-1">{stats?.status?.completed || 0} completed</p>
        </Card>

        <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50 hover:border-yellow-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-yellow-500 border-yellow-500/20">Pending</Badge>
          </div>
          <div className="text-2xl font-bold text-yellow-500">{stats?.status?.pending || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
        </Card>

        <Card className="p-4 bg-background/50 backdrop-blur-sm border-border/50 hover:border-red-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-red-500 border-red-500/20">Failed</Badge>
          </div>
          <div className="text-2xl font-bold text-red-500">{stats?.status?.failed || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 border-border/50 bg-background/30 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, merchant or customer..." 
              className="pl-10 bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none min-w-[140px]"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="payment">Payments</option>
              <option value="payout">Payouts</option>
              <option value="refund">Refunds</option>
            </select>
            <select 
              className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none min-w-[140px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <Button variant="ghost" size="icon" onClick={loadData}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>

      {/* Table Card */}
      <Card className="border-border/50 overflow-hidden bg-background/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Transaction</th>
                <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Entity</th>
                <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Type</th>
                <th className="px-6 py-4 text-right font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Amount</th>
                <th className="px-6 py-4 text-right font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Fee</th>
                <th className="px-6 py-4 text-center font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Status</th>
                <th className="px-6 py-4 text-center font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="h-4 bg-muted/50 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
                        {tx.transaction_code}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        REF: {tx.order_number || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{tx.merchant_name || 'System'}</span>
                      <span className="text-[10px] text-muted-foreground">Customer: {tx.customer_name || 'Guest'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {typeIcons[tx.type as keyof typeof typeIcons]}
                      <span className="capitalize text-xs font-medium">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-foreground">
                      ${Number(tx.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-muted-foreground text-xs">
                      ${Number(tx.fee).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge className={`${statusColors[tx.status as keyof typeof statusColors]} border-none shadow-none text-[10px] font-bold uppercase`}>
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground">
                        {new Date(tx.time_created).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground opacity-50">
                        {new Date(tx.time_created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
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

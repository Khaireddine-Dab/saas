'use client';

import { useEffect, useState } from 'react';
import { Search, Users, ShoppingCart, Store, Package, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { SearchResult } from '@/types/search';

const MOCK_SEARCH_DATA = {
  users: [
    { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
  ],
  orders: [
    { id: 'order-1', orderId: 'ORD-000001', total: 250 },
    { id: 'order-2', orderId: 'ORD-000002', total: 350 },
  ],
  businesses: [
    { id: 'biz-1', name: 'TechHub Store' },
    { id: 'biz-2', name: 'Fashion Forward' },
  ],
  products: [
    { id: 'prod-1', name: 'Wireless Headphones' },
    { id: 'prod-2', name: 'USB-C Cable' },
  ],
};

interface AdminCommandSearchProps {
  onSelect?: (result: SearchResult) => void;
}

export function AdminCommandSearch({ onSelect }: AdminCommandSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search users
    MOCK_SEARCH_DATA.users.forEach(user => {
      if (user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)) {
        searchResults.push({
          id: user.id,
          type: 'user',
          title: user.name,
          subtitle: user.email,
          icon: 'Users',
          url: `/dashboard/users/${user.id}`,
          score: user.name.toLowerCase().startsWith(q) ? 1 : 0.8,
        });
      }
    });

    // Search orders
    MOCK_SEARCH_DATA.orders.forEach(order => {
      if (order.orderId.toLowerCase().includes(q)) {
        searchResults.push({
          id: order.id,
          type: 'order',
          title: order.orderId,
          subtitle: `Total: $${order.total}`,
          icon: 'ShoppingCart',
          url: `/dashboard/orders/${order.id}`,
          score: 1,
        });
      }
    });

    // Search businesses
    MOCK_SEARCH_DATA.businesses.forEach(biz => {
      if (biz.name.toLowerCase().includes(q)) {
        searchResults.push({
          id: biz.id,
          type: 'business',
          title: biz.name,
          icon: 'Store',
          url: `/dashboard/businesses/${biz.id}`,
          score: biz.name.toLowerCase().startsWith(q) ? 1 : 0.8,
        });
      }
    });

    // Search products
    MOCK_SEARCH_DATA.products.forEach(product => {
      if (product.name.toLowerCase().includes(q)) {
        searchResults.push({
          id: product.id,
          type: 'product',
          title: product.name,
          icon: 'Package',
          url: `/dashboard/products/${product.id}`,
          score: product.name.toLowerCase().startsWith(q) ? 1 : 0.8,
        });
      }
    });

    setResults(searchResults.sort((a, b) => b.score - a.score).slice(0, 8));
  }, [query]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="relative w-full max-w-sm px-4 py-2 text-sm text-muted-foreground border border-border rounded-lg bg-background hover:bg-muted flex items-center gap-2 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search... (Ctrl + K)</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-20 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-card rounded-lg shadow-xl border border-border overflow-hidden">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search users, orders, businesses, products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 ml-2 border-0 bg-transparent focus-visible:ring-0 text-foreground"
          />
        </div>

        {results.length > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            {results.map(result => {
              const icons: Record<string, any> = {
                Users,
                ShoppingCart,
                Store,
                Package,
                MessageSquare,
              };
              const Icon = icons[result.icon || 'Package'] || Package;

              return (
                <button
                  key={result.id}
                  onClick={() => {
                    onSelect?.(result);
                    setOpen(false);
                    setQuery('');
                  }}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted border-b border-border last:border-0 text-left transition"
                >
                  <Icon className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{result.title}</div>
                    {result.subtitle && <div className="text-sm text-muted-foreground truncate">{result.subtitle}</div>}
                  </div>
                </button>
              );
            })}
          </div>
        ) : query ? (
          <div className="px-4 py-8 text-center text-muted-foreground">No results found</div>
        ) : null}
      </div>
    </div>
  );
}

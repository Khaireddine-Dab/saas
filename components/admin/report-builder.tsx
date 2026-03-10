'use client';

import { useState } from 'react';
import { Plus, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string;
}

export function ReportBuilder() {
  const [reportName, setReportName] = useState('');
  const [metrics, setMetrics] = useState<string[]>(['revenue', 'orders']);
  const [dimensions, setDimensions] = useState<string[]>(['date']);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);

  const availableMetrics = [
    'Revenue',
    'Orders',
    'AOV',
    'Conversion Rate',
    'Refunds',
    'Commissions',
    'Customers',
  ];

  const availableDimensions = [
    'Date',
    'Category',
    'Merchant',
    'Payment Method',
    'Region',
    'Customer Segment',
    'Product',
  ];

  const handleAddFilter = () => {
    setFilters([...filters, { id: Date.now().toString(), field: '', operator: 'equals', value: '' }]);
  };

  const handleRemoveFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const handleToggleMetric = (metric: string) => {
    setMetrics(metrics.includes(metric) ? metrics.filter(m => m !== metric) : [...metrics, metric]);
  };

  const handleToggleDimension = (dimension: string) => {
    setDimensions(dimensions.includes(dimension) ? dimensions.filter(d => d !== dimension) : [...dimensions, dimension]);
  };

  if (!showBuilder) {
    return (
      <Button onClick={() => setShowBuilder(true)} variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Create Custom Report
      </Button>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Report Builder</h3>
        <button onClick={() => setShowBuilder(false)} className="p-1 hover:bg-neutral-100 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Report Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Report Name</label>
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="e.g., Weekly Sales by Category"
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>

        {/* Metrics */}
        <div>
          <label className="block text-sm font-semibold mb-3">Select Metrics</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableMetrics.map(metric => (
              <label key={metric} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={metrics.includes(metric.toLowerCase())}
                  onChange={() => handleToggleMetric(metric.toLowerCase())}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">{metric}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-semibold mb-3">Group By (Dimensions)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableDimensions.map(dimension => (
              <label key={dimension} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dimensions.includes(dimension.toLowerCase())}
                  onChange={() => handleToggleDimension(dimension.toLowerCase())}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">{dimension}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold">Filters</label>
            <Button size="sm" variant="outline" onClick={handleAddFilter}>
              <Plus className="w-3 h-3 mr-1" />
              Add Filter
            </Button>
          </div>
          <div className="space-y-2">
            {filters.map((filter) => (
              <div key={filter.id} className="flex gap-2 items-end">
                <select className="flex-1 px-3 py-2 border rounded text-sm">
                  <option>Select field</option>
                  <option>Status</option>
                  <option>Date Range</option>
                  <option>Merchant</option>
                </select>
                <select className="px-3 py-2 border rounded text-sm">
                  <option>Equals</option>
                  <option>Contains</option>
                  <option>Greater than</option>
                  <option>Less than</option>
                </select>
                <input type="text" placeholder="Value" className="flex-1 px-3 py-2 border rounded text-sm" />
                <button onClick={() => handleRemoveFilter(filter.id)} className="p-2 hover:bg-red-50 rounded">
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Play className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setShowBuilder(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
}

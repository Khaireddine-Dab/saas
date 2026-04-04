// Mock dashboard analytics and KPIs data
export const mockAnalyticsMetrics = [
  { date: 'Jan 1', value: 12000, label: 'Users' },
  { date: 'Jan 8', value: 14500, label: 'Users' },
  { date: 'Jan 15', value: 16200, label: 'Users' },
  { date: 'Jan 22', value: 18900, label: 'Users' },
  { date: 'Jan 29', value: 21200, label: 'Users' },
  { date: 'Feb 5', value: 23800, label: 'Users' },
  { date: 'Feb 12', value: 25600, label: 'Users' },
];

export const mockKPIs: { label: string; value: number; change: number; percentageChange: number; trend: 'up' | 'down' | 'stable'; icon: string }[] = [
  { label: 'Users', value: 25600, change: 120, percentageChange: 0.5, trend: 'up', icon: 'users' },
  { label: 'New Users Today', value: 42, change: 5, percentageChange: 13.5, trend: 'up', icon: 'user-plus' },
  { label: 'Total Orders', value: 12450, change: 450, percentageChange: 3.8, trend: 'up', icon: 'shopping-bag' },
  { label: 'Pending Orders', value: 125, change: -12, percentageChange: -8.7, trend: 'down', icon: 'clock' },
  { label: 'Ongoing Orders', value: 84, change: 8, percentageChange: 10.5, trend: 'up', icon: 'truck' },
  { label: 'Completed Orders', value: 11240, change: 380, percentageChange: 3.5, trend: 'up', icon: 'check-circle' },
  { label: 'Cancelled Orders', value: 101, change: 2, percentageChange: 2.0, trend: 'stable', icon: 'x-circle' },
  { label: 'Total Merchants', value: 5234, change: 32, percentageChange: 0.6, trend: 'up', icon: 'store' },
  { label: 'Pending Merchants', value: 45, change: -3, percentageChange: -6.2, trend: 'down', icon: 'user-check' },
  { label: 'Merchant Types', value: 12, change: 0, percentageChange: 0, trend: 'stable', icon: 'settings-2' },
  { label: 'Categories', value: 48, change: 2, percentageChange: 4.3, trend: 'up', icon: 'layers' },
  { label: 'Subcategories', value: 156, change: 5, percentageChange: 3.3, trend: 'up', icon: 'layout' },
  { label: 'Brands', value: 840, change: 12, percentageChange: 1.4, trend: 'up', icon: 'tag' },
  { label: 'Products', value: 145200, change: 1240, percentageChange: 0.9, trend: 'up', icon: 'box' },
  { label: 'Deals', value: 342, change: 15, percentageChange: 4.6, trend: 'up', icon: 'percent' },
  { label: 'Coupons', value: 124, change: -5, percentageChange: -3.8, trend: 'down', icon: 'ticket' },
  { label: 'New Reviews Today', value: 87, change: 12, percentageChange: 16.0, trend: 'up', icon: 'star' },
];

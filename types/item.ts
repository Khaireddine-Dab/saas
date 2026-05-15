export type ItemType = 'PRODUCT' | 'SERVICE';
export type ItemStatus = 'AVAILABLE' | 'HIDDEN' | 'FLAGGED' | 'BANNED';

export interface Item {
  id: string;
  itemType: ItemType;
  itemTypeDisplay: string;
  storeId: string;
  storeName: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  priceUnit: string;
  
  // Product-specific
  stockQuantity: number | null;
  orderCount: number;
  
  // Service-specific
  durationMinutes: number | null;
  isBookable: boolean;
  availableDays: Record<string, boolean> | null;
  bookingCount: number;
  
  // Common
  mainImage: string;
  image2: string | null;
  image3: string | null;
  status: ItemStatus;
  statusDisplay: string;
  
  // Analytics
  viewCount: number;
  ratingAverage: number;
  totalReviews: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemInput {
  itemType: ItemType;
  storeId: string;
  name: string;
  description?: string;
  price: number;
  priceUnit?: string;
  mainImage: string;
  image2?: string;
  image3?: string;
  stockQuantity?: number;
  durationMinutes?: number;
  isBookable?: boolean;
}

export interface UpdateItemInput {
  name?: string;
  description?: string;
  price?: number;
  priceUnit?: string;
  stockQuantity?: number;
  durationMinutes?: number;
  isBookable?: boolean;
  status?: ItemStatus;
}

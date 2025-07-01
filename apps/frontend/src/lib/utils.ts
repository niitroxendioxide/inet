import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum ProductType {
  FLIGHT = 'FLIGHT',
  HOTEL = 'HOTEL',
  TRANSPORT = 'TRANSPORT',
  EXPERIENCE = 'EXPERIENCE'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ProductType;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetches products filtered by type from the API
 * @param token - The authentication token
 * @param type - The product type to filter by
 * @returns Promise<Product[]>
 */
export const fetchProductsByType = async (token: string, type: ProductType): Promise<Product[]> => {
  console.log(`🔍 Fetching products of type: ${type}`);
  
  const response = await fetch(`/api/products?product_type=${type.toLowerCase()}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Failed to fetch products:', {
      status: response.status,
      statusText: response.statusText,
      error
    });
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  console.log(`📦 Products fetched: ${result.total}`);
  
  return result.data;
};

/**
 * Fetches admin dashboard statistics
 * @param token - The authentication token
 * @returns Promise<AdminStats>
 */
export interface AdminStats {
  products: {
    total: number;
    byType: {
      flight: number;
      hotel: number;
      transport: number;
      experience: number;
    };
  };
  packages: {
    total: number;
    activeCount: number;
  };
  orders: {
    total: number;
    lastMonth: number;
    totalRevenue: number;
    lastMonthRevenue: number;
  };
}

export const fetchAdminStats = async (token: string): Promise<AdminStats> => {
  console.log('📊 Fetching admin statistics');
  
  const response = await fetch('/api/dashboard/stats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Failed to fetch admin stats:', {
      status: response.status,
      statusText: response.statusText,
      error
    });
    throw new Error(`Failed to fetch admin stats: ${response.status} ${response.statusText}`);
  }

  const stats = await response.json();
  console.log('📊 Admin statistics received:', stats);
  
  return stats;
};

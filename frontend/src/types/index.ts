// Customer types
export interface Customer {
  customer_id: string;
  name: string;
  birthday: string | null;
  direct_subscription: boolean;
  membership_level: 'free' | 'pro' | 'elite';
  shipping_address: string | null;
  activation_date: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  customer_id: string;
  name: string;
  birthday?: string | null;
  direct_subscription?: boolean;
  membership_level?: 'free' | 'pro' | 'elite';
  shipping_address?: string | null;
}

export interface CustomerUpdate {
  name?: string;
  birthday?: string | null;
  direct_subscription?: boolean;
  membership_level?: 'free' | 'pro' | 'elite';
  shipping_address?: string | null;
}

// Order types
export interface Order {
  order_id: string;
  customer_id: string;
  product: string;
  backordered: boolean;
  cost: number;
  description: string | null;
  create_ts: string;
  credit_card_number: string | null;
  discount_percent: number;
  created_at: string;
  updated_at: string;
}

export interface OrderCreate {
  order_id: string;
  customer_id: string;
  product: string;
  backordered?: boolean;
  cost: number;
  description?: string | null;
  discount_percent?: number;
}

export interface OrderUpdate {
  product?: string;
  backordered?: boolean;
  cost?: number;
  description?: string | null;
  discount_percent?: number;
}

// Analytics types
export interface Summary {
  total_customers: number;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  backorder_rate: number;
}

export interface MembershipData {
  membership_level: string;
  order_count: number;
  total_revenue: number;
  avg_order_value: number;
}

export interface OrdersByMembership {
  data: MembershipData[];
}

export interface TimeSeriesDataPoint {
  date: string;
  order_count: number;
  total_revenue: number;
}

export interface OrdersOverTime {
  data: TimeSeriesDataPoint[];
}

export interface ProductData {
  product: string;
  order_count: number;
  total_revenue: number;
  avg_price: number;
}

export interface TopProducts {
  data: ProductData[];
}

export interface BackorderData {
  product: string;
  total_orders: number;
  backorder_count: number;
  backorder_rate: number;
}

export interface BackorderRates {
  overall_rate: number;
  by_product: BackorderData[];
}

// Health check
export interface HealthStatus {
  status: string;
  postgres: string;
  clickhouse: string;
}

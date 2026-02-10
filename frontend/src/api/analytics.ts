import { apiClient } from './client';
import type {
  Summary,
  OrdersByMembership,
  OrdersOverTime,
  TopProducts,
  BackorderRates,
} from '../types';

export const analyticsApi = {
  getSummary: async () => {
    const { data } = await apiClient.get<Summary>('/analytics/summary');
    return data;
  },

  getOrdersByMembership: async () => {
    const { data } = await apiClient.get<OrdersByMembership>('/analytics/orders-by-membership');
    return data;
  },

  getOrdersOverTime: async (days: number = 30) => {
    const { data } = await apiClient.get<OrdersOverTime>('/analytics/orders-over-time', {
      params: { days },
    });
    return data;
  },

  getTopProducts: async (limit: number = 10) => {
    const { data } = await apiClient.get<TopProducts>('/analytics/top-products', {
      params: { limit },
    });
    return data;
  },

  getBackorderRates: async (limit: number = 10) => {
    const { data } = await apiClient.get<BackorderRates>('/analytics/backorder-rates', {
      params: { limit },
    });
    return data;
  },
};

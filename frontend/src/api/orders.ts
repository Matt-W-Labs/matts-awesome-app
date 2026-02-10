import { apiClient } from './client';
import type { Order, OrderCreate, OrderUpdate } from '../types';

export const ordersApi = {
  list: async (params?: { skip?: number; limit?: number; customer_id?: string; backordered?: boolean }) => {
    const { data } = await apiClient.get<Order[]>('/orders', { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<Order>(`/orders/${id}`);
    return data;
  },

  create: async (order: OrderCreate) => {
    const { data } = await apiClient.post<Order>('/orders', order);
    return data;
  },

  update: async (id: string, order: OrderUpdate) => {
    const { data } = await apiClient.put<Order>(`/orders/${id}`, order);
    return data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/orders/${id}`);
  },
};

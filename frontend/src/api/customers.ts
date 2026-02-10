import { apiClient } from './client';
import type { Customer, CustomerCreate, CustomerUpdate, CustomerWithOrders } from '../types';

export const customersApi = {
  list: async (params?: { skip?: number; limit?: number; membership_level?: string }) => {
    const { data } = await apiClient.get<Customer[]>('/customers', { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<CustomerWithOrders>(`/customers/${id}`);
    return data;
  },

  create: async (customer: CustomerCreate) => {
    const { data } = await apiClient.post<Customer>('/customers', customer);
    return data;
  },

  update: async (id: string, customer: CustomerUpdate) => {
    const { data } = await apiClient.put<Customer>(`/customers/${id}`, customer);
    return data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/customers/${id}`);
  },
};

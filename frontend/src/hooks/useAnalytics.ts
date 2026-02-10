import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api';

export const useSummary = () => {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: () => analyticsApi.getSummary(),
  });
};

export const useOrdersByMembership = () => {
  return useQuery({
    queryKey: ['analytics', 'orders-by-membership'],
    queryFn: () => analyticsApi.getOrdersByMembership(),
  });
};

export const useOrdersOverTime = (days: number = 30) => {
  return useQuery({
    queryKey: ['analytics', 'orders-over-time', days],
    queryFn: () => analyticsApi.getOrdersOverTime(days),
  });
};

export const useTopProducts = (limit: number = 10) => {
  return useQuery({
    queryKey: ['analytics', 'top-products', limit],
    queryFn: () => analyticsApi.getTopProducts(limit),
  });
};

export const useBackorderRates = (limit: number = 10) => {
  return useQuery({
    queryKey: ['analytics', 'backorder-rates', limit],
    queryFn: () => analyticsApi.getBackorderRates(limit),
  });
};

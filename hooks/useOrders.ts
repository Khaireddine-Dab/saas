'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ordersApi } from '@/lib/api';
import { mapBackendOrderToFrontend, mapBackendOrdersToFrontend } from '@/lib/order-mapper';
import type { Order, OrderFilter, OrderMetrics } from '@/types/order';

interface UseOrdersReturn {
  orders: Order[];
  allOrders: Order[];
  isLoading: boolean;
  error: string | null;
  metrics: OrderMetrics;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: number | string) => Promise<Order>;
  updateOrderStatus: (orderId: number | string, status: string) => Promise<Order>;
  updateOrder: (orderId: number | string, data: any) => Promise<Order>;
  deleteOrder: (orderId: number | string) => Promise<void>;
  createOrder: (data: any) => Promise<Order>;
  getOrdersByStore: (storeId: number | string) => Promise<Order[]>;
}

export function useOrders(filters?: OrderFilter): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getAll();
      const mappedOrders = mapBackendOrdersToFrontend(Array.isArray(data) ? data : []);
      setOrders(mappedOrders);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des commandes';
      setError(message);
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch order by ID
  const fetchOrderById = useCallback(async (id: number | string): Promise<Order> => {
    setError(null);
    try {
      const data = await ordersApi.getById(id);
      return mapBackendOrderToFrontend(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement de la commande';
      setError(message);
      throw err;
    }
  }, []);

  // Get orders by store
  const getOrdersByStore = useCallback(async (storeId: number | string): Promise<Order[]> => {
    setError(null);
    try {
      const data = await ordersApi.getByStore(storeId);
      return mapBackendOrdersToFrontend(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des commandes du magasin';
      setError(message);
      throw err;
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: number | string, status: string): Promise<Order> => {
    setError(null);
    try {
      const response = await ordersApi.updateStatus(orderId, status);
      const updatedOrder = mapBackendOrderToFrontend(response);
      setOrders(prev => prev.map(o => o.id === String(orderId) ? updatedOrder : o));
      return updatedOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut';
      setError(message);
      throw err;
    }
  }, []);

  // Update full order
  const updateOrder = useCallback(async (orderId: number | string, data: any): Promise<Order> => {
    setError(null);
    try {
      const response = await ordersApi.update(orderId, data);
      const updatedOrder = mapBackendOrderToFrontend(response);
      setOrders(prev => prev.map(o => o.id === String(orderId) ? updatedOrder : o));
      return updatedOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la commande';
      setError(message);
      throw err;
    }
  }, []);

  // Delete order
  const deleteOrder = useCallback(async (orderId: number | string) => {
    setError(null);
    try {
      await ordersApi.delete(orderId);
      setOrders(prev => prev.filter(o => o.id !== String(orderId)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression de la commande';
      setError(message);
      throw err;
    }
  }, []);

  // Create order
  const createOrder = useCallback(async (data: any): Promise<Order> => {
    setError(null);
    try {
      const response = await ordersApi.create(data);
      const newOrder = mapBackendOrderToFrontend(response);
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de la commande';
      setError(message);
      throw err;
    }
  }, []);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let result = orders;

    if (filters?.status) {
      result = result.filter(o => o.status === filters.status);
    }
    if (filters?.paymentStatus) {
      result = result.filter(o => o.paymentStatus === filters.paymentStatus);
    }
    if (filters?.businessId) {
      result = result.filter(o => o.businessId === filters.businessId);
    }
    if (filters?.userId) {
      result = result.filter(o => o.userId === filters.userId);
    }

    return result;
  }, [orders, filters]);

  // Calculate metrics
  const metrics: OrderMetrics = useMemo(() => ({
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length : 0,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    conversionRate: 3.2,
  }), [orders]);

  return {
    orders: filteredOrders,
    allOrders: orders,
    isLoading,
    error,
    metrics,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    createOrder,
    getOrdersByStore,
  };
}

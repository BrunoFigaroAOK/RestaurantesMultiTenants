import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Order, OrderStatus, OrdersContextType } from '../types';
import { initialOrders } from '../data/mockData';

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Generador simple de IDs únicos
const generateId = () => `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const now = new Date();
    const newOrder: Order = {
      ...orderData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;

        const now = new Date();
        const updates: Partial<Order> = {
          status,
          updatedAt: now,
        };

        // Registrar timestamps según el estado
        switch (status) {
          case 'APROBADO':
            updates.approvedAt = now;
            break;
          case 'PREPARANDO':
            updates.preparingAt = now;
            break;
          case 'LISTO':
            updates.readyAt = now;
            break;
          case 'ENTREGADO':
            updates.deliveredAt = now;
            break;
        }

        return { ...order, ...updates };
      })
    );
  }, []);

  const approveOrder = useCallback((orderId: string) => {
    updateOrderStatus(orderId, 'APROBADO');
  }, [updateOrderStatus]);

  const rejectOrder = useCallback((orderId: string) => {
    // En lugar de eliminar, podríamos tener un estado RECHAZADO
    // Por ahora simplemente lo eliminamos
    setOrders(prev => prev.filter(order => order.id !== orderId));
  }, []);

  const getOrdersByRestaurant = useCallback((restaurantId: string): Order[] => {
    return orders.filter(order => order.restaurantId === restaurantId);
  }, [orders]);

  const getOrdersByStatus = useCallback((restaurantId: string, statuses: OrderStatus[]): Order[] => {
    return orders.filter(
      order => order.restaurantId === restaurantId && statuses.includes(order.status)
    );
  }, [orders]);

  // Pedidos de mesa pendientes de aprobación (para Caja)
  const getPendingTableOrders = useCallback((restaurantId: string): Order[] => {
    return orders.filter(
      order =>
        order.restaurantId === restaurantId &&
        order.type === 'MESA' &&
        order.status === 'CREADO'
    );
  }, [orders]);

  // Pedidos para cocina (APROBADO, PREPARANDO, LISTO)
  const getKitchenOrders = useCallback((restaurantId: string): Order[] => {
    return orders
      .filter(
        order =>
          order.restaurantId === restaurantId &&
          ['APROBADO', 'PREPARANDO', 'LISTO'].includes(order.status)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }, [orders]);

  const value: OrdersContextType = {
    orders,
    addOrder,
    updateOrderStatus,
    approveOrder,
    rejectOrder,
    getOrdersByRestaurant,
    getOrdersByStatus,
    getPendingTableOrders,
    getKitchenOrders,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders debe usarse dentro de un OrdersProvider');
  }
  return context;
};

export default OrdersContext;

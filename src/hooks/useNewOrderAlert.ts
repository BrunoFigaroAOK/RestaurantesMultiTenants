import { useEffect, useRef, useCallback } from 'react';
import type { Order } from '../types';
import { playNewOrderSound } from '../utils/sounds';

interface UseNewOrderAlertOptions {
  enabled?: boolean;
  onNewOrder?: (order: Order) => void;
}

interface UseNewOrderAlertResult {
  newOrderIds: Set<string>;
  isNewOrder: (orderId: string) => boolean;
  markAsSeen: (orderId: string) => void;
  clearNewOrders: () => void;
}

/**
 * Hook para detectar pedidos nuevos y reproducir alerta sonora.
 * Mantiene un registro de los pedidos "vistos" para evitar alertas duplicadas.
 */
export const useNewOrderAlert = (
  orders: Order[],
  options: UseNewOrderAlertOptions = {}
): UseNewOrderAlertResult => {
  const { enabled = true, onNewOrder } = options;

  // Set de IDs de pedidos que ya hemos visto
  const seenOrderIds = useRef<Set<string>>(new Set());

  // Set de IDs de pedidos que son "nuevos" (para animación)
  const newOrderIds = useRef<Set<string>>(new Set());

  // Flag para saber si es la primera carga (no alertar en carga inicial)
  const isInitialLoad = useRef(true);

  // Timeout refs para limpiar animaciones
  const animationTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Detectar nuevos pedidos
  useEffect(() => {
    if (!enabled) return;

    const currentIds = new Set(orders.map(o => o.id));
    let hasNewOrder = false;

    orders.forEach(order => {
      // Si no lo hemos visto antes, es nuevo
      if (!seenOrderIds.current.has(order.id)) {
        seenOrderIds.current.add(order.id);

        // Solo alertar si no es la carga inicial
        if (!isInitialLoad.current) {
          hasNewOrder = true;
          newOrderIds.current.add(order.id);

          // Callback opcional
          if (onNewOrder) {
            onNewOrder(order);
          }

          // Limpiar la marca de "nuevo" después de 5 segundos
          const timeoutId = setTimeout(() => {
            newOrderIds.current.delete(order.id);
            animationTimeouts.current.delete(order.id);
          }, 5000);

          animationTimeouts.current.set(order.id, timeoutId);
        }
      }
    });

    // Limpiar IDs de pedidos que ya no existen
    seenOrderIds.current.forEach(id => {
      if (!currentIds.has(id)) {
        seenOrderIds.current.delete(id);
        newOrderIds.current.delete(id);
        const timeout = animationTimeouts.current.get(id);
        if (timeout) {
          clearTimeout(timeout);
          animationTimeouts.current.delete(id);
        }
      }
    });

    // Marcar que ya pasó la carga inicial
    if (isInitialLoad.current && orders.length > 0) {
      isInitialLoad.current = false;
    } else if (isInitialLoad.current && orders.length === 0) {
      // Si no hay pedidos en la carga inicial, igual marcar como cargado
      setTimeout(() => {
        isInitialLoad.current = false;
      }, 1000);
    }

    // Reproducir sonido si hay pedidos nuevos
    if (hasNewOrder) {
      playNewOrderSound();
    }
  }, [orders, enabled, onNewOrder]);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const isNewOrder = useCallback((orderId: string): boolean => {
    return newOrderIds.current.has(orderId);
  }, []);

  const markAsSeen = useCallback((orderId: string): void => {
    newOrderIds.current.delete(orderId);
    const timeout = animationTimeouts.current.get(orderId);
    if (timeout) {
      clearTimeout(timeout);
      animationTimeouts.current.delete(orderId);
    }
  }, []);

  const clearNewOrders = useCallback((): void => {
    newOrderIds.current.clear();
    animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
    animationTimeouts.current.clear();
  }, []);

  return {
    newOrderIds: newOrderIds.current,
    isNewOrder,
    markAsSeen,
    clearNewOrders,
  };
};

export default useNewOrderAlert;

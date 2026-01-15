import type { OrderStatus, OrderType } from '../types';

/**
 * Define las transiciones válidas de estado para pedidos
 */
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  CREADO: ['APROBADO'],           // Solo puede pasar a aprobado (o rechazado/eliminado)
  APROBADO: ['PREPARANDO'],       // Cocina inicia preparación
  PREPARANDO: ['LISTO'],          // Preparación completada
  LISTO: ['ENTREGADO'],           // Pedido entregado
  ENTREGADO: [],                  // Estado final
};

/**
 * Verifica si una transición de estado es válida
 */
export const isValidTransition = (
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean => {
  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
};

/**
 * Obtiene el siguiente estado válido para un pedido
 */
export const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
  const nextStatuses = validTransitions[currentStatus];
  return nextStatuses.length > 0 ? nextStatuses[0] : null;
};

/**
 * Determina el estado inicial según el tipo de pedido
 */
export const getInitialStatus = (
  orderType: OrderType,
  isManual: boolean = false
): OrderStatus => {
  // Pedidos de mesa (QR) entran como CREADO (requieren aprobación)
  // Pedidos delivery y manuales entran como APROBADO
  if (orderType === 'MESA' && !isManual) {
    return 'CREADO';
  }
  return 'APROBADO';
};

/**
 * Labels para mostrar en UI según el estado
 */
export const statusLabels: Record<OrderStatus, string> = {
  CREADO: 'Pendiente',
  APROBADO: 'Aprobado',
  PREPARANDO: 'Preparando',
  LISTO: 'Listo',
  ENTREGADO: 'Entregado',
};

/**
 * Colores/variantes para badges según estado
 */
export const statusVariants: Record<OrderStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  CREADO: 'warning',
  APROBADO: 'info',
  PREPARANDO: 'primary',
  LISTO: 'success',
  ENTREGADO: 'default',
};

/**
 * Labels para botones de acción según el siguiente estado
 */
export const nextStatusActionLabels: Record<OrderStatus, string> = {
  CREADO: 'Aprobar',
  APROBADO: 'Iniciar Preparación',
  PREPARANDO: 'Marcar Listo',
  LISTO: 'Entregar',
  ENTREGADO: '',
};

/**
 * Verifica si un pedido puede ser aprobado
 */
export const canApprove = (status: OrderStatus): boolean => {
  return status === 'CREADO';
};

/**
 * Verifica si un pedido puede ser rechazado
 */
export const canReject = (status: OrderStatus): boolean => {
  return status === 'CREADO';
};

/**
 * Verifica si un pedido está en un estado editable por cocina
 */
export const isKitchenEditable = (status: OrderStatus): boolean => {
  return ['APROBADO', 'PREPARANDO', 'LISTO'].includes(status);
};

/**
 * Tiempo en minutos para considerar un pedido como demorado
 */
const DELAY_THRESHOLD_MINUTES = 30;

/**
 * Calcula si un pedido está demorado basado en tiempo de creación y estimado
 */
export const calculateDelayStatus = (
  createdAt: Date,
  estimatedTime?: number
): { isDelayed: boolean; minutesElapsed: number; minutesOverdue: number } => {
  const now = new Date();
  const minutesElapsed = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
  const threshold = estimatedTime || DELAY_THRESHOLD_MINUTES;
  const minutesOverdue = Math.max(0, minutesElapsed - threshold);

  return {
    isDelayed: minutesElapsed > threshold,
    minutesElapsed,
    minutesOverdue,
  };
};

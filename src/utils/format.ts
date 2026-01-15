/**
 * Formatea un precio en pesos argentinos
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Formatea una fecha para mostrar hora
 */
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Formatea una fecha completa
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Calcula minutos transcurridos desde una fecha
 */
export const getMinutesAgo = (date: Date): number => {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60));
};

/**
 * Formatea tiempo transcurrido de forma legible
 */
export const formatTimeAgo = (date: Date): string => {
  const minutes = getMinutesAgo(date);
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}min`;
  return `${Math.floor(hours / 24)}d`;
};

/**
 * Verifica si un pedido está demorado
 */
export const isOrderDelayed = (createdAt: Date, estimatedTime?: number): boolean => {
  if (!estimatedTime) return false;
  const minutesElapsed = getMinutesAgo(createdAt);
  return minutesElapsed > estimatedTime;
};

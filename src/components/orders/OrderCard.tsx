import React from 'react';
import type { Order, OrderStatus } from '../../types';
import { Card, Badge, Button } from '../ui';
import { formatPrice, formatTimeAgo, isOrderDelayed } from '../../utils/format';
import './OrderCard.css';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
  isNew?: boolean;
  onApprove?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
}

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' }> = {
  CREADO: { label: 'Pendiente', variant: 'warning' },
  APROBADO: { label: 'Aprobado', variant: 'info' },
  PREPARANDO: { label: 'Preparando', variant: 'primary' },
  LISTO: { label: 'Listo', variant: 'success' },
  ENTREGADO: { label: 'Entregado', variant: 'default' },
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  showActions = true,
  isNew = false,
  onApprove,
  onReject,
  onStatusChange,
}) => {
  const isDelayed = isOrderDelayed(order.createdAt, order.estimatedTime);
  const config = statusConfig[order.status];

  const nextStatus: Record<OrderStatus, OrderStatus | null> = {
    CREADO: null,
    APROBADO: 'PREPARANDO',
    PREPARANDO: 'LISTO',
    LISTO: 'ENTREGADO',
    ENTREGADO: null,
  };

  const nextStatusLabel: Record<string, string> = {
    PREPARANDO: 'Iniciar Preparación',
    LISTO: 'Marcar Listo',
    ENTREGADO: 'Entregar',
  };

  const cardClasses = [
    'order-card',
    isNew && 'order-card-new',
    isDelayed && 'order-card-delayed',
  ].filter(Boolean).join(' ');

  return (
    <Card
      className={cardClasses}
      variant="elevated"
    >
      <div className="order-header">
        <div className="order-type">
          {order.type === 'MESA' ? (
            <span className="order-table">Mesa {order.tableNumber}</span>
          ) : (
            <span className="order-delivery">Delivery</span>
          )}
        </div>
        <div className="order-badges">
          {isDelayed && (
            <Badge variant="danger" pulse>Demorado</Badge>
          )}
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
      </div>

      <div className="order-customer">
        <strong>{order.customerName}</strong>
        {order.type === 'DELIVERY' && (
          <>
            {order.customerPhone && <span>{order.customerPhone}</span>}
            {order.customerAddress && (
              <span className="order-address">{order.customerAddress}</span>
            )}
          </>
        )}
      </div>

      <div className="order-items">
        {order.items.map(item => {
          const hasModifications =
            (item.removedIngredients && item.removedIngredients.length > 0) ||
            (item.extraIngredients && item.extraIngredients.length > 0) ||
            (item.notes && item.notes.trim().length > 0);

          return (
            <div key={item.id} className="order-item">
              <div className="order-item-main">
                <span className="order-item-qty">{item.quantity}x</span>
                <span className="order-item-name">{item.menuItem.name}</span>
              </div>
              {hasModifications && (
                <div className="order-item-mods">
                  {item.removedIngredients?.map(ing => (
                    <span key={ing.id} className="order-mod removed">
                      – sin {ing.name}
                    </span>
                  ))}
                  {item.extraIngredients?.map(ing => (
                    <span key={ing.id} className="order-mod extra">
                      + extra {ing.name}
                    </span>
                  ))}
                  {item.notes && (
                    <span className="order-mod note">📝 {item.notes}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="order-footer">
        <div className="order-meta">
          <span className="order-time">{formatTimeAgo(order.createdAt)}</span>
          <span className="order-total">{formatPrice(order.total)}</span>
        </div>

        {showActions && (
          <div className="order-actions">
            {order.status === 'CREADO' && onApprove && onReject && (
              <>
                <Button variant="danger" size="sm" onClick={() => onReject(order.id)}>
                  Rechazar
                </Button>
                <Button variant="success" size="sm" onClick={() => onApprove(order.id)}>
                  Aprobar
                </Button>
              </>
            )}

            {nextStatus[order.status] && onStatusChange && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStatusChange(order.id, nextStatus[order.status]!)}
              >
                {nextStatusLabel[nextStatus[order.status]!]}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrderCard;

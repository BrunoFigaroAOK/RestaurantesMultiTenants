import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders, useRestaurant } from '../../contexts';
import { useNewOrderAlert } from '../../hooks';
import { OrderCard } from '../../components/orders';
import { Card, Button, Badge } from '../../components/ui';
import type { OrderStatus, Order } from '../../types';
import { isValidTransition, calculateDelayStatus } from '../../utils/orderHelpers';
import './KitchenPage.css';

type FilterType = 'ALL' | 'MESA' | 'DELIVERY';

export const KitchenPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { restaurant, setActiveRestaurant, error: restaurantError } = useRestaurant();
  const { getKitchenOrders, updateOrderStatus } = useOrders();

  const [typeFilter, setTypeFilter] = useState<FilterType>('ALL');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sincronizar restaurante activo con la ruta
  useEffect(() => {
    if (restaurantId) {
      setActiveRestaurant(restaurantId);
    }
  }, [restaurantId, setActiveRestaurant]);

  // Limpiar feedback después de 2 segundos
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const allOrders = restaurantId ? getKitchenOrders(restaurantId) : [];

  // Hook para alertas de nuevos pedidos (sonido + animación)
  const { isNewOrder } = useNewOrderAlert(allOrders);

  // Calcular estadísticas con memoización
  const stats = useMemo(() => {
    const byStatus = {
      APROBADO: allOrders.filter(o => o.status === 'APROBADO'),
      PREPARANDO: allOrders.filter(o => o.status === 'PREPARANDO'),
      LISTO: allOrders.filter(o => o.status === 'LISTO'),
    };

    const delayed = allOrders.filter(o => {
      const { isDelayed } = calculateDelayStatus(o.createdAt, o.estimatedTime);
      return isDelayed && o.status !== 'LISTO';
    });

    return { byStatus, delayed };
  }, [allOrders]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    // Validar transición antes de ejecutar
    if (!isValidTransition(order.status, newStatus)) {
      setFeedback({
        message: `No se puede cambiar de ${order.status} a ${newStatus}`,
        type: 'error',
      });
      return;
    }

    const success = updateOrderStatus(orderId, newStatus);
    if (success) {
      const messages: Record<OrderStatus, string> = {
        CREADO: '',
        APROBADO: 'Pedido aprobado',
        PREPARANDO: 'Preparación iniciada',
        LISTO: 'Pedido listo para entregar',
        ENTREGADO: 'Pedido entregado',
      };
      setFeedback({ message: messages[newStatus], type: 'success' });
    }
  };

  if (!restaurant || restaurantError) {
    return (
      <div className="kitchen-page">
        <Card className="error-card">
          <h2>Restaurante no encontrado</h2>
          <p>{restaurantError || 'El restaurante solicitado no existe.'}</p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </Card>
      </div>
    );
  }

  const countByType = (orders: Order[], type: string) =>
    orders.filter(o => o.type === type).length;

  const filterOrders = (orders: Order[]) =>
    typeFilter === 'ALL' ? orders : orders.filter(o => o.type === typeFilter);

  return (
    <div className="kitchen-page">
      {/* Feedback Toast */}
      {feedback && (
        <div className={`kitchen-toast toast-${feedback.type}`}>
          <span>{feedback.type === 'success' ? '✓' : '✕'}</span>
          {feedback.message}
        </div>
      )}

      <header className="kitchen-header">
        <div className="kitchen-header-content">
          <Link to="/" className="back-link">← Inicio</Link>
          <h1>{restaurant.name}</h1>
          <Badge variant="success">Cocina</Badge>
        </div>
        <div className="kitchen-actions">
          <Link to={`/${restaurantId}/caja`}>
            <Button variant="secondary">Ir a Caja</Button>
          </Link>
        </div>
      </header>

      <div className="kitchen-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.byStatus.APROBADO.length}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-card stat-preparing">
          <span className="stat-value">{stats.byStatus.PREPARANDO.length}</span>
          <span className="stat-label">Preparando</span>
        </div>
        <div className="stat-card stat-ready">
          <span className="stat-value">{stats.byStatus.LISTO.length}</span>
          <span className="stat-label">Listos</span>
        </div>
        {stats.delayed.length > 0 && (
          <div className="stat-card stat-delayed">
            <span className="stat-value">{stats.delayed.length}</span>
            <span className="stat-label">Demorados</span>
          </div>
        )}
      </div>

      <div className="kitchen-filters">
        <div className="filter-group">
          <span className="filter-label">Filtrar por tipo:</span>
          <button
            className={`filter-btn ${typeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setTypeFilter('ALL')}
          >
            Todos ({allOrders.length})
          </button>
          <button
            className={`filter-btn filter-mesa ${typeFilter === 'MESA' ? 'active' : ''}`}
            onClick={() => setTypeFilter('MESA')}
          >
            Mesa ({countByType(allOrders, 'MESA')})
          </button>
          <button
            className={`filter-btn filter-delivery ${typeFilter === 'DELIVERY' ? 'active' : ''}`}
            onClick={() => setTypeFilter('DELIVERY')}
          >
            Delivery ({countByType(allOrders, 'DELIVERY')})
          </button>
        </div>
      </div>

      <div className="kitchen-kanban">
        {/* Columna APROBADO / Pendientes */}
        <div className="kanban-column">
          <div className="kanban-header kanban-pending">
            <h2>Por Preparar</h2>
            <Badge variant="info">{filterOrders(stats.byStatus.APROBADO).length}</Badge>
          </div>
          <div className="kanban-content">
            {filterOrders(stats.byStatus.APROBADO).map(order => (
              <OrderCard
                key={order.id}
                order={order}
                isNew={isNewOrder(order.id)}
                onStatusChange={handleStatusChange}
              />
            ))}
            {filterOrders(stats.byStatus.APROBADO).length === 0 && (
              <div className="kanban-empty">
                <span className="empty-icon">📋</span>
                <span>Sin pedidos pendientes</span>
              </div>
            )}
          </div>
        </div>

        {/* Columna PREPARANDO */}
        <div className="kanban-column">
          <div className="kanban-header kanban-preparing">
            <h2>En Preparación</h2>
            <Badge variant="primary" pulse={stats.byStatus.PREPARANDO.length > 0}>
              {filterOrders(stats.byStatus.PREPARANDO).length}
            </Badge>
          </div>
          <div className="kanban-content">
            {filterOrders(stats.byStatus.PREPARANDO).map(order => (
              <OrderCard
                key={order.id}
                order={order}
                isNew={isNewOrder(order.id)}
                onStatusChange={handleStatusChange}
              />
            ))}
            {filterOrders(stats.byStatus.PREPARANDO).length === 0 && (
              <div className="kanban-empty">
                <span className="empty-icon">👨‍🍳</span>
                <span>Sin pedidos en preparación</span>
              </div>
            )}
          </div>
        </div>

        {/* Columna LISTO */}
        <div className="kanban-column">
          <div className="kanban-header kanban-ready">
            <h2>Listos para Entregar</h2>
            <Badge variant="success" pulse={stats.byStatus.LISTO.length > 0}>
              {filterOrders(stats.byStatus.LISTO).length}
            </Badge>
          </div>
          <div className="kanban-content">
            {filterOrders(stats.byStatus.LISTO).map(order => (
              <OrderCard
                key={order.id}
                order={order}
                isNew={isNewOrder(order.id)}
                onStatusChange={handleStatusChange}
              />
            ))}
            {filterOrders(stats.byStatus.LISTO).length === 0 && (
              <div className="kanban-empty">
                <span className="empty-icon">✅</span>
                <span>Sin pedidos listos</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;

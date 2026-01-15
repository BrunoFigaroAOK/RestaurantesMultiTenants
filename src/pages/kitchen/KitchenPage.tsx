import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '../../contexts';
import { getRestaurantById } from '../../data/mockData';
import { OrderCard } from '../../components/orders';
import { Card, Button, Badge } from '../../components/ui';
import type { OrderStatus, Order } from '../../types';
import './KitchenPage.css';

type FilterType = 'ALL' | 'MESA' | 'DELIVERY';

export const KitchenPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { getKitchenOrders, updateOrderStatus } = useOrders();

  const [typeFilter, setTypeFilter] = useState<FilterType>('ALL');

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : null;
  const allOrders = restaurantId ? getKitchenOrders(restaurantId) : [];

  // Group by status for kanban view
  const ordersByStatus = {
    APROBADO: allOrders.filter(o => o.status === 'APROBADO'),
    PREPARANDO: allOrders.filter(o => o.status === 'PREPARANDO'),
    LISTO: allOrders.filter(o => o.status === 'LISTO'),
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  if (!restaurant) {
    return (
      <div className="kitchen-page">
        <Card className="error-card">
          <h2>Restaurante no encontrado</h2>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </Card>
      </div>
    );
  }

  const countByType = (orders: Order[], type: string) =>
    orders.filter(o => o.type === type).length;

  return (
    <div className="kitchen-page">
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
          <span className="stat-value">{ordersByStatus.APROBADO.length}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-card stat-preparing">
          <span className="stat-value">{ordersByStatus.PREPARANDO.length}</span>
          <span className="stat-label">Preparando</span>
        </div>
        <div className="stat-card stat-ready">
          <span className="stat-value">{ordersByStatus.LISTO.length}</span>
          <span className="stat-label">Listos</span>
        </div>
      </div>

      <div className="kitchen-filters">
        <div className="filter-group">
          <span className="filter-label">Tipo:</span>
          <button
            className={`filter-btn ${typeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setTypeFilter('ALL')}
          >
            Todos
          </button>
          <button
            className={`filter-btn ${typeFilter === 'MESA' ? 'active' : ''}`}
            onClick={() => setTypeFilter('MESA')}
          >
            Mesa ({countByType(allOrders, 'MESA')})
          </button>
          <button
            className={`filter-btn ${typeFilter === 'DELIVERY' ? 'active' : ''}`}
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
            <h2>Pendientes</h2>
            <Badge variant="info">{ordersByStatus.APROBADO.length}</Badge>
          </div>
          <div className="kanban-content">
            {ordersByStatus.APROBADO
              .filter(o => typeFilter === 'ALL' || o.type === typeFilter)
              .map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))}
            {ordersByStatus.APROBADO.filter(
              o => typeFilter === 'ALL' || o.type === typeFilter
            ).length === 0 && (
              <div className="kanban-empty">Sin pedidos pendientes</div>
            )}
          </div>
        </div>

        {/* Columna PREPARANDO */}
        <div className="kanban-column">
          <div className="kanban-header kanban-preparing">
            <h2>Preparando</h2>
            <Badge variant="primary" pulse={ordersByStatus.PREPARANDO.length > 0}>
              {ordersByStatus.PREPARANDO.length}
            </Badge>
          </div>
          <div className="kanban-content">
            {ordersByStatus.PREPARANDO
              .filter(o => typeFilter === 'ALL' || o.type === typeFilter)
              .map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))}
            {ordersByStatus.PREPARANDO.filter(
              o => typeFilter === 'ALL' || o.type === typeFilter
            ).length === 0 && (
              <div className="kanban-empty">Sin pedidos en preparación</div>
            )}
          </div>
        </div>

        {/* Columna LISTO */}
        <div className="kanban-column">
          <div className="kanban-header kanban-ready">
            <h2>Listos para Entregar</h2>
            <Badge variant="success" pulse={ordersByStatus.LISTO.length > 0}>
              {ordersByStatus.LISTO.length}
            </Badge>
          </div>
          <div className="kanban-content">
            {ordersByStatus.LISTO
              .filter(o => typeFilter === 'ALL' || o.type === typeFilter)
              .map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))}
            {ordersByStatus.LISTO.filter(
              o => typeFilter === 'ALL' || o.type === typeFilter
            ).length === 0 && (
              <div className="kanban-empty">Sin pedidos listos</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;

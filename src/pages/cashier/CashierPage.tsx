import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '../../contexts';
import {
  getRestaurantById,
  getTablesByRestaurant,
  getCategoriesByRestaurant,
  getMenuItemsByCategory,
} from '../../data/mockData';
import { OrderCard } from '../../components/orders';
import { Card, Button, Input, Badge } from '../../components/ui';
import type { MenuItem, OrderItem, Table } from '../../types';
import { formatPrice } from '../../utils/format';
import './CashierPage.css';

export const CashierPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { getPendingTableOrders, approveOrder, rejectOrder, addOrder } = useOrders();

  const [showManualOrder, setShowManualOrder] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [manualItems, setManualItems] = useState<{ item: MenuItem; qty: number }[]>([]);

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : null;
  const tables = restaurantId ? getTablesByRestaurant(restaurantId) : [];
  const categories = restaurantId ? getCategoriesByRestaurant(restaurantId) : [];
  const pendingOrders = restaurantId ? getPendingTableOrders(restaurantId) : [];

  if (!restaurant) {
    return (
      <div className="cashier-page">
        <Card className="error-card">
          <h2>Restaurante no encontrado</h2>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </Card>
      </div>
    );
  }

  const handleAddManualItem = (item: MenuItem) => {
    setManualItems(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const handleRemoveManualItem = (itemId: string) => {
    setManualItems(prev => prev.filter(i => i.item.id !== itemId));
  };

  const handleUpdateQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveManualItem(itemId);
      return;
    }
    setManualItems(prev =>
      prev.map(i => (i.item.id === itemId ? { ...i, qty } : i))
    );
  };

  const manualTotal = manualItems.reduce(
    (acc, { item, qty }) => acc + item.price * qty,
    0
  );

  const handleSubmitManualOrder = () => {
    if (!selectedTable || !customerName.trim() || manualItems.length === 0) return;

    const orderItems: OrderItem[] = manualItems.map(({ item, qty }, index) => ({
      id: `oi-manual-${Date.now()}-${index}`,
      menuItemId: item.id,
      menuItem: item,
      quantity: qty,
      unitPrice: item.price,
      subtotal: item.price * qty,
    }));

    const maxPrepTime = Math.max(
      ...manualItems.map(({ item }) => item.preparationTime || 15)
    );

    addOrder({
      restaurantId: restaurant.id,
      type: 'MESA',
      status: 'APROBADO', // Pedido manual entra aprobado
      customerName: customerName.trim(),
      tableId: selectedTable.id,
      tableNumber: selectedTable.number,
      items: orderItems,
      total: manualTotal,
      estimatedTime: maxPrepTime,
    });

    // Reset form
    setShowManualOrder(false);
    setSelectedTable(null);
    setCustomerName('');
    setManualItems([]);
  };

  return (
    <div className="cashier-page">
      <header className="cashier-header">
        <div className="cashier-header-content">
          <Link to="/" className="back-link">← Inicio</Link>
          <h1>{restaurant.name}</h1>
          <Badge variant="warning">Caja</Badge>
        </div>
        <div className="cashier-actions">
          <Button
            variant={showManualOrder ? 'secondary' : 'primary'}
            onClick={() => setShowManualOrder(!showManualOrder)}
          >
            {showManualOrder ? 'Ver Pendientes' : 'Cargar Pedido Manual'}
          </Button>
          <Link to={`/${restaurantId}/cocina`}>
            <Button variant="secondary">Ir a Cocina</Button>
          </Link>
        </div>
      </header>

      <div className="cashier-content">
        {showManualOrder ? (
          <div className="manual-order-section">
            <Card className="manual-order-form" variant="elevated">
              <h2>Nuevo Pedido Manual</h2>

              <div className="form-group">
                <label>Seleccionar Mesa *</label>
                <div className="table-selector">
                  {tables.map(table => (
                    <button
                      key={table.id}
                      className={`table-btn ${selectedTable?.id === table.id ? 'selected' : ''}`}
                      onClick={() => setSelectedTable(table)}
                    >
                      {table.number}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Nombre del cliente *"
                placeholder="Ej: Mesa 3 - Carlos"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                fullWidth
              />

              <div className="menu-picker">
                <h3>Agregar productos</h3>
                {categories.map(category => (
                  <div key={category.id} className="menu-picker-category">
                    <h4>{category.name}</h4>
                    <div className="menu-picker-items">
                      {getMenuItemsByCategory(category.id)
                        .filter(item => item.isAvailable)
                        .map(item => (
                          <button
                            key={item.id}
                            className="menu-picker-item"
                            onClick={() => handleAddManualItem(item)}
                          >
                            <span>{item.name}</span>
                            <span className="item-price">
                              {formatPrice(item.price)}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {manualItems.length > 0 && (
                <div className="manual-order-summary">
                  <h3>Resumen del pedido</h3>
                  {manualItems.map(({ item, qty }) => (
                    <div key={item.id} className="summary-item">
                      <div className="summary-item-info">
                        <span className="summary-item-name">{item.name}</span>
                        <span className="summary-item-price">
                          {formatPrice(item.price * qty)}
                        </span>
                      </div>
                      <div className="summary-item-controls">
                        <button onClick={() => handleUpdateQty(item.id, qty - 1)}>
                          −
                        </button>
                        <span>{qty}</span>
                        <button onClick={() => handleUpdateQty(item.id, qty + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="summary-total">
                    <span>Total</span>
                    <span>{formatPrice(manualTotal)}</span>
                  </div>
                  <Button
                    variant="success"
                    fullWidth
                    onClick={handleSubmitManualOrder}
                    disabled={!selectedTable || !customerName.trim()}
                  >
                    Crear Pedido (Aprobado)
                  </Button>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="pending-orders-section">
            <h2>
              Pedidos Pendientes de Aprobación
              {pendingOrders.length > 0 && (
                <Badge variant="warning" pulse>{pendingOrders.length}</Badge>
              )}
            </h2>

            {pendingOrders.length === 0 ? (
              <Card className="empty-state" variant="outlined">
                <span className="empty-icon">✓</span>
                <p>No hay pedidos pendientes de aprobación</p>
              </Card>
            ) : (
              <div className="orders-grid">
                {pendingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onApprove={approveOrder}
                    onReject={rejectOrder}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashierPage;

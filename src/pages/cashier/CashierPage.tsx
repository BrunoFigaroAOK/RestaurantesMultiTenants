import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders, useRestaurant, useProducts } from '../../contexts';
import {
  getTablesByRestaurant,
  getCategoriesByRestaurant,
} from '../../data/mockData';
import { OrderCard } from '../../components/orders';
import { Card, Button, Input, Badge } from '../../components/ui';
import type { MenuItem, OrderItem, Table } from '../../types';
import { formatPrice } from '../../utils/format';
import { getInitialStatus } from '../../utils/orderHelpers';
import './CashierPage.css';

type CashierView = 'orders' | 'manual' | 'products';

type ActionFeedback = {
  type: 'success' | 'error';
  message: string;
  orderId?: string;
} | null;

export const CashierPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { restaurant, setActiveRestaurant, error: restaurantError } = useRestaurant();
  const { getPendingTableOrders, getOrdersByStatus, approveOrder, rejectOrder, addOrder } = useOrders();
  const { getProductsByCategory, toggleProductAvailability, getProductsByRestaurant } = useProducts();

  const [currentView, setCurrentView] = useState<CashierView>('orders');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [manualItems, setManualItems] = useState<{ item: MenuItem; qty: number }[]>([]);
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject'; orderId: string } | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedback>(null);

  // Sincronizar restaurante activo con la ruta
  useEffect(() => {
    if (restaurantId) {
      setActiveRestaurant(restaurantId);
    }
  }, [restaurantId, setActiveRestaurant]);

  // Limpiar feedback después de 3 segundos
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const tables = restaurantId ? getTablesByRestaurant(restaurantId) : [];
  const categories = restaurantId ? getCategoriesByRestaurant(restaurantId) : [];
  const pendingOrders = restaurantId ? getPendingTableOrders(restaurantId) : [];
  const recentlyApproved = restaurantId
    ? getOrdersByStatus(restaurantId, ['APROBADO']).slice(0, 3)
    : [];
  const allProducts = restaurantId ? getProductsByRestaurant(restaurantId) : [];
  const unavailableCount = allProducts.filter(p => !p.isAvailable).length;

  if (!restaurant || restaurantError) {
    return (
      <div className="cashier-page">
        <Card className="error-card">
          <h2>Restaurante no encontrado</h2>
          <p>{restaurantError || 'El restaurante solicitado no existe.'}</p>
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

  const handleApproveOrder = (orderId: string) => {
    setConfirmAction({ type: 'approve', orderId });
  };

  const handleRejectOrder = (orderId: string) => {
    setConfirmAction({ type: 'reject', orderId });
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    const { type, orderId } = confirmAction;

    if (type === 'approve') {
      const success = approveOrder(orderId);
      setFeedback({
        type: success ? 'success' : 'error',
        message: success ? 'Pedido aprobado - Enviado a cocina' : 'Error al aprobar pedido',
        orderId,
      });
    } else {
      const success = rejectOrder(orderId);
      setFeedback({
        type: success ? 'success' : 'error',
        message: success ? 'Pedido rechazado' : 'Error al rechazar pedido',
        orderId,
      });
    }

    setConfirmAction(null);
  };

  const handleCancelAction = () => {
    setConfirmAction(null);
  };

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
      status: getInitialStatus('MESA', true), // Pedido manual entra APROBADO
      customerName: customerName.trim(),
      tableId: selectedTable.id,
      tableNumber: selectedTable.number,
      items: orderItems,
      total: manualTotal,
      estimatedTime: maxPrepTime,
    });

    setFeedback({
      type: 'success',
      message: `Pedido para Mesa ${selectedTable.number} creado y enviado a cocina`,
    });

    // Reset form
    setCurrentView('orders');
    setSelectedTable(null);
    setCustomerName('');
    setManualItems([]);
  };

  return (
    <div className="cashier-page">
      {/* Feedback Toast */}
      {feedback && (
        <div className={`feedback-toast feedback-${feedback.type}`}>
          <span className="feedback-icon">
            {feedback.type === 'success' ? '✓' : '✕'}
          </span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="confirm-overlay">
          <Card className="confirm-modal" variant="elevated">
            <h3>
              {confirmAction.type === 'approve'
                ? '¿Aprobar este pedido?'
                : '¿Rechazar este pedido?'}
            </h3>
            <p>
              {confirmAction.type === 'approve'
                ? 'El pedido será enviado a cocina para su preparación.'
                : 'El pedido será eliminado permanentemente.'}
            </p>
            <div className="confirm-actions">
              <Button variant="ghost" onClick={handleCancelAction}>
                Cancelar
              </Button>
              <Button
                variant={confirmAction.type === 'approve' ? 'success' : 'danger'}
                onClick={handleConfirmAction}
              >
                {confirmAction.type === 'approve' ? 'Sí, aprobar' : 'Sí, rechazar'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      <header className="cashier-header">
        <div className="cashier-header-content">
          <Link to="/" className="back-link">← Inicio</Link>
          <h1>{restaurant.name}</h1>
          <Badge variant="warning">Caja</Badge>
        </div>
        <div className="cashier-actions">
          <Button
            variant={currentView === 'orders' ? 'primary' : 'ghost'}
            onClick={() => setCurrentView('orders')}
          >
            Pedidos {pendingOrders.length > 0 && `(${pendingOrders.length})`}
          </Button>
          <Button
            variant={currentView === 'manual' ? 'primary' : 'ghost'}
            onClick={() => setCurrentView('manual')}
          >
            Pedido Manual
          </Button>
          <Button
            variant={currentView === 'products' ? 'primary' : 'ghost'}
            onClick={() => setCurrentView('products')}
          >
            Productos {unavailableCount > 0 && <Badge variant="warning" size="sm">{unavailableCount} pausados</Badge>}
          </Button>
          <Link to={`/${restaurantId}/cocina`}>
            <Button variant="secondary">Ir a Cocina</Button>
          </Link>
        </div>
      </header>

      <div className="cashier-content">
        {currentView === 'manual' && (
          <div className="manual-order-section">
            <Card className="manual-order-form" variant="elevated">
              <h2>Nuevo Pedido Manual</h2>
              <p className="form-hint">
                Los pedidos manuales se envían directamente a cocina como APROBADOS.
              </p>

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
                      {getProductsByCategory(category.id)
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
                    Crear Pedido y Enviar a Cocina
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {currentView === 'orders' && (
          <div className="pending-orders-section">
            <div className="section-header">
              <h2>
                Pedidos Pendientes de Aprobación
                {pendingOrders.length > 0 && (
                  <Badge variant="warning" pulse>{pendingOrders.length}</Badge>
                )}
              </h2>
              <p className="section-hint">
                Estos pedidos fueron realizados por clientes desde mesa (QR) y requieren aprobación.
              </p>
            </div>

            {pendingOrders.length === 0 ? (
              <Card className="empty-state" variant="outlined">
                <span className="empty-icon">✓</span>
                <p>No hay pedidos pendientes de aprobación</p>
                <span className="empty-hint">Los pedidos de mesa aparecerán aquí</span>
              </Card>
            ) : (
              <div className="orders-grid">
                {pendingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onApprove={handleApproveOrder}
                    onReject={handleRejectOrder}
                  />
                ))}
              </div>
            )}

            {/* Mostrar pedidos aprobados recientemente */}
            {recentlyApproved.length > 0 && (
              <div className="recently-approved">
                <h3>Enviados a Cocina Recientemente</h3>
                <div className="approved-list">
                  {recentlyApproved.map(order => (
                    <div key={order.id} className="approved-item">
                      <Badge variant="success" size="sm">Aprobado</Badge>
                      <span className="approved-info">
                        {order.type === 'MESA' ? `Mesa ${order.tableNumber}` : 'Delivery'} - {order.customerName}
                      </span>
                      <span className="approved-total">{formatPrice(order.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'products' && (
          <div className="products-management-section">
            <div className="section-header">
              <h2>Gestión de Productos</h2>
              <p className="section-hint">
                Pausá productos que no estén disponibles. Los clientes no podrán pedirlos hasta que los reactives.
              </p>
              {unavailableCount > 0 && (
                <div className="unavailable-summary">
                  <Badge variant="warning">{unavailableCount} producto{unavailableCount !== 1 ? 's' : ''} pausado{unavailableCount !== 1 ? 's' : ''}</Badge>
                </div>
              )}
            </div>

            <div className="products-by-category">
              {categories.map(category => {
                const categoryProducts = getProductsByCategory(category.id);
                if (categoryProducts.length === 0) return null;

                return (
                  <Card key={category.id} className="category-products-card" variant="outlined">
                    <h3 className="category-title">{category.name}</h3>
                    <div className="products-list">
                      {categoryProducts.map(product => (
                        <div
                          key={product.id}
                          className={`product-row ${!product.isAvailable ? 'product-paused' : ''}`}
                        >
                          <div className="product-info">
                            <span className="product-name">{product.name}</span>
                            <span className="product-price">{formatPrice(product.price)}</span>
                          </div>
                          <button
                            className={`toggle-btn ${product.isAvailable ? 'available' : 'paused'}`}
                            onClick={() => toggleProductAvailability(product.id)}
                            title={product.isAvailable ? 'Pausar producto' : 'Activar producto'}
                          >
                            {product.isAvailable ? (
                              <>
                                <span className="toggle-icon">✓</span>
                                <span className="toggle-label">Disponible</span>
                              </>
                            ) : (
                              <>
                                <span className="toggle-icon">⏸</span>
                                <span className="toggle-label">Pausado</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashierPage;

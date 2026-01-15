import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart, useOrders } from '../../contexts';
import {
  getRestaurantById,
  getCategoriesByRestaurant,
  getMenuItemsByCategory,
  getTableByNumber,
} from '../../data/mockData';
import { CategorySection, Cart } from '../../components/menu';
import { Card, Button, Input, Textarea } from '../../components/ui';
import type { MenuItem, OrderItem } from '../../types';
import './MenuPage.css';

export const MenuPage: React.FC = () => {
  const { restaurantId, tableNumber } = useParams<{
    restaurantId: string;
    tableNumber?: string;
  }>();
  const navigate = useNavigate();
  const { cart, initCart, addToCart, clearCart, getTotal } = useCart();
  const { addOrder } = useOrders();

  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderSent, setOrderSent] = useState(false);

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : null;
  const categories = restaurantId ? getCategoriesByRestaurant(restaurantId) : [];
  const isTableOrder = !!tableNumber;
  const table = isTableOrder && restaurantId
    ? getTableByNumber(restaurantId, parseInt(tableNumber))
    : null;

  useEffect(() => {
    if (restaurantId) {
      initCart(
        restaurantId,
        isTableOrder ? 'MESA' : 'DELIVERY',
        table?.id,
        table?.number
      );
    }
  }, [restaurantId, isTableOrder, table, initCart]);

  if (!restaurant) {
    return (
      <div className="menu-page">
        <Card className="error-card">
          <h2>Restaurante no encontrado</h2>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </Card>
      </div>
    );
  }

  if (!restaurant.isOpen) {
    return (
      <div className="menu-page">
        <Card className="error-card">
          <h2>{restaurant.name}</h2>
          <p>El restaurante se encuentra cerrado en este momento.</p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </Card>
      </div>
    );
  }

  const handleAddItem = (item: MenuItem) => {
    addToCart(item);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleSubmitOrder = () => {
    if (!cart || cart.items.length === 0) return;
    if (!customerName.trim()) return;
    if (!isTableOrder && (!customerPhone.trim() || !customerAddress.trim())) return;

    const orderItems: OrderItem[] = cart.items.map((item, index) => ({
      id: `oi-${Date.now()}-${index}`,
      menuItemId: item.menuItem.id,
      menuItem: item.menuItem,
      quantity: item.quantity,
      notes: item.notes,
      unitPrice: item.menuItem.price,
      subtotal: item.menuItem.price * item.quantity,
    }));

    const maxPrepTime = Math.max(
      ...cart.items.map(item => item.menuItem.preparationTime || 15)
    );

    addOrder({
      restaurantId: restaurant.id,
      type: isTableOrder ? 'MESA' : 'DELIVERY',
      status: isTableOrder ? 'CREADO' : 'APROBADO',
      customerName: customerName.trim(),
      customerPhone: !isTableOrder ? customerPhone.trim() : undefined,
      customerAddress: !isTableOrder ? customerAddress.trim() : undefined,
      tableId: table?.id,
      tableNumber: table?.number,
      items: orderItems,
      total: getTotal(),
      estimatedTime: maxPrepTime,
    });

    setOrderSent(true);
    clearCart();
  };

  if (orderSent) {
    return (
      <div className="menu-page">
        <Card className="success-card" variant="elevated">
          <div className="success-icon">✓</div>
          <h2>¡Pedido enviado!</h2>
          {isTableOrder ? (
            <p>Tu pedido ha sido enviado y está pendiente de aprobación por el staff.</p>
          ) : (
            <p>Tu pedido ha sido recibido y ya está siendo preparado.</p>
          )}
          <Button onClick={() => {
            setOrderSent(false);
            setShowCheckout(false);
            setCustomerName('');
            setCustomerPhone('');
            setCustomerAddress('');
          }}>
            Hacer otro pedido
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <header className="menu-header">
        <div className="menu-header-content">
          <h1>{restaurant.name}</h1>
          {isTableOrder && table && (
            <span className="table-badge">Mesa {table.number}</span>
          )}
          {!isTableOrder && (
            <span className="delivery-badge">Delivery</span>
          )}
        </div>
        <p className="menu-address">{restaurant.address}</p>
      </header>

      <div className="menu-layout">
        <main className="menu-content">
          {categories.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              items={getMenuItemsByCategory(category.id)}
              onAddItem={handleAddItem}
            />
          ))}
        </main>

        <aside className="menu-sidebar">
          {showCheckout ? (
            <Card className="checkout-form" variant="elevated">
              <h3>Finalizar Pedido</h3>
              <Input
                label="Tu nombre *"
                placeholder="Ej: Juan"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                fullWidth
              />
              {!isTableOrder && (
                <>
                  <Input
                    label="Teléfono *"
                    placeholder="Ej: 11 5555-1234"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    fullWidth
                  />
                  <Textarea
                    label="Dirección de entrega *"
                    placeholder="Calle, número, piso, depto..."
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                    fullWidth
                  />
                </>
              )}
              <div className="checkout-actions">
                <Button variant="ghost" onClick={() => setShowCheckout(false)}>
                  Volver
                </Button>
                <Button
                  variant="success"
                  onClick={handleSubmitOrder}
                  disabled={
                    !customerName.trim() ||
                    (!isTableOrder && (!customerPhone.trim() || !customerAddress.trim()))
                  }
                >
                  Enviar Pedido
                </Button>
              </div>
            </Card>
          ) : (
            <Cart onCheckout={handleCheckout} />
          )}
        </aside>
      </div>

      {/* Mobile cart button */}
      {cart && cart.items.length > 0 && !showCheckout && (
        <div className="mobile-cart-bar">
          <span>{cart.items.reduce((acc, item) => acc + item.quantity, 0)} items</span>
          <Button variant="success" onClick={handleCheckout}>
            Ver Pedido
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;

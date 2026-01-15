import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart, useOrders, useRestaurant } from '../../contexts';
import {
  getCategoriesByRestaurant,
  getMenuItemsByCategory,
  getTableByNumber,
} from '../../data/mockData';
import { CategorySection, Cart } from '../../components/menu';
import { Card, Button, Input, Textarea, Badge } from '../../components/ui';
import type { MenuItem, OrderItem, OrderStatus } from '../../types';
import { getInitialStatus } from '../../utils/orderHelpers';
import { formatPrice } from '../../utils/format';
import './MenuPage.css';

type FormErrors = {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
};

export const MenuPage: React.FC = () => {
  const { restaurantId, tableNumber } = useParams<{
    restaurantId: string;
    tableNumber?: string;
  }>();
  const navigate = useNavigate();
  const { restaurant, setActiveRestaurant, error: restaurantError } = useRestaurant();
  const { cart, initCart, addToCart, clearCart, getTotal, getItemCount } = useCart();
  const { addOrder } = useOrders();

  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderSent, setOrderSent] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [itemAdded, setItemAdded] = useState<string | null>(null);

  const isTableOrder = !!tableNumber;
  const table = isTableOrder && restaurantId
    ? getTableByNumber(restaurantId, parseInt(tableNumber))
    : null;

  // Sincronizar restaurante activo
  useEffect(() => {
    if (restaurantId) {
      setActiveRestaurant(restaurantId);
    }
  }, [restaurantId, setActiveRestaurant]);

  // Inicializar carrito
  useEffect(() => {
    if (restaurantId && restaurant) {
      initCart(
        restaurantId,
        isTableOrder ? 'MESA' : 'DELIVERY',
        table?.id,
        table?.number
      );
    }
  }, [restaurantId, restaurant, isTableOrder, table, initCart]);

  // Limpiar notificación de item agregado
  useEffect(() => {
    if (itemAdded) {
      const timer = setTimeout(() => setItemAdded(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [itemAdded]);

  const categories = restaurantId ? getCategoriesByRestaurant(restaurantId) : [];

  if (!restaurant || restaurantError) {
    return (
      <div className="menu-page">
        <Card className="error-card">
          <h2>Restaurante no encontrado</h2>
          <p>{restaurantError || 'El restaurante solicitado no existe.'}</p>
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
    setItemAdded(item.name);
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) return;
    setShowCheckout(true);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'El nombre es obligatorio';
    } else if (customerName.trim().length < 2) {
      newErrors.customerName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!isTableOrder) {
      if (!customerPhone.trim()) {
        newErrors.customerPhone = 'El teléfono es obligatorio';
      } else if (customerPhone.trim().length < 8) {
        newErrors.customerPhone = 'Ingresá un teléfono válido';
      }

      if (!customerAddress.trim()) {
        newErrors.customerAddress = 'La dirección es obligatoria';
      } else if (customerAddress.trim().length < 10) {
        newErrors.customerAddress = 'Ingresá una dirección más completa';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = () => {
    if (!cart || cart.items.length === 0) return;
    if (!validateForm()) return;

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

    const initialStatus = getInitialStatus(isTableOrder ? 'MESA' : 'DELIVERY');

    addOrder({
      restaurantId: restaurant.id,
      type: isTableOrder ? 'MESA' : 'DELIVERY',
      status: initialStatus,
      customerName: customerName.trim(),
      customerPhone: !isTableOrder ? customerPhone.trim() : undefined,
      customerAddress: !isTableOrder ? customerAddress.trim() : undefined,
      tableId: table?.id,
      tableNumber: table?.number,
      items: orderItems,
      total: getTotal(),
      estimatedTime: maxPrepTime,
    });

    setOrderStatus(initialStatus);
    setOrderSent(true);
    clearCart();
  };

  const handleNewOrder = () => {
    setOrderSent(false);
    setOrderStatus(null);
    setShowCheckout(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setErrors({});
  };

  if (orderSent) {
    return (
      <div className="menu-page">
        <Card className="success-card" variant="elevated">
          <div className={`success-icon ${orderStatus === 'CREADO' ? 'pending' : ''}`}>
            {orderStatus === 'CREADO' ? '⏳' : '✓'}
          </div>
          <h2>¡Pedido enviado!</h2>

          <div className="order-status-info">
            <Badge variant={orderStatus === 'CREADO' ? 'warning' : 'success'}>
              {orderStatus === 'CREADO' ? 'Pendiente de Aprobación' : 'En Preparación'}
            </Badge>
          </div>

          {orderStatus === 'CREADO' ? (
            <div className="status-message">
              <p>Tu pedido fue enviado a <strong>Mesa {table?.number}</strong>.</p>
              <p>El staff del restaurante lo revisará y confirmará en breve.</p>
            </div>
          ) : (
            <div className="status-message">
              <p>Tu pedido de delivery ha sido confirmado.</p>
              <p>El restaurante ya está preparando tu pedido.</p>
            </div>
          )}

          <Button onClick={handleNewOrder}>
            Hacer otro pedido
          </Button>
        </Card>
      </div>
    );
  }

  const cartItemCount = getItemCount();
  const canCheckout = cart && cart.items.length > 0;

  return (
    <div className="menu-page">
      {/* Item added notification */}
      {itemAdded && (
        <div className="item-added-toast">
          <span>✓</span> {itemAdded} agregado al pedido
        </div>
      )}

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

              {isTableOrder && (
                <div className="checkout-info">
                  <Badge variant="info">Mesa {table?.number}</Badge>
                  <span>El pedido requiere aprobación del staff</span>
                </div>
              )}

              <Input
                label="Tu nombre *"
                placeholder="Ej: Juan"
                value={customerName}
                onChange={e => {
                  setCustomerName(e.target.value);
                  if (errors.customerName) setErrors(prev => ({ ...prev, customerName: undefined }));
                }}
                error={errors.customerName}
                fullWidth
              />
              {!isTableOrder && (
                <>
                  <Input
                    label="Teléfono *"
                    placeholder="Ej: 11 5555-1234"
                    value={customerPhone}
                    onChange={e => {
                      setCustomerPhone(e.target.value);
                      if (errors.customerPhone) setErrors(prev => ({ ...prev, customerPhone: undefined }));
                    }}
                    error={errors.customerPhone}
                    fullWidth
                  />
                  <Textarea
                    label="Dirección de entrega *"
                    placeholder="Calle, número, piso, depto..."
                    value={customerAddress}
                    onChange={e => {
                      setCustomerAddress(e.target.value);
                      if (errors.customerAddress) setErrors(prev => ({ ...prev, customerAddress: undefined }));
                    }}
                    error={errors.customerAddress}
                    fullWidth
                  />
                </>
              )}

              <div className="checkout-summary">
                <span>Total a pagar</span>
                <span className="checkout-total">{formatPrice(getTotal())}</span>
              </div>

              <div className="checkout-actions">
                <Button variant="ghost" onClick={() => setShowCheckout(false)}>
                  Volver
                </Button>
                <Button
                  variant="success"
                  onClick={handleSubmitOrder}
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
      {canCheckout && !showCheckout && (
        <div className="mobile-cart-bar">
          <div className="mobile-cart-info">
            <span className="mobile-cart-count">{cartItemCount} items</span>
            <span className="mobile-cart-total">{formatPrice(getTotal())}</span>
          </div>
          <Button variant="success" onClick={handleCheckout}>
            Ver Pedido
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;

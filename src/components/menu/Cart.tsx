import React from 'react';
import { useCart } from '../../contexts';
import { Card, Button } from '../ui';
import { formatPrice } from '../../utils/format';
import './Cart.css';

interface CartProps {
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ onCheckout }) => {
  const { cart, updateQuantity, removeFromCart, getTotal, getItemCount } = useCart();

  if (!cart || cart.items.length === 0) {
    return (
      <Card className="cart cart-empty" variant="outlined">
        <div className="cart-empty-content">
          <span className="cart-empty-icon">🛒</span>
          <p>Tu carrito está vacío</p>
          <span className="cart-empty-hint">Agregá productos del menú</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="cart" padding="none">
      <div className="cart-header">
        <h3>Tu Pedido</h3>
        <span className="cart-count">{getItemCount()} items</span>
      </div>

      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.menuItem.id} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.menuItem.name}</span>
              <span className="cart-item-price">
                {formatPrice(item.menuItem.price)}
              </span>
            </div>
            <div className="cart-item-controls">
              <button
                className="cart-qty-btn"
                onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
              >
                −
              </button>
              <span className="cart-qty">{item.quantity}</span>
              <button
                className="cart-qty-btn"
                onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
              >
                +
              </button>
              <button
                className="cart-remove-btn"
                onClick={() => removeFromCart(item.menuItem.id)}
              >
                ✕
              </button>
            </div>
            <div className="cart-item-subtotal">
              {formatPrice(item.menuItem.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span className="cart-total-price">{formatPrice(getTotal())}</span>
        </div>
        <Button variant="success" fullWidth onClick={onCheckout}>
          Confirmar Pedido
        </Button>
      </div>
    </Card>
  );
};

export default Cart;

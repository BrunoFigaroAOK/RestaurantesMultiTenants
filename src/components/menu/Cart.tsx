import React from 'react';
import { useCart } from '../../contexts';
import type { CartItem } from '../../types';
import { Card, Button } from '../ui';
import { formatPrice } from '../../utils/format';
import './Cart.css';

interface CartProps {
  onCheckout: () => void;
}

// Generar key único para cada item (incluyendo modificaciones)
const getCartItemKey = (item: CartItem, index: number): string => {
  const removedIds = item.removedIngredients?.map(i => i.id).join('-') || '';
  const extraIds = item.extraIngredients?.map(i => i.id).join('-') || '';
  return `${item.menuItem.id}-${index}-${removedIds}-${extraIds}`;
};

// Calcular precio unitario con extras
const getItemUnitPrice = (item: CartItem): number => {
  const extrasPrice = item.extraIngredients?.reduce((sum, ing) => sum + (ing.price || 0), 0) || 0;
  return item.menuItem.price + extrasPrice;
};

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
        {cart.items.map((item, index) => {
          const unitPrice = getItemUnitPrice(item);
          const hasModifications =
            (item.removedIngredients && item.removedIngredients.length > 0) ||
            (item.extraIngredients && item.extraIngredients.length > 0) ||
            (item.notes && item.notes.trim().length > 0);

          return (
            <div key={getCartItemKey(item, index)} className="cart-item">
              <div className="cart-item-info">
                <span className="cart-item-name">{item.menuItem.name}</span>
                <span className="cart-item-price">
                  {formatPrice(unitPrice)}
                </span>
              </div>

              {/* Mostrar modificaciones */}
              {hasModifications && (
                <div className="cart-item-mods">
                  {item.removedIngredients?.map(ing => (
                    <span key={ing.id} className="cart-mod removed">
                      – sin {ing.name}
                    </span>
                  ))}
                  {item.extraIngredients?.map(ing => (
                    <span key={ing.id} className="cart-mod extra">
                      + {ing.name}
                      {ing.price && <span className="mod-price">+{formatPrice(ing.price)}</span>}
                    </span>
                  ))}
                  {item.notes && (
                    <span className="cart-mod note">📝 {item.notes}</span>
                  )}
                </div>
              )}

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
                {formatPrice(unitPrice * item.quantity)}
              </div>
            </div>
          );
        })}
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

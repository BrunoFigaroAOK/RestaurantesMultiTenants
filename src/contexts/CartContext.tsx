import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Cart, CartItem, CartContextType, MenuItem, OrderType, Ingredient } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);

  const initCart = useCallback((
    restaurantId: string,
    type: OrderType,
    tableId?: string,
    tableNumber?: number
  ) => {
    setCart({
      restaurantId,
      items: [],
      type,
      tableId,
      tableNumber,
    });
  }, []);

  const addToCart = useCallback((
    menuItem: MenuItem,
    quantity = 1,
    notes?: string,
    removedIngredients?: Ingredient[],
    extraIngredients?: Ingredient[]
  ) => {
    setCart(prev => {
      if (!prev) return prev;

      // Si hay modificaciones de ingredientes, siempre agregar como item nuevo
      const hasCustomization = (removedIngredients && removedIngredients.length > 0) ||
                               (extraIngredients && extraIngredients.length > 0) ||
                               (notes && notes.trim().length > 0);

      if (!hasCustomization) {
        // Sin personalización: buscar item existente sin personalización
        const existingIndex = prev.items.findIndex(item =>
          item.menuItem.id === menuItem.id &&
          !item.removedIngredients?.length &&
          !item.extraIngredients?.length &&
          !item.notes?.trim()
        );

        if (existingIndex >= 0) {
          const newItems = [...prev.items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
          return { ...prev, items: newItems };
        }
      }

      // Nuevo item (con o sin personalización)
      const newItem: CartItem = {
        menuItem,
        quantity,
        notes,
        removedIngredients,
        extraIngredients,
      };
      return { ...prev, items: [...prev.items, newItem] };
    });
  }, []);

  const removeFromCart = useCallback((menuItemId: string) => {
    setCart(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter(item => item.menuItem.id !== menuItemId),
      };
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    setCart(prev => {
      if (!prev) return prev;

      if (quantity <= 0) {
        return {
          ...prev,
          items: prev.items.filter(item => item.menuItem.id !== menuItemId),
        };
      }

      return {
        ...prev,
        items: prev.items.map(item =>
          item.menuItem.id === menuItemId ? { ...item, quantity } : item
        ),
      };
    });
  }, []);

  const updateNotes = useCallback((menuItemId: string, notes: string) => {
    setCart(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map(item =>
          item.menuItem.id === menuItemId ? { ...item, notes } : item
        ),
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(prev => prev ? { ...prev, items: [] } : null);
  }, []);

  const getTotal = useCallback((): number => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => {
      const basePrice = item.menuItem.price;
      const extrasPrice = item.extraIngredients?.reduce((sum, ing) => sum + (ing.price || 0), 0) || 0;
      return total + (basePrice + extrasPrice) * item.quantity;
    }, 0);
  }, [cart]);

  const getItemCount = useCallback((): number => {
    if (!cart) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value: CartContextType = {
    cart,
    initCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateNotes,
    clearCart,
    getTotal,
    getItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

export default CartContext;

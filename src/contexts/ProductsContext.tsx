import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { MenuItem, ProductsContextType } from '../types';
import { menuItems as initialMenuItems } from '../data/mockData';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<MenuItem[]>(initialMenuItems);

  const getProductsByRestaurant = useCallback((restaurantId: string): MenuItem[] => {
    return products.filter(p => p.restaurantId === restaurantId);
  }, [products]);

  const getProductsByCategory = useCallback((categoryId: string): MenuItem[] => {
    return products.filter(p => p.categoryId === categoryId);
  }, [products]);

  const getProductById = useCallback((productId: string): MenuItem | undefined => {
    return products.find(p => p.id === productId);
  }, [products]);

  const toggleProductAvailability = useCallback((productId: string): void => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, isAvailable: !product.isAvailable }
          : product
      )
    );
  }, []);

  const setProductAvailability = useCallback((productId: string, isAvailable: boolean): void => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, isAvailable }
          : product
      )
    );
  }, []);

  const value: ProductsContextType = {
    products,
    getProductsByRestaurant,
    getProductsByCategory,
    getProductById,
    toggleProductAvailability,
    setProductAvailability,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts debe usarse dentro de un ProductsProvider');
  }
  return context;
};

export default ProductsContext;

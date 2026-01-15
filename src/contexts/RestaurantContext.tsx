import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Restaurant } from '../types';
import { getRestaurantById } from '../data/mockData';

interface RestaurantContextType {
  restaurant: Restaurant | null;
  restaurantId: string | null;
  isLoading: boolean;
  error: string | null;
  setActiveRestaurant: (id: string) => void;
  clearRestaurant: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setActiveRestaurant = useCallback((id: string) => {
    // Evitar recargar si ya es el mismo restaurante
    if (id === restaurantId && restaurant) return;

    setIsLoading(true);
    setError(null);

    const foundRestaurant = getRestaurantById(id);

    if (foundRestaurant) {
      setRestaurant(foundRestaurant);
      setRestaurantId(id);
      setError(null);
    } else {
      setRestaurant(null);
      setRestaurantId(null);
      setError('Restaurante no encontrado');
    }

    setIsLoading(false);
  }, [restaurantId, restaurant]);

  const clearRestaurant = useCallback(() => {
    setRestaurant(null);
    setRestaurantId(null);
    setError(null);
  }, []);

  const value: RestaurantContextType = {
    restaurant,
    restaurantId,
    isLoading,
    error,
    setActiveRestaurant,
    clearRestaurant,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant debe usarse dentro de un RestaurantProvider');
  }
  return context;
};

export default RestaurantContext;

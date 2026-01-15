import React from 'react';
import type { MenuItem } from '../../types';
import { Card, Button, Badge } from '../ui';
import { formatPrice } from '../../utils/format';
import './MenuItemCard.css';

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAdd }) => {
  return (
    <Card className="menu-item-card" variant="outlined">
      <div className="menu-item-content">
        <div className="menu-item-info">
          <div className="menu-item-header">
            <h3 className="menu-item-name">{item.name}</h3>
            {!item.isAvailable && (
              <Badge variant="danger" size="sm">Agotado</Badge>
            )}
          </div>
          <p className="menu-item-description">{item.description}</p>
          {item.preparationTime && (
            <span className="menu-item-time">
              ~ {item.preparationTime} min
            </span>
          )}
        </div>
        <div className="menu-item-actions">
          <span className="menu-item-price">{formatPrice(item.price)}</span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAdd(item)}
            disabled={!item.isAvailable}
          >
            Agregar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MenuItemCard;

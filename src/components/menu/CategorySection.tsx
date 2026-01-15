import React from 'react';
import type { MenuCategory, MenuItem } from '../../types';
import { MenuItemCard } from './MenuItemCard';
import './CategorySection.css';

interface CategorySectionProps {
  category: MenuCategory;
  items: MenuItem[];
  onAddItem: (item: MenuItem) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  items,
  onAddItem,
}) => {
  if (items.length === 0) return null;

  return (
    <section className="category-section">
      <h2 className="category-title">{category.name}</h2>
      {category.description && (
        <p className="category-description">{category.description}</p>
      )}
      <div className="category-items">
        {items.map(item => (
          <MenuItemCard key={item.id} item={item} onAdd={onAddItem} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

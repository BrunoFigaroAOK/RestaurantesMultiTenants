import React from 'react';
import type { Ingredient, MenuItem } from '../../types';
import './IngredientSelector.css';

interface IngredientSelectorProps {
  menuItem: MenuItem;
  removedIngredients: Ingredient[];
  extraIngredients: Ingredient[];
  onToggleRemoved: (ingredient: Ingredient) => void;
  onToggleExtra: (ingredient: Ingredient) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  menuItem,
  removedIngredients,
  extraIngredients,
  onToggleRemoved,
  onToggleExtra,
  notes,
  onNotesChange,
}) => {
  const ingredients = menuItem.ingredients || [];
  const removableIngredients = ingredients.filter(i => i.type === 'removable');
  const extraIngredientOptions = ingredients.filter(i => i.type === 'extra');

  const isRemoved = (ingredient: Ingredient) =>
    removedIngredients.some(i => i.id === ingredient.id);

  const isExtra = (ingredient: Ingredient) =>
    extraIngredients.some(i => i.id === ingredient.id);

  const extraTotal = extraIngredients.reduce((sum, ing) => sum + (ing.price || 0), 0);

  if (ingredients.length === 0) {
    return (
      <div className="ingredient-selector">
        <div className="ingredient-section">
          <label className="ingredient-section-title">Observaciones</label>
          <textarea
            className="ingredient-notes"
            placeholder="Ej: bien cocido, sin sal..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={2}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="ingredient-selector">
      {removableIngredients.length > 0 && (
        <div className="ingredient-section">
          <label className="ingredient-section-title">Sin...</label>
          <div className="ingredient-options">
            {removableIngredients.map(ingredient => (
              <label key={ingredient.id} className="ingredient-option removable">
                <input
                  type="checkbox"
                  checked={isRemoved(ingredient)}
                  onChange={() => onToggleRemoved(ingredient)}
                />
                <span className="ingredient-name">Sin {ingredient.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {extraIngredientOptions.length > 0 && (
        <div className="ingredient-section">
          <label className="ingredient-section-title">Agregar extra...</label>
          <div className="ingredient-options">
            {extraIngredientOptions.map(ingredient => (
              <label key={ingredient.id} className="ingredient-option extra">
                <input
                  type="checkbox"
                  checked={isExtra(ingredient)}
                  onChange={() => onToggleExtra(ingredient)}
                />
                <span className="ingredient-name">{ingredient.name}</span>
                {ingredient.price && (
                  <span className="ingredient-price">+${ingredient.price.toLocaleString()}</span>
                )}
              </label>
            ))}
          </div>
          {extraTotal > 0 && (
            <div className="ingredient-extra-total">
              Extras: +${extraTotal.toLocaleString()}
            </div>
          )}
        </div>
      )}

      <div className="ingredient-section">
        <label className="ingredient-section-title">Observaciones</label>
        <textarea
          className="ingredient-notes"
          placeholder="Otras indicaciones..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={2}
        />
      </div>
    </div>
  );
};

export default IngredientSelector;

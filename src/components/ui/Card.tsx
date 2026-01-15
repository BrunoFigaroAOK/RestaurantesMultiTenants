import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick,
}) => {
  const classes = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    onClick ? 'card-clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;

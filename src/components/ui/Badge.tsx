import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
}) => {
  const classes = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    pulse ? 'badge-pulse' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
};

export default Badge;

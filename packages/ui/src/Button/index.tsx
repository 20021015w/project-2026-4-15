import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  type?: 'primary' | 'default' | 'danger';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  type = 'default',
  size = 'medium',
  onClick,
}) => {
  const getTypeClass = () => {
    switch (type) {
      case 'primary':
        return 'button-primary';
      case 'danger':
        return 'button-danger';
      default:
        return 'button-default';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'button-small';
      case 'large':
        return 'button-large';
      default:
        return 'button-medium';
    }
  };

  return (
    <button
      className={`button ${getTypeClass()} ${getSizeClass()}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
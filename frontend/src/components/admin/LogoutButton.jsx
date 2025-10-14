import React from 'react';
import apiService from './ApiService';
import { Button } from '../ui/button';

function LogoutButton({ className = '', children, variant = 'outline', size = 'sm' }) {
  const handleLogout = () => {
    apiService.logout();
  };

  return (
    <Button type="button" onClick={handleLogout} className={className} variant={variant} size={size}>
      {children || 'Logout'}
    </Button>
  );
}

export default LogoutButton;

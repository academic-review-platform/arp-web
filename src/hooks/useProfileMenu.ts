import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes.constants';

export interface UseProfileMenuReturn {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  openMenu: (event: React.MouseEvent<HTMLElement>) => void;
  closeMenu: () => void;
  handleLogout: () => void;
}

export const useProfileMenu = (): UseProfileMenuReturn => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const isOpen = Boolean(anchorEl);

  const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    closeMenu();
    logout();
    navigate(ROUTES.LOGIN);
  }, [closeMenu, logout, navigate]);

  return { anchorEl, isOpen, openMenu, closeMenu, handleLogout };
};

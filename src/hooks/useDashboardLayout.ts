import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import type { Course } from '../store/models/courseStoreModels';

export interface UseDashboardLayoutReturn {
  // Sidebar
  isSidebarOpen: boolean;
  isDesktop: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  // Auth
  handleLogout: () => void;
  // User
  userName: string;
  userInitial: string;
  // Courses para el sidebar
  ownedCourses: Course[];
  enrolledCourses: Course[];
}

export const useDashboardLayout = (): UseDashboardLayoutReturn => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // En desktop el sidebar arranca abierto; en mobile cerrado
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const ownedCourses = useCourseStore((state) => state.ownedCourses);
  const enrolledCourses = useCourseStore((state) => state.enrolledCourses);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Usa firstname y lastname para el nombre completo
  const userName = `${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim() || (user?.email ?? '');
  const userInitial = userName.charAt(0).toUpperCase() || 'U';

  return {
    isSidebarOpen,
    isDesktop,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    handleLogout,
    userName,
    userInitial,
    ownedCourses,
    enrolledCourses,
  };
};

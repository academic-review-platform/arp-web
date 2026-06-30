import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildCourseRoute } from '../constants/routes.constants';
import type { Course } from '../store/models/courseStoreModels';

export interface UseCourseCardReturn {
  menuAnchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  openMenu: (event: React.MouseEvent<HTMLElement>) => void;
  closeMenu: () => void;
  handleCardClick: () => void;
  handleCopyCode: () => void;
}

export const useCourseCard = (course: Course): UseCourseCardReturn => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(menuAnchorEl);

  const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    // Evita que el click burbujee al card y navegue
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const handleCardClick = useCallback(() => {
    navigate(buildCourseRoute(course.id));
  }, [navigate, course.id]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(course.enrollmentCode);
    closeMenu();
  }, [course.enrollmentCode, closeMenu]);

  return {
    menuAnchorEl,
    isMenuOpen,
    openMenu,
    closeMenu,
    handleCardClick,
    handleCopyCode,
  };
};

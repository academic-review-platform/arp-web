import { useState, useCallback } from 'react';
import { useFormik } from 'formik';

import { createCourseSchema } from './schemas/createCourseSchema';
import { enrollCourseSchema } from './schemas/enrollCourseSchema';
import { createCourse, enrollInCourse } from '../services/courseService';
import { useCourseStore } from '../store/courseStore';
import type { Course } from '../store/models/courseStoreModels';

type ActiveModal = 'none' | 'create' | 'enroll';

export interface UseAddMenuReturn {
  // Menú "+"
  menuAnchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  openMenu: (event: React.MouseEvent<HTMLElement>) => void;
  closeMenu: () => void;
  // Modales
  activeModal: ActiveModal;
  openCreateModal: () => void;
  openEnrollModal: () => void;
  closeModal: () => void;
  // Formik crear curso
  createFormik: ReturnType<typeof useFormik<{ title: string; description: string }>>;
  isCreating: boolean;
  // Formik inscribirse
  enrollFormik: ReturnType<typeof useFormik<{ enrollmentCode: string }>>;
  isEnrolling: boolean;
}

export const useAddMenu = (): UseAddMenuReturn => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [isCreating, setIsCreating] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const addOwnedCourse    = useCourseStore((state) => state.createCourse);
  const addEnrolledCourse = useCourseStore((state) => state.enrollInCourse);

  // ── Menú ──────────────────────────────────────────────────────────────────
  const isMenuOpen = Boolean(menuAnchorEl);

  const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  // ── Modales ───────────────────────────────────────────────────────────────
  const openCreateModal = useCallback(() => {
    closeMenu();
    setActiveModal('create');
  }, [closeMenu]);

  const openEnrollModal = useCallback(() => {
    closeMenu();
    setActiveModal('enroll');
  }, [closeMenu]);

  const closeModal = useCallback(() => {
    setActiveModal('none');
  }, []);

  // ── Formik crear ──────────────────────────────────────────────────────────
  const createFormik = useFormik({
    initialValues: { title: '', description: '' },
    validationSchema: createCourseSchema,
    onSubmit: async (values, helpers) => {
      setIsCreating(true);
      try {
        const res = await createCourse(values);
        const course: Course = {
          id: res.id,
          name: res.title,
          description: res.description ?? '',
          enrollmentCode: res.enrollmentCode,
          ownerId: res.ownerId,
        };
        await addOwnedCourse(course);
        helpers.resetForm();
        closeModal();
      } catch {
        helpers.setStatus('No se pudo crear el curso. Intenta de nuevo.');
      } finally {
        setIsCreating(false);
      }
    },
  });

  // ── Formik inscribirse ────────────────────────────────────────────────────
  const enrollFormik = useFormik({
    initialValues: { enrollmentCode: '' },
    validationSchema: enrollCourseSchema,
    onSubmit: async (values, helpers) => {
      setIsEnrolling(true);
      try {
        const res = await enrollInCourse(values);
        const course: Course = {
          id: res.courseId,
          name: res.courseId,
          description: '',
          enrollmentCode: '',
          ownerId: res.userId,
        };
        await addEnrolledCourse(course);
        helpers.resetForm();
        closeModal();
      } catch {
        helpers.setStatus('Código inválido o ya estás inscrito.');
      } finally {
        setIsEnrolling(false);
      }
    },
  });

  return {
    menuAnchorEl,
    isMenuOpen,
    openMenu,
    closeMenu,
    activeModal,
    openCreateModal,
    openEnrollModal,
    closeModal,
    createFormik,
    isCreating,
    enrollFormik,
    isEnrolling,
  };
};

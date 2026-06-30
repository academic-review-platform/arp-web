import { useState, useCallback } from 'react';
import { useFormik } from 'formik';

import { createCourseSchema } from './schemas/createCourseSchema';
import {
  updateCourse as updateCourseService,
  deleteCourse as deleteCourseService,
  unenrollFromCourse as unenrollFromCourseService,
} from '../services/courseService';
import { useCourseStore } from '../store/courseStore';
import type { Course } from '../store/models/courseStoreModels';

type ActiveModal = 'none' | 'edit' | 'delete' | 'leave';

export interface UseDashboardActionsReturn {
  // Modal activo
  activeModal: ActiveModal;
  // Curso seleccionado (target de la acción)
  selectedCourse: Course | null;
  // Handlers para abrir cada modal desde el CourseCard
  openEditModal:   (course: Course) => void;
  openDeleteModal: (course: Course) => void;
  openLeaveModal:  (course: Course) => void;
  closeModal:      () => void;
  // Edición
  editFormik: ReturnType<typeof useFormik<{ title: string; description: string }>>;
  isEditing: boolean;
  // Borrado
  handleConfirmDelete: () => void;
  isDeleting: boolean;
  // Abandono
  handleConfirmLeave: () => void;
  isLeaving: boolean;
}

export const useDashboardActions = (): UseDashboardActionsReturn => {
  const [activeModal, setActiveModal]     = useState<ActiveModal>('none');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing]         = useState(false);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [isLeaving, setIsLeaving]         = useState(false);

  const storeUpdateCourse      = useCourseStore((state) => state.updateCourse);
  const storeDeleteCourse      = useCourseStore((state) => state.deleteCourse);

  const closeModal = useCallback(() => {
    setActiveModal('none');
    setSelectedCourse(null);
  }, []);

  const openEditModal = useCallback((course: Course) => {
    setSelectedCourse(course);
    setActiveModal('edit');
  }, []);

  const openDeleteModal = useCallback((course: Course) => {
    setSelectedCourse(course);
    setActiveModal('delete');
  }, []);

  const openLeaveModal = useCallback((course: Course) => {
    setSelectedCourse(course);
    setActiveModal('leave');
  }, []);

  // enableReinitialize recarga los initialValues cuando selectedCourse cambia
  const editFormik = useFormik({
    initialValues: {
      title:       selectedCourse?.name ?? '',
      description: selectedCourse?.description ?? '',
    },
    enableReinitialize: true,
    validationSchema: createCourseSchema,
    onSubmit: async (values, helpers) => {
      if (!selectedCourse) return;
      setIsEditing(true);
      try {
        const res = await updateCourseService(selectedCourse.id, values);
        const updated: Course = {
          id: res.id,
          name: res.title,
          description: res.description ?? '',
          enrollmentCode: res.enrollmentCode,
          ownerId: res.ownerId,
        };
        await storeUpdateCourse(updated.id, updated);
        closeModal();
      } catch {
        helpers.setStatus('No se pudo actualizar el curso. Intenta de nuevo.');
      } finally {
        setIsEditing(false);
      }
    },
  });

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedCourse) return;
    setIsDeleting(true);
    try {
      await deleteCourseService(selectedCourse.id);
      await storeDeleteCourse(selectedCourse.id);
      closeModal();
    } catch {
      // El modal de confirmación no tiene campo de error,
      // cerramos de todas formas para no bloquear al usuario
      closeModal();
    } finally {
      setIsDeleting(false);
    }
  }, [selectedCourse, storeDeleteCourse, closeModal]);

  const handleConfirmLeave = useCallback(async () => {
    if (!selectedCourse) return;
    setIsLeaving(true);
    try {
      await unenrollFromCourseService(selectedCourse.id);
      await storeDeleteCourse(selectedCourse.id);
      closeModal();
    } catch {
      closeModal();
    } finally {
      setIsLeaving(false);
    }
  }, [selectedCourse, storeDeleteCourse, closeModal]);

  return {
    activeModal,
    selectedCourse,
    openEditModal,
    openDeleteModal,
    openLeaveModal,
    closeModal,
    editFormik,
    isEditing,
    handleConfirmDelete,
    isDeleting,
    handleConfirmLeave,
    isLeaving,
  };
};

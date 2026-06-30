/**
 * useCourseActions
 *
 * Orchestrates modal state and form submissions for the course-detail level:
 * - Edit course
 * - Delete course
 * - Copy enrollment code (clipboard — no modal)
 * - Add bibliography to course
 * - Delete bibliography from course
 */
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createCourseSchema } from './schemas/createCourseSchema';
import { bibliographySchema } from './schemas/bibliographySchema';
import { topicSchema } from './schemas/topicSchema';

import { deleteCourse, updateCourse, createCourseTopic } from '../services/courseService';
import {
  createCourseBibliography,
  deleteBibliography,
} from '../services/bibliographyService';

import type { BibliographyFormValues } from './schemas/bibliographySchema';
import type { TopicFormValues } from './schemas/topicSchema';
import type { Bibliography } from '../services/models/bibliographyModels';
import type { Course } from '../services/models/courseModels';

import { ROUTES } from '../constants/routes.constants';

type ModalState =
  | { kind: 'none' }
  | { kind: 'editCourse'; course: Course }
  | { kind: 'deleteCourse'; course: Course }
  | { kind: 'createTopic' }
  | { kind: 'addBibliography' }
  | { kind: 'deleteBibliography'; bibliography: Bibliography };

interface UseCourseActionsParams {
  course: Course | null;
  onRefresh: () => void;
}

export const useCourseActions = ({ course, onRefresh }: UseCourseActionsParams) => {
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalState>({ kind: 'none' });
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const closeModal = useCallback(() => {
    if (!isLoading) setModal({ kind: 'none' });
  }, [isLoading]);

  const openEditCourse = () => {
    if (course) setModal({ kind: 'editCourse', course });
  };
  const openDeleteCourse = () => {
    if (course) setModal({ kind: 'deleteCourse', course });
  };
  const openCreateTopic = () => setModal({ kind: 'createTopic' });
  const openAddBibliography = () => setModal({ kind: 'addBibliography' });
  const openDeleteBibliography = (bibliography: Bibliography) =>
    setModal({ kind: 'deleteBibliography', bibliography });

  const copyEnrollmentCode = async () => {
    if (!course) return;
    try {
      await navigator.clipboard.writeText(course.enrollmentCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard
      const ta = document.createElement('textarea');
      ta.value = course.enrollmentCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const run = async (fn: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await fn();
      onRefresh();
      setModal({ kind: 'none' });
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  // ── Topic formik ──────────────────────────────────────────────────────────

  const topicFormik = useFormik<TopicFormValues>({
    initialValues: { title: '', description: '' },
    enableReinitialize: true,
    validationSchema: topicSchema,
    onSubmit: async (values, helpers) => {
      if (!course) return;
      setIsLoading(true);
      try {
        await createCourseTopic(course.id, values);
        onRefresh();
        setModal({ kind: 'none' });
        helpers.resetForm();
      } catch {
        helpers.setStatus('No se pudo crear el tema. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // ── Course formik ──────────────────────────────────────────────────────────

  const courseFormik = useFormik<{ title: string; description: string }>({
    initialValues: {
      title: modal.kind === 'editCourse' ? modal.course.title : '',
      description: modal.kind === 'editCourse' ? (modal.course.description ?? '') : '',
    },
    enableReinitialize: true,
    validationSchema: createCourseSchema,
    onSubmit: async (values, helpers) => {
      if (modal.kind !== 'editCourse') return;
      setIsLoading(true);
      try {
        await updateCourse(modal.course.id, values);
        onRefresh();
        setModal({ kind: 'none' });
      } catch {
        helpers.setStatus('No se pudo actualizar el curso. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDeleteCourse = () =>
    run(async () => {
      if (modal.kind !== 'deleteCourse') return;
      await deleteCourse(modal.course.id);
      navigate(ROUTES.DASHBOARD);
    });

  // ── Bibliography formik ────────────────────────────────────────────────────

  const bibliographyFormik = useFormik<BibliographyFormValues>({
    initialValues: { title: '', bibliographyType: '', url: '', file: null },
    enableReinitialize: true,
    validationSchema: bibliographySchema,
    onSubmit: async (values, helpers) => {
      if (!course || !values.bibliographyType) return;
      setIsLoading(true);
      try {
        await createCourseBibliography(course.id, {
          title: values.title,
          bibliographyType: values.bibliographyType,
          url: values.url,
          mimeType: values.file ? values.file.type : 'text/html',
          file: values.file ?? undefined,
        });
        onRefresh();
        setModal({ kind: 'none' });
        helpers.resetForm();
      } catch {
        helpers.setStatus('No se pudo publicar la bibliografía. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDeleteBibliography = () =>
    run(async () => {
      if (modal.kind !== 'deleteBibliography') return;
      await deleteBibliography(modal.bibliography.id);
    });

  return {
    modal,
    isLoading,
    copySuccess,
    closeModal,
    openEditCourse,
    openDeleteCourse,
    openCreateTopic,
    openAddBibliography,
    openDeleteBibliography,
    copyEnrollmentCode,
    topicFormik,
    courseFormik,
    bibliographyFormik,
    handleDeleteCourse,
    handleDeleteBibliography,
  };
};

export type UseCourseActionsReturn = ReturnType<typeof useCourseActions>;

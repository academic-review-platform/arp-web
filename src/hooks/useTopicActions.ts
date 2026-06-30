/**
 * useTopicActions
 *
 * Orchestrates all modal state and form submissions for a single topic section:
 * - Topic: edit, delete
 * - Bibliography (topic-level): add, delete
 * - Session: create, edit, delete
 * - Assignment: create, edit, delete, reference bibliography, reference session
 * - Note: publish (student), edit, delete, download, AI review
 *
 * Call sites receive handler callbacks and modal state slices ready to spread
 * into the corresponding modal components.
 */
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';

import { assignmentSchema } from './schemas/assignmentSchema';
import { bibliographySchema } from './schemas/bibliographySchema';
import { noteUploadSchema } from './schemas/noteUploadSchema';
import { sessionSchema } from './schemas/sessionSchema';
import { topicSchema } from './schemas/topicSchema';

import {
  addBibliographyToAssignment,
  addSessionReference,
  createAssignment,
  deleteAssignment,
  getAssignmentBibliographies,
  getAssignmentReferences,
  removeBibliographyFromAssignment,
  removeSessionReference,
  updateAssignment,
} from '../services/assignmentService';
import {
  createTopicBibliography as createTopicBibliographyService,
  createAssignmentBibliography as createAssignmentBibliographyService,
  deleteBibliography,
} from '../services/bibliographyService';
import { createNote, createNoteReviewAI, deleteNote, updateNote } from '../services/noteService';
import {
  createSession,
  deleteSession,
  updateSession,
} from '../services/sessionService';
import { deleteTopic, updateTopic } from '../services/topicService';

import type { AssignmentFormValues } from './schemas/assignmentSchema';
import type { BibliographyFormValues } from './schemas/bibliographySchema';
import type { NoteUploadFormValues } from './schemas/noteUploadSchema';
import type { SessionFormValues } from './schemas/sessionSchema';
import type { TopicFormValues } from './schemas/topicSchema';

import type { Assignment } from '../services/models/assignmentModels';
import type { Bibliography } from '../services/models/bibliographyModels';
import type { Note } from '../services/models/noteModels';
import type { Session } from '../services/models/sessionModels';
import type { Topic } from '../services/models/topicModels';

type ModalState =
  | { kind: 'none' }
  // Topic
  | { kind: 'editTopic'; topic: Topic }
  | { kind: 'deleteTopic'; topic: Topic }
  // Topic bibliography
  | { kind: 'addTopicBibliography' }
  | { kind: 'deleteTopicBibliography'; bibliography: Bibliography }
  // Session
  | { kind: 'createSession' }
  | { kind: 'editSession'; session: Session }
  | { kind: 'deleteSession'; session: Session }
  // Assignment
  | { kind: 'createAssignment' }
  | { kind: 'editAssignment'; assignment: Assignment }
  | { kind: 'deleteAssignment'; assignment: Assignment }
  | { kind: 'refBibliographyAssignment'; assignment: Assignment; available: Bibliography[] }
  | { kind: 'addAssignmentBibliography'; assignment: Assignment }
  | { kind: 'deleteAssignmentBibliography'; assignment: Assignment; bibliography: Bibliography }
  | { kind: 'refSessionAssignment'; assignment: Assignment; available: Session[] }
  | { kind: 'deleteAssignmentSession'; assignment: Assignment; session: Session }
  // Note
  | { kind: 'publishNote' }
  | { kind: 'editNote'; note: Note }
  | { kind: 'deleteNote'; note: Note }
  | { kind: 'aiReviewNote'; note: Note };

interface UseTopicActionsParams {
  topicId: string;
  /** All sessions in this topic — used to compute unreferenced ones */
  sessions: Session[];
  /** Bibliographies belonging to this topic */
  topicBibliographies: Bibliography[];
  /** Bibliographies belonging to the parent course — also eligible for linking */
  courseBibliographies: Bibliography[];
  onRefresh: () => void;
}

export const useTopicActions = ({
  topicId,
  sessions,
  topicBibliographies,
  courseBibliographies,
  onRefresh,
}: UseTopicActionsParams) => {
  const [modal, setModal] = useState<ModalState>({ kind: 'none' });
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = useCallback(() => {
    if (!isLoading) setModal({ kind: 'none' });
  }, [isLoading]);

  // ── Openers ────────────────────────────────────────────────────────────────

  const openEditTopic = (topic: Topic) => setModal({ kind: 'editTopic', topic });
  const openDeleteTopic = (topic: Topic) => setModal({ kind: 'deleteTopic', topic });
  const openAddTopicBibliography = () => setModal({ kind: 'addTopicBibliography' });
  const openDeleteTopicBibliography = (bibliography: Bibliography) =>
    setModal({ kind: 'deleteTopicBibliography', bibliography });

  const openCreateSession = () => setModal({ kind: 'createSession' });
  const openEditSession = (session: Session) => setModal({ kind: 'editSession', session });
  const openDeleteSession = (session: Session) => setModal({ kind: 'deleteSession', session });

  const openCreateAssignment = () => setModal({ kind: 'createAssignment' });
  const openEditAssignment = (assignment: Assignment) =>
    setModal({ kind: 'editAssignment', assignment });
  const openDeleteAssignment = (assignment: Assignment) =>
    setModal({ kind: 'deleteAssignment', assignment });
  const openAddAssignmentBibliography = (assignment: Assignment) =>
    setModal({ kind: 'addAssignmentBibliography', assignment });
  const openDeleteAssignmentBibliography = (assignment: Assignment, bibliography: Bibliography) =>
    setModal({ kind: 'deleteAssignmentBibliography', assignment, bibliography });
  const openRefBibliographyAssignment = async (assignment: Assignment) => {
    // Show modal in loading state immediately so UX doesn't feel frozen
    setModal({ kind: 'refBibliographyAssignment', assignment, available: [] });
    setIsLoading(true);
    try {
      // Fetch bibliographies already linked to this assignment from the API
      const linked = await getAssignmentBibliographies(assignment.id);
      const linkedIds = new Set(linked.map((b) => b.id));

      // Pool = topic bibliographies + course bibliographies (deduplicated by id)
      const allById = new Map<string, Bibliography>();
      for (const b of [...topicBibliographies, ...courseBibliographies]) {
        allById.set(b.id, b);
      }
      const available = Array.from(allById.values()).filter((b) => !linkedIds.has(b.id));

      setModal({ kind: 'refBibliographyAssignment', assignment, available });
    } catch {
      // If the fetch fails, fall back to locally known data minus what's on the assignment
      const referencedIds = new Set(
        (assignment.bibliographies ?? []).map((b) => b.bibliographyId),
      );
      const allById = new Map<string, Bibliography>();
      for (const b of [...topicBibliographies, ...courseBibliographies]) {
        allById.set(b.id, b);
      }
      const available = Array.from(allById.values()).filter((b) => !referencedIds.has(b.id));
      setModal({ kind: 'refBibliographyAssignment', assignment, available });
    } finally {
      setIsLoading(false);
    }
  };

  const openRefSessionAssignment = async (assignment: Assignment) => {
    setModal({ kind: 'refSessionAssignment', assignment, available: [] });
    setIsLoading(true);
    try {
      // Fetch session references already linked to this assignment from the API
      const linked = await getAssignmentReferences(assignment.id);
      const linkedIds = new Set(linked.map((r) => r.sessionId));
      const available = sessions.filter((s) => !linkedIds.has(s.id));
      setModal({ kind: 'refSessionAssignment', assignment, available });
    } catch {
      // Fallback to locally known data
      const referencedIds = new Set(
        (assignment.sessionReferences ?? assignment.references ?? []).map((s) => s.sessionId),
      );
      const available = sessions.filter((s) => !referencedIds.has(s.id));
      setModal({ kind: 'refSessionAssignment', assignment, available });
    } finally {
      setIsLoading(false);
    }
  };
  const openDeleteAssignmentSession = (assignment: Assignment, session: Session) =>
    setModal({ kind: 'deleteAssignmentSession', assignment, session });

  const openPublishNote = () => setModal({ kind: 'publishNote' });
  const openEditNote = (note: Note) => setModal({ kind: 'editNote', note });
  const openDeleteNote = (note: Note) => setModal({ kind: 'deleteNote', note });
  const openAiReviewNote = (note: Note) => setModal({ kind: 'aiReviewNote', note });
  const downloadNote = (note: Note) => {
    const url = note.currentVersion?.url;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ── Async actions ──────────────────────────────────────────────────────────

  const run = async (fn: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await fn();
      onRefresh();
      setModal({ kind: 'none' });
    } catch {
      // errors surface via formik.setStatus in form handlers
    } finally {
      setIsLoading(false);
    }
  };

  // ── Topic formik ───────────────────────────────────────────────────────────

  const topicFormik = useFormik<TopicFormValues>({
    initialValues: {
      title: modal.kind === 'editTopic' ? modal.topic.title : '',
      description: modal.kind === 'editTopic' ? (modal.topic.description ?? '') : '',
    },
    enableReinitialize: true,
    validationSchema: topicSchema,
    onSubmit: async (values, helpers) => {
      if (modal.kind !== 'editTopic') return;
      setIsLoading(true);
      try {
        await updateTopic(modal.topic.id, values);
        onRefresh();
        setModal({ kind: 'none' });
      } catch {
        helpers.setStatus('No se pudo actualizar el tema. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDeleteTopic = () =>
    run(async () => {
      if (modal.kind !== 'deleteTopic') return;
      await deleteTopic(modal.topic.id);
    });

  // ── Topic bibliography formik ──────────────────────────────────────────────

  const topicBibliographyFormik = useFormik<BibliographyFormValues>({
    initialValues: { title: '', bibliographyType: '', url: '', file: null },
    enableReinitialize: true,
    validationSchema: bibliographySchema,
    onSubmit: async (values, helpers) => {
      if (!values.bibliographyType) return;
      setIsLoading(true);
      try {
        await createTopicBibliographyService(topicId, {
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

  const handleDeleteTopicBibliography = () =>
    run(async () => {
      if (modal.kind !== 'deleteTopicBibliography') return;
      await deleteBibliography(modal.bibliography.id);
    });

  // ── Session formik ─────────────────────────────────────────────────────────

  const sessionFormik = useFormik<SessionFormValues>({
    initialValues: {
      title: modal.kind === 'editSession' ? modal.session.title : '',
      summary: modal.kind === 'editSession' ? modal.session.summary : '',
      contentMd: modal.kind === 'editSession' ? (modal.session.contentMd ?? '') : '',
    },
    enableReinitialize: true,
    validationSchema: sessionSchema,
    onSubmit: async (values, helpers) => {
      setIsLoading(true);
      try {
        if (modal.kind === 'createSession') {
          await createSession(topicId, { topicId, title: values.title, summary: values.summary, contentMd: values.contentMd ?? '' });
        } else if (modal.kind === 'editSession') {
          await updateSession(modal.session.id, values);
        }
        onRefresh();
        setModal({ kind: 'none' });
        helpers.resetForm();
      } catch {
        helpers.setStatus('No se pudo guardar la sesión. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDeleteSession = () =>
    run(async () => {
      if (modal.kind !== 'deleteSession') return;
      await deleteSession(modal.session.id);
    });

  // ── Assignment formik ──────────────────────────────────────────────────────

  const assignmentFormik = useFormik<AssignmentFormValues>({
    initialValues: {
      title: modal.kind === 'editAssignment' ? modal.assignment.title : '',
      description: modal.kind === 'editAssignment' ? modal.assignment.description : '',
      startDate:
        modal.kind === 'editAssignment' ? new Date(modal.assignment.startDate) : null,
      endDate:
        modal.kind === 'editAssignment' ? new Date(modal.assignment.endDate) : null,
      assignmentStatus:
        modal.kind === 'editAssignment' ? modal.assignment.assignmentStatus : 'DRAFT',
    },
    enableReinitialize: true,
    validationSchema: assignmentSchema,
    onSubmit: async (values, helpers) => {
      if (!values.startDate || !values.endDate) return;
      setIsLoading(true);
      try {
        const payload = {
          title: values.title,
          description: values.description,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
          assignmentStatus: values.assignmentStatus,
        };
        if (modal.kind === 'createAssignment') {
          await createAssignment(topicId, payload);
        } else if (modal.kind === 'editAssignment') {
          await updateAssignment(modal.assignment.id, payload);
        }
        onRefresh();
        setModal({ kind: 'none' });
        helpers.resetForm();
      } catch {
        helpers.setStatus('No se pudo guardar la tarea. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDeleteAssignment = () =>
    run(async () => {
      if (modal.kind !== 'deleteAssignment') return;
      await deleteAssignment(modal.assignment.id);
    });

  const assignmentBibliographyFormik = useFormik<BibliographyFormValues>({
    initialValues: { title: '', bibliographyType: '', url: '', file: null },
    enableReinitialize: true,
    validationSchema: bibliographySchema,
    onSubmit: async (values, helpers) => {
      if (modal.kind !== 'addAssignmentBibliography' || !values.bibliographyType) return;
      setIsLoading(true);
      try {
        await createAssignmentBibliographyService(modal.assignment.id, {
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

  const handleDeleteAssignmentBibliography = () =>
    run(async () => {
      if (modal.kind !== 'deleteAssignmentBibliography') return;
      await removeBibliographyFromAssignment(modal.assignment.id, modal.bibliography.id);
    });

  const handleRefBibliographies = async (ids: string[]) => {
    if (modal.kind !== 'refBibliographyAssignment') return;
    setIsLoading(true);
    try {
      await Promise.all(ids.map((id) => addBibliographyToAssignment(modal.assignment.id, id)));
      onRefresh();
      setModal({ kind: 'none' });
    } catch {
      // silently ignore — the modal itself has no formik status
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefSessions = async (ids: string[]) => {
    if (modal.kind !== 'refSessionAssignment') return;
    setIsLoading(true);
    try {
      await Promise.all(ids.map((id) => addSessionReference(modal.assignment.id, id)));
      onRefresh();
      setModal({ kind: 'none' });
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignmentSession = () =>
    run(async () => {
      if (modal.kind !== 'deleteAssignmentSession') return;
      await removeSessionReference(modal.assignment.id, modal.session.id);
    });

  // ── Note formik ────────────────────────────────────────────────────────────

  const noteFormik = useFormik<NoteUploadFormValues>({
    initialValues: { file: null },
    enableReinitialize: true,
    validationSchema: noteUploadSchema,
    onSubmit: async (values, helpers) => {
      if (!values.file) return;
      setIsLoading(true);
      try {
        if (modal.kind === 'publishNote') {
          await createNote(topicId, {
            url: '',
            mimeType: values.file.type,
          });
        } else if (modal.kind === 'editNote') {
          await updateNote(topicId, modal.note.documentId, {
            url: modal.note.currentVersion?.url ?? '',
            mimeType: values.file.type,
            file: values.file,
          });
        }
        onRefresh();
        setModal({ kind: 'none' });
        helpers.resetForm();
      } catch {
        helpers.setStatus('No se pudo guardar la nota. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDeleteNote = () =>
    run(async () => {
      if (modal.kind !== 'deleteNote') return;
      await deleteNote(topicId, modal.note.documentId);
    });

  const handleAiReviewNote = () =>
    run(async () => {
      if (modal.kind !== 'aiReviewNote') return;
      await createNoteReviewAI(topicId, modal.note.documentId);
    });

  return {
    modal,
    isLoading,
    closeModal,
    // Topic openers
    openEditTopic,
    openDeleteTopic,
    // Topic bibliography openers
    openAddTopicBibliography,
    openDeleteTopicBibliography,
    // Session openers
    openCreateSession,
    openEditSession,
    openDeleteSession,
    // Assignment openers
    openCreateAssignment,
    openEditAssignment,
    openDeleteAssignment,
    openAddAssignmentBibliography,
    openDeleteAssignmentBibliography,
    openRefBibliographyAssignment,
    openRefSessionAssignment,
    openDeleteAssignmentSession,
    // Note openers
    openPublishNote,
    openEditNote,
    openDeleteNote,
    openAiReviewNote,
    downloadNote,
    // Formiks
    topicFormik,
    topicBibliographyFormik,
    sessionFormik,
    assignmentFormik,
    assignmentBibliographyFormik,
    noteFormik,
    // Handlers
    handleDeleteTopic,
    handleDeleteTopicBibliography,
    handleDeleteSession,
    handleDeleteAssignment,
    handleDeleteAssignmentBibliography,
    handleRefBibliographies,
    handleRefSessions,
    handleDeleteAssignmentSession,
    handleDeleteNote,
    handleAiReviewNote,
  };
};

export type UseTopicActionsReturn = ReturnType<typeof useTopicActions>;

import { useEffect, useState } from 'react';
import { useFormik, type FormikProps } from 'formik';

import {
  createNoteReviewAI,
  createNoteReview,
  deleteNote,
  downloadNote,
  getNoteById,
  updateNote,
} from '../services/noteService';
import { deleteReview, getReviewsByDocument, updateReview } from '../services/reviewService';
import { getTopicById } from '../services/topicService';
import { getCourseParticipants } from '../services/courseService';

import { reviewSchema, type ReviewFormValues } from './schemas/reviewSchema';
import { noteUploadSchema, type NoteUploadFormValues } from './schemas/noteUploadSchema';

import type { Note } from '../services/models/noteModels';
import type { Participant } from '../services/models/courseModels';
import type { Review } from '../services/models/reviewModels';
import type { Topic } from '../services/models/topicModels';
import { useAuthStore } from '../store/authStore';

// ── Types ──────────────────────────────────────────────────────────────────────

type ConfirmKind =
  | 'none'
  | 'aiReview'
  | 'deleteNote'
  | 'deleteReview';

interface ConfirmState {
  kind: ConfirmKind;
  review?: Review;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const getNoteDocumentId = (note: Note): string =>
  note.document?.id ?? note.documentId;

const getNoteOwnerId = (note: Note): string | undefined =>
  note.document?.userId ??
  note.document?.ownerId ??
  note.document?.user?.id ??
  note.document?.owner?.id ??
  note.userId;

const getParticipantRole = (p: Participant) => p.ParticipantRole ?? p.participantRole;
const getParticipantUserId = (p: Participant) => p.userId ?? p.id ?? p.user?.id;
const getParticipantEmail = (p: Participant) => p.email ?? p.user?.email;

const instructorRoles = new Set(['OWNER', 'TEACHER', 'ASSISTANT']);

const isCourseInstructor = (
  participants: Participant[],
  currentUser: { id?: string; email?: string },
): boolean => {
  const uid = currentUser.id?.trim();
  const email = currentUser.email?.trim().toLowerCase();
  return participants.some((p) => {
    const role = getParticipantRole(p);
    if (!role || !instructorRoles.has(role)) return false;
    const pUid = getParticipantUserId(p)?.trim();
    if (uid && pUid && pUid === uid) return true;
    const pEmail = getParticipantEmail(p)?.trim().toLowerCase();
    return Boolean(email && pEmail && pEmail === email);
  });
};

// ── Return type ────────────────────────────────────────────────────────────────

export interface UseNoteDetailReturn {
  note: Note | null;
  topic: Topic | null;
  reviews: Review[];
  /** True when the current user is OWNER/TEACHER/ASSISTANT of the course — can create/edit/delete reviews */
  isInstructor: boolean;
  /** True when the current user is the document owner — can edit/delete the note */
  isNoteOwner: boolean;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
  actionError: string | null;
  // Edit note modal
  editNoteOpen: boolean;
  openEditNote: () => void;
  closeEditNote: () => void;
  editNoteFormik: FormikProps<NoteUploadFormValues>;
  // Confirm modal
  confirm: ConfirmState;
  closeConfirm: () => void;
  openConfirmDeleteNote: () => void;
  openConfirmAiReview: () => void;
  openConfirmDeleteReview: (review: Review) => void;
  runConfirm: () => Promise<void>;
  // Review create modal
  reviewModalOpen: boolean;
  openReviewModal: () => void;
  closeReviewModal: () => void;
  reviewFormik: FormikProps<ReviewFormValues>;
  // Review edit modal
  editReviewTarget: Review | null;
  openEditReview: (review: Review) => void;
  closeEditReview: () => void;
  editReviewFormik: FormikProps<ReviewFormValues>;
  // Actions
  download: () => Promise<void>;
  refetch: () => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useNoteDetail = (
  noteId?: string,
  topicId?: string,
  courseId?: string,
): UseNoteDetailReturn => {
  const currentUser = useAuthStore((state) => state.user);

  const [note, setNote] = useState<Note | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isNoteOwner, setIsNoteOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [fetchTick, setFetchTick] = useState(0);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [editNoteOpen, setEditNoteOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>({ kind: 'none' });
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editReviewTarget, setEditReviewTarget] = useState<Review | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!noteId || !topicId) return;

    let cancelled = false;

    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [noteResponse, topicResponse, participants] = await Promise.all([
          getNoteById(topicId, noteId),
          getTopicById(topicId),
          courseId ? getCourseParticipants(courseId).catch(() => []) : Promise.resolve([]),
        ]);

        const documentId = noteResponse.document?.id ?? noteResponse.documentId;
        const reviewsResponse = await getReviewsByDocument(documentId).catch(() => []);

        if (cancelled) return;

        // Instructor = OWNER/TEACHER/ASSISTANT in the course
        setIsInstructor(isCourseInstructor(participants, currentUser));

        // Note owner = the user who uploaded the document
        const ownerId = getNoteOwnerId(noteResponse)?.trim();
        const uid = currentUser?.id?.trim();
        setIsNoteOwner(Boolean(uid && ownerId && uid === ownerId));

        setNote(noteResponse);
        setTopic(topicResponse);
        setReviews(reviewsResponse);
      } catch {
        if (!cancelled) setError('No se pudo cargar el detalle del apunte.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAll();

    return () => { cancelled = true; };
  }, [noteId, topicId, courseId, currentUser, fetchTick]);

  // ── Action runner ──────────────────────────────────────────────────────────
  const runAction = async (action: () => Promise<void>) => {
    setIsActionLoading(true);
    setActionError(null);
    try {
      await action();
      setFetchTick((t) => t + 1);
    } catch {
      setActionError('No se pudo completar la acción solicitada.');
    } finally {
      setIsActionLoading(false);
    }
  };

  // ── Confirm modal ──────────────────────────────────────────────────────────
  const closeConfirm = () => setConfirm({ kind: 'none' });

  const runConfirm = async () => {
    if (confirm.kind === 'none' || !noteId || !topicId) return;

    await runAction(async () => {
      switch (confirm.kind) {
        case 'deleteNote':
          await deleteNote(topicId, noteId);
          break;
        case 'aiReview':
          await createNoteReviewAI(topicId, noteId);
          break;
        case 'deleteReview':
          if (confirm.review) {
            await deleteReview(confirm.review.id);
          }
          break;
      }
    });

    closeConfirm();
  };

  // ── Edit note formik ───────────────────────────────────────────────────────
  const closeEditNote = () => setEditNoteOpen(false);

  const editNoteFormik = useFormik<NoteUploadFormValues>({
    initialValues: { file: null },
    enableReinitialize: true,
    validationSchema: noteUploadSchema,
    onSubmit: async (values, helpers) => {
      if (!noteId || !topicId || !values.file || !note) return;
      setIsActionLoading(true);
      setActionError(null);
      try {
        await updateNote(topicId, getNoteDocumentId(note), {
          url: note.currentVersion?.url ?? '',
          mimeType: values.file.type,
          file: values.file,
        });
        helpers.resetForm();
        closeEditNote();
        setFetchTick((t) => t + 1);
      } catch {
        helpers.setStatus('No se pudo actualizar el apunte. Intenta de nuevo.');
      } finally {
        setIsActionLoading(false);
      }
    },
  });

  // ── Review create formik ───────────────────────────────────────────────────
  const closeReviewModal = () => setReviewModalOpen(false);

  const reviewFormik = useFormik<ReviewFormValues>({
    initialValues: { score: 50, comment: '' },
    enableReinitialize: true,
    validationSchema: reviewSchema,
    onSubmit: async (values, helpers) => {
      if (!noteId || !topicId) return;
      setIsActionLoading(true);
      try {
        await createNoteReview(topicId, noteId, {
          reviewType: 'TEACHER',
          score: values.score,
          comment: values.comment,
        });
        helpers.resetForm();
        closeReviewModal();
        setFetchTick((t) => t + 1);
      } catch {
        helpers.setStatus('No se pudo publicar la revisión. Intenta de nuevo.');
      } finally {
        setIsActionLoading(false);
      }
    },
  });

  // ── Review edit formik ─────────────────────────────────────────────────────
  const closeEditReview = () => setEditReviewTarget(null);

  const editReviewFormik = useFormik<ReviewFormValues>({
    initialValues: {
      score: editReviewTarget?.score ?? 50,
      comment: editReviewTarget?.comment ?? '',
    },
    enableReinitialize: true,
    validationSchema: reviewSchema,
    onSubmit: async (values, helpers) => {
      if (!editReviewTarget) return;
      setIsActionLoading(true);
      try {
        await updateReview(editReviewTarget.id, { score: values.score, comment: values.comment });
        helpers.resetForm();
        closeEditReview();
        setFetchTick((t) => t + 1);
      } catch {
        helpers.setStatus('No se pudo actualizar la revisión. Intenta de nuevo.');
      } finally {
        setIsActionLoading(false);
      }
    },
  });

  return {
    note,
    topic,
    reviews,
    isInstructor,
    isNoteOwner,
    isLoading,
    isActionLoading,
    error: noteId ? error : 'No se encontró el apunte solicitado.',
    actionError,
    // Edit note modal
    editNoteOpen,
    openEditNote: () => setEditNoteOpen(true),
    closeEditNote,
    editNoteFormik,
    // Confirm modal
    confirm,
    closeConfirm,
    openConfirmDeleteNote: () => setConfirm({ kind: 'deleteNote' }),
    openConfirmAiReview: () => setConfirm({ kind: 'aiReview' }),
    openConfirmDeleteReview: (review) => setConfirm({ kind: 'deleteReview', review }),
    runConfirm,
    // Review create modal
    reviewModalOpen,
    openReviewModal: () => setReviewModalOpen(true),
    closeReviewModal,
    reviewFormik,
    // Review edit modal
    editReviewTarget,
    openEditReview: (review) => setEditReviewTarget(review),
    closeEditReview,
    editReviewFormik,
    // Actions
    download: async () => {
      if (!note) return;
      await runAction(() => downloadNote(getNoteDocumentId(note)));
    },
    refetch: () => setFetchTick((t) => t + 1),
  };
};

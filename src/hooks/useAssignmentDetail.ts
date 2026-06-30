import { useEffect, useMemo, useState } from 'react';
import { useFormik, type FormikProps } from 'formik';

import {
  addBibliographyToAssignment,
  addSessionReference,
  createAssignmentBibliography,
  createSubmission,
  createSubmissionReview,
  createSubmissionReviewAI,
  deleteAssignment,
  deleteSubmission,
  downloadSubmission,
  getAssignmentBibliographies,
  getAssignmentById,
  getAssignmentReferences,
  getAssignmentSubmissions,
  getSubmissionById,
  removeBibliographyFromAssignment,
  removeSessionReference,
  updateAssignment,
  updateSubmission,
} from '../services/assignmentService';

import { noteUploadSchema, type NoteUploadFormValues } from './schemas/noteUploadSchema';
import { bibliographySchema, type BibliographyFormValues } from './schemas/bibliographySchema';
import { assignmentSchema, type AssignmentFormValues } from './schemas/assignmentSchema';
import { reviewSchema, type ReviewFormValues } from './schemas/reviewSchema';

import {
  getCourseBibliographies,
  getCourseParticipants,
} from '../services/courseService';
import { getTopicBibliographies, getTopicSessions } from '../services/topicService';
import { deleteReview, getReviewsByDocument, updateReview } from '../services/reviewService';

import type { Assignment, AssignmentSessionReference } from '../services/models/assignmentModels';
import type { Bibliography } from '../services/models/bibliographyModels';
import type { Participant } from '../services/models/courseModels';
import type { Review } from '../services/models/reviewModels';
import type { Session } from '../services/models/sessionModels';
import type { Submission } from '../services/models/submissionModels';
import { useAuthStore } from '../store/authStore';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SubmissionWithReviews {
  submission: Submission;
  reviews: Review[];
}

type ConfirmKind =
  | 'none'
  | 'deleteSubmission'
  | 'aiReview'
  | 'deleteAssignment'
  | 'deleteBibliography'
  | 'deleteSession';

interface ConfirmState {
  kind: ConfirmKind;
  submission?: Submission;
  bibliography?: Bibliography;
  sessionRef?: AssignmentSessionReference;
}
// ── Helpers ────────────────────────────────────────────────────────────────────

const getSubmissionDocumentId = (submission: Submission) =>
  submission.document?.id ?? submission.documentId ?? submission.currentVersion?.documentId ?? submission.id;

const getSubmissionVersion = (submission: Submission) => submission.currentVersion?.version ?? 1;

const getReviewsForDocument = async (documentId: string): Promise<Review[]> => {
  try {
    return await getReviewsByDocument(documentId);
  } catch {
    return [];
  }
};

const hydrateSubmission = async (assignmentId: string, submission: Submission): Promise<Submission> => {
  try {
    return await getSubmissionById(assignmentId, getSubmissionDocumentId(submission));
  } catch {
    return submission;
  }
};

const getParticipantRole = (participant: Participant) =>
  participant.ParticipantRole ?? participant.participantRole;

const getParticipantUserId = (participant: Participant) =>
  participant.userId ?? participant.id ?? participant.user?.id;

const getParticipantEmail = (participant: Participant) =>
  participant.email ?? participant.user?.email;

const isCourseInstructor = (participants: Participant[], currentUser: { id?: string; email?: string }) => {
  const currentUserId = currentUser.id?.trim();
  const currentUserEmail = currentUser.email?.trim().toLowerCase();
  const instructorRoles = new Set(['OWNER', 'TEACHER', 'ASSISTANT']);

  return participants.some((participant) => {
    const role = getParticipantRole(participant);
    if (!role || !instructorRoles.has(role)) return false;

    const participantUserId = getParticipantUserId(participant)?.trim();
    if (currentUserId && participantUserId && participantUserId === currentUserId) return true;

    const participantEmail = getParticipantEmail(participant)?.trim().toLowerCase();
    return Boolean(currentUserEmail && participantEmail && participantEmail === currentUserEmail);
  });
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
};

// ── Return type ────────────────────────────────────────────────────────────────

export interface UseAssignmentDetailReturn {
  assignment: Assignment | null;
  submissions: SubmissionWithReviews[];
  studentSubmission: SubmissionWithReviews | null;
  linkedBibliographies: Bibliography[];
  linkedSessions: AssignmentSessionReference[];
  /** Bibliographies from topic + course not yet linked — for the "reference existing" modal */
  availableBibliographies: Bibliography[];
  /** Sessions from topic not yet linked — for the "reference session" modal */
  availableSessions: Session[];
  isOwner: boolean;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
  actionError: string | null;
  hasStudentSubmission: boolean;
  // Upload modal
  uploadModalMode: 'closed' | 'create' | 'edit';
  submissionFormik: FormikProps<NoteUploadFormValues>;
  openCreateSubmission: () => void;
  openEditSubmission: () => void;
  closeUploadModal: () => void;
  // Confirm modal
  confirm: ConfirmState;
  closeConfirm: () => void;
  openConfirmDeleteSubmission: (submission: Submission) => void;
  openConfirmAiReview: () => void;
  openConfirmDeleteAssignment: () => void;
  openConfirmDeleteBibliography: (bibliography: Bibliography) => void;
  openConfirmDeleteSession: (ref: AssignmentSessionReference) => void;
  runConfirm: () => Promise<void>;
  // Edit assignment modal
  editAssignmentOpen: boolean;
  openEditAssignment: () => void;
  closeEditAssignment: () => void;
  assignmentFormik: FormikProps<AssignmentFormValues>;
  // Bibliography modals
  addBibliographyOpen: boolean;
  openAddBibliography: () => void;
  closeAddBibliography: () => void;
  bibliographyFormik: FormikProps<BibliographyFormValues>;
  refBibliographyOpen: boolean;
  openRefBibliography: () => void;
  closeRefBibliography: () => void;
  handleRefBibliographies: (ids: string[]) => Promise<void>;
  // Session reference modal
  refSessionOpen: boolean;
  openRefSession: () => void;
  closeRefSession: () => void;
  handleRefSessions: (ids: string[]) => Promise<void>;
  // Review form modal (create)
  reviewModalSubmission: Submission | null;
  openReviewModal: (submission: Submission) => void;
  closeReviewModal: () => void;
  reviewFormik: FormikProps<ReviewFormValues>;
  // Review edit modal
  editReviewTarget: Review | null;
  openEditReview: (review: Review) => void;
  closeEditReview: () => void;
  editReviewFormik: FormikProps<ReviewFormValues>;
  // Owner per-submission AI review confirm
  openConfirmOwnerAiReview: (submission: Submission) => void;
  // Actions
  removeSubmission: (submission: Submission) => Promise<void>;
  removeReview: (review: Review) => Promise<void>;
  download: (submission: Submission) => Promise<void>;
  refetch: () => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useAssignmentDetail = (
  assignmentId?: string,
  courseId?: string,
  topicId?: string,
): UseAssignmentDetailReturn => {
  const currentUser = useAuthStore((state) => state.user);

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionWithReviews[]>([]);
  const [linkedBibliographies, setLinkedBibliographies] = useState<Bibliography[]>([]);
  const [linkedSessions, setLinkedSessions] = useState<AssignmentSessionReference[]>([]);
  const [topicBibliographies, setTopicBibliographies] = useState<Bibliography[]>([]);
  const [courseBibliographies, setCourseBibliographies] = useState<Bibliography[]>([]);
  const [topicSessions, setTopicSessions] = useState<Session[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [fetchTick, setFetchTick] = useState(0);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [uploadModalMode, setUploadModalMode] = useState<'closed' | 'create' | 'edit'>('closed');
  const [confirm, setConfirm] = useState<ConfirmState>({ kind: 'none' });
  const [editAssignmentOpen, setEditAssignmentOpen] = useState(false);
  const [addBibliographyOpen, setAddBibliographyOpen] = useState(false);
  const [refBibliographyOpen, setRefBibliographyOpen] = useState(false);
  const [refSessionOpen, setRefSessionOpen] = useState(false);
  const [reviewModalSubmission, setReviewModalSubmission] = useState<Submission | null>(null);
  const [editReviewTarget, setEditReviewTarget] = useState<Review | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!assignmentId) return;

    let cancelled = false;

    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [
          assignmentResponse,
          submissionsResponse,
          linkedBibsResponse,
          linkedSessionsResponse,
          participants,
        ] = await Promise.all([
          getAssignmentById(assignmentId),
          getAssignmentSubmissions(assignmentId),
          getAssignmentBibliographies(assignmentId),
          getAssignmentReferences(assignmentId),
          courseId ? getCourseParticipants(courseId) : Promise.resolve([]),
        ]);

        // Fetch topic/course pools for reference modals (best-effort)
        const resolvedTopicId = topicId ?? assignmentResponse.topicId;
        const [topicBibs, courseBibs, topicSess] = await Promise.all([
          resolvedTopicId ? getTopicBibliographies(resolvedTopicId).catch(() => []) : Promise.resolve([]),
          courseId ? getCourseBibliographies(courseId).catch(() => []) : Promise.resolve([]),
          resolvedTopicId ? getTopicSessions(resolvedTopicId).catch(() => []) : Promise.resolve([]),
        ]);

        // Hydrate each submission, then fetch its reviews by documentId
        const hydratedSubmissions = await Promise.all(
          submissionsResponse.map((s) => hydrateSubmission(assignmentId, s)),
        );

        const submissionsWithReviews: SubmissionWithReviews[] = await Promise.all(
          hydratedSubmissions.map(async (submission) => {
            const documentId = getSubmissionDocumentId(submission);
            const reviews = await getReviewsForDocument(documentId);
            return { submission, reviews };
          }),
        );

        if (cancelled) return;

        setAssignment(assignmentResponse);
        setSubmissions(submissionsWithReviews);
        setLinkedBibliographies(linkedBibsResponse);
        setLinkedSessions(linkedSessionsResponse);
        setTopicBibliographies(topicBibs);
        setCourseBibliographies(courseBibs);
        setTopicSessions(topicSess);
        setIsOwner(isCourseInstructor(participants, currentUser));
      } catch {
        if (!cancelled) setError('No se pudo cargar el detalle de la tarea.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAll();

    return () => { cancelled = true; };
  }, [assignmentId, courseId, currentUser, fetchTick, topicId]);

  const studentSubmission = useMemo(() => submissions[0] ?? null, [submissions]);

  // Available pools (exclude already linked)
  const availableBibliographies = useMemo(() => {
    const linkedIds = new Set(linkedBibliographies.map((b) => b.id));
    const all = new Map<string, Bibliography>();
    for (const b of [...topicBibliographies, ...courseBibliographies]) all.set(b.id, b);
    return Array.from(all.values()).filter((b) => !linkedIds.has(b.id));
  }, [linkedBibliographies, topicBibliographies, courseBibliographies]);

  const availableSessions = useMemo(() => {
    const linkedIds = new Set(linkedSessions.map((s) => s.sessionId));
    return topicSessions.filter((s) => !linkedIds.has(s.id));
  }, [linkedSessions, topicSessions]);

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
    if (confirm.kind === 'none' || !assignmentId) return;

    await runAction(async () => {
      switch (confirm.kind) {
        case 'deleteSubmission':
          if (confirm.submission) {
            await deleteSubmission(assignmentId, getSubmissionDocumentId(confirm.submission));
          }
          break;
        case 'aiReview':
          // student uses studentSubmission; owner passes a specific submission via confirm.submission
          {
            const target = confirm.submission ?? studentSubmission?.submission;
            if (target) {
              await createSubmissionReviewAI(assignmentId, getSubmissionDocumentId(target));
            }
          }
          break;
        case 'deleteAssignment':
          await deleteAssignment(assignmentId);
          break;
        case 'deleteBibliography':
          if (confirm.bibliography) {
            await removeBibliographyFromAssignment(assignmentId, confirm.bibliography.id);
          }
          break;
        case 'deleteSession':
          if (confirm.sessionRef) {
            await removeSessionReference(assignmentId, confirm.sessionRef.sessionId);
          }
          break;
      }
    });

    closeConfirm();
  };

  // ── Submission formik ──────────────────────────────────────────────────────
  const closeUploadModal = () => setUploadModalMode('closed');

  const submissionFormik = useFormik<NoteUploadFormValues>({
    initialValues: { file: null },
    enableReinitialize: true,
    validationSchema: noteUploadSchema,
    onSubmit: async (values, helpers) => {
      if (!assignmentId || !values.file) return;
      setIsActionLoading(true);
      setActionError(null);
      try {
        if (uploadModalMode === 'create') {
          await createSubmission(assignmentId, { url: '', mimeType: values.file.type, file: values.file });
        } else if (uploadModalMode === 'edit' && studentSubmission) {
          await updateSubmission(
            assignmentId,
            getSubmissionDocumentId(studentSubmission.submission),
            { url: studentSubmission.submission.currentVersion?.url ?? '', mimeType: values.file.type, file: values.file },
          );
        }
        helpers.resetForm();
        closeUploadModal();
        setFetchTick((t) => t + 1);
      } catch {
        helpers.setStatus('No se pudo guardar la entrega. Intenta de nuevo.');
      } finally {
        setIsActionLoading(false);
      }
    },
  });

  // ── Assignment edit formik ─────────────────────────────────────────────────
  const assignmentFormik = useFormik<AssignmentFormValues>({
    initialValues: {
      title: assignment?.title ?? '',
      description: assignment?.description ?? '',
      startDate: assignment ? new Date(assignment.startDate) : null,
      endDate: assignment ? new Date(assignment.endDate) : null,
      assignmentStatus: assignment?.assignmentStatus ?? 'DRAFT',
    },
    enableReinitialize: true,
    validationSchema: assignmentSchema,
    onSubmit: async (values, helpers) => {
      if (!assignmentId || !values.startDate || !values.endDate) return;
      setIsActionLoading(true);
      try {
        await updateAssignment(assignmentId, {
          title: values.title,
          description: values.description,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
          assignmentStatus: values.assignmentStatus,
        });
        setFetchTick((t) => t + 1);
        setEditAssignmentOpen(false);
      } catch {
        helpers.setStatus('No se pudo actualizar la tarea. Intenta de nuevo.');
      } finally {
        setIsActionLoading(false);
      }
    },
  });

  // ── Bibliography formik ────────────────────────────────────────────────────
  const bibliographyFormik = useFormik<BibliographyFormValues>({
    initialValues: { title: '', bibliographyType: '', url: '', file: null },
    enableReinitialize: true,
    validationSchema: bibliographySchema,
    onSubmit: async (values, helpers) => {
      if (!assignmentId || !values.bibliographyType) return;
      setIsActionLoading(true);
      try {
        await createAssignmentBibliography(assignmentId, {
          title: values.title,
          bibliographyType: values.bibliographyType,
          url: values.url,
          mimeType: values.file ? values.file.type : 'text/html',
          file: values.file ?? undefined,
        });
        helpers.resetForm();
        setAddBibliographyOpen(false);
        setFetchTick((t) => t + 1);
      } catch {
        helpers.setStatus('No se pudo publicar la bibliografía. Intenta de nuevo.');
      } finally {
        setIsActionLoading(false);
      }
    },
  });

  const handleRefBibliographies = async (ids: string[]) => {
    if (!assignmentId) return;
    await runAction(async () => {
      await Promise.all(ids.map((id) => addBibliographyToAssignment(assignmentId, id)));
    });
    setRefBibliographyOpen(false);
  };

  const handleRefSessions = async (ids: string[]) => {
    if (!assignmentId) return;
    await runAction(async () => {
      await Promise.all(ids.map((id) => addSessionReference(assignmentId, id)));
    });
    setRefSessionOpen(false);
  };

  // ── Review create formik ──────────────────────────────────────────────────
  const closeReviewModal = () => setReviewModalSubmission(null);

  const reviewFormik = useFormik<ReviewFormValues>({
    initialValues: { score: 50, comment: '' },
    enableReinitialize: true,
    validationSchema: reviewSchema,
    onSubmit: async (values, helpers) => {
      if (!assignmentId || !reviewModalSubmission) return;
      setIsActionLoading(true);
      try {
        await createSubmissionReview(assignmentId, getSubmissionDocumentId(reviewModalSubmission), {
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
    assignment,
    submissions,
    studentSubmission,
    linkedBibliographies,
    linkedSessions,
    availableBibliographies,
    availableSessions,
    isOwner,
    isLoading,
    isActionLoading,
    error: assignmentId ? error : 'No se encontró la tarea solicitada.',
    actionError,
    hasStudentSubmission: Boolean(studentSubmission),
    // Upload modal
    uploadModalMode,
    submissionFormik,
    openCreateSubmission: () => setUploadModalMode('create'),
    openEditSubmission: () => setUploadModalMode('edit'),
    closeUploadModal,
    // Confirm modal
    confirm,
    closeConfirm,
    openConfirmDeleteSubmission: (submission) => setConfirm({ kind: 'deleteSubmission', submission }),
    openConfirmAiReview: () => setConfirm({ kind: 'aiReview' }),
    openConfirmDeleteAssignment: () => setConfirm({ kind: 'deleteAssignment' }),
    openConfirmDeleteBibliography: (bibliography) => setConfirm({ kind: 'deleteBibliography', bibliography }),
    openConfirmDeleteSession: (sessionRef) => setConfirm({ kind: 'deleteSession', sessionRef }),
    runConfirm,
    // Edit assignment
    editAssignmentOpen,
    openEditAssignment: () => setEditAssignmentOpen(true),
    closeEditAssignment: () => setEditAssignmentOpen(false),
    assignmentFormik,
    // Bibliography
    addBibliographyOpen,
    openAddBibliography: () => setAddBibliographyOpen(true),
    closeAddBibliography: () => setAddBibliographyOpen(false),
    bibliographyFormik,
    refBibliographyOpen,
    openRefBibliography: () => setRefBibliographyOpen(true),
    closeRefBibliography: () => setRefBibliographyOpen(false),
    handleRefBibliographies,
    // Session reference
    refSessionOpen,
    openRefSession: () => setRefSessionOpen(true),
    closeRefSession: () => setRefSessionOpen(false),
    handleRefSessions,
    // Review
    reviewModalSubmission,
    openReviewModal: (submission) => setReviewModalSubmission(submission),
    closeReviewModal,
    reviewFormik,
    editReviewTarget,
    openEditReview: (review) => setEditReviewTarget(review),
    closeEditReview,
    editReviewFormik,
    openConfirmOwnerAiReview: (submission) =>
      setConfirm({ kind: 'aiReview', submission }),
    // Actions
    removeSubmission: async (submission) => {
      if (!assignmentId) return;
      await runAction(() => deleteSubmission(assignmentId, getSubmissionDocumentId(submission)));
    },
    removeReview: async (review) => {
      await runAction(() => deleteReview(review.id));
    },
    download: async (submission) => {
      await runAction(async () => {
        const blob = await downloadSubmission(getSubmissionDocumentId(submission));
        downloadBlob(blob, `entrega-${getSubmissionVersion(submission)}`);
      });
    },
    refetch: () => setFetchTick((t) => t + 1),
  };
};

import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LinkIcon from '@mui/icons-material/Link';
import RateReviewIcon from '@mui/icons-material/RateReview';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';

import ActionMenuButton, { type ActionMenuItem } from '../../components/common/ActionMenuButton';
import ConfirmModal from '../../components/common/ConfirmModal';
import NoteUploadModal from '../../components/notes/NoteUploadModal';
import AssignmentFormModal from '../../components/assignments/AssignmentFormModal';
import ReferenceBibliographyModal from '../../components/assignments/ReferenceBibliographyModal';
import ReferenceSessionModal from '../../components/assignments/ReferenceSessionModal';
import BibliographyFormModal from '../../components/bibliography/BibliographyFormModal';
import ReviewFormModal from '../../components/reviews/ReviewFormModal';
import { useAssignmentDetail } from '../../hooks/useAssignmentDetail';
import type { AssignmentStatus } from '../../services/models/assignmentModels';
import type { Review } from '../../services/models/reviewModels';
import type { Submission } from '../../services/models/submissionModels';

// ── Helpers ────────────────────────────────────────────────────────────────────

const statusLabel: Record<AssignmentStatus, string> = {
  DRAFT: 'Borrador',
  ACTIVE: 'Activa',
  CLOSED: 'Cerrada',
};

const statusColor: Record<AssignmentStatus, 'default' | 'success' | 'warning'> = {
  DRAFT: 'default',
  ACTIVE: 'success',
  CLOSED: 'warning',
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

// ── AI review staleness helpers ───────────────────────────────────────────────

/** Returns the AI review for a set of reviews, or null if none exists. */
const getAiReview = (reviews: Review[]): Review | null =>
  reviews.find((r) => r.reviewType === 'AI') ?? null;

/**
 * Returns true when the submission has been updated after the AI review was
 * created — meaning the review is stale and a new one can be requested.
 */
const isAiReviewStale = (submission: Submission, aiReview: Review): boolean =>
  new Date(submission.updatedAt ?? submission.currentVersion?.updatedAt ?? 0) >
  new Date(aiReview.createdAt);

const getReviewTypeLabel = (review: Review, stale: boolean) => {
  if (review.reviewType === 'AI') return stale ? 'IA — DESACTUALIZADO' : 'IA';
  return 'Humano';
};

const formatOptionalDate = (value?: string) => (value ? formatDate(value) : 'Sin fecha');

// ── Sub-components ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
}

const MetricCard = ({ label, value }: MetricCardProps) => (
  <Card variant="outlined" sx={{ borderRadius: 1, minWidth: 160 }}>
    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

interface ReviewListProps {
  reviews: Review[];
  submission?: Submission;
  isOwner?: boolean;
  onDeleteReview?: (review: Review) => void;
  onEditReview?: (review: Review) => void;
}

const ReviewList = ({ reviews, submission, isOwner = false, onDeleteReview, onEditReview }: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Todavía no hay revisiones registradas.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.25}>
      {reviews.map((review, index) => {
        const stale =
          review.reviewType === 'AI' && submission
            ? isAiReviewStale(submission, review)
            : false;

        const menuItems: ActionMenuItem[] =
          isOwner && review.reviewType === 'TEACHER'
            ? [
                {
                  label: 'Editar revisión',
                  icon: <EditIcon fontSize="small" />,
                  onClick: () => onEditReview?.(review),
                },
                {
                  label: 'Eliminar revisión',
                  icon: <DeleteIcon fontSize="small" />,
                  danger: true,
                  dividerBefore: true,
                  onClick: () => onDeleteReview?.(review),
                },
              ]
            : [];

        return (
          <Card key={`review-${review.id ?? review.documentId ?? index}`} variant="outlined" sx={{ borderRadius: 1 }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ alignItems: 'flex-start', display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    label={getReviewTypeLabel(review, stale)}
                    color={review.reviewType === 'AI' ? (stale ? 'warning' : 'info') : 'primary'}
                  />
                  <Chip size="small" label={`Score: ${review.score}`} variant="outlined" />
                </Stack>
                {menuItems.length > 0 && (
                  <ActionMenuButton label="Opciones de revisión" items={menuItems} />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {review.comment || 'Sin comentario.'}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

const getShortId = (value?: string) => value?.slice(0, 3) ?? '---';

const getSubmissionDocumentId = (submission: Submission) =>
  submission.document?.id ??
  submission.documentId ??
  submission.currentVersion?.documentId ??
  submission.id;

const getSubmissionDocumentUserId = (submission: Submission) =>
  submission.document?.userId ??
  submission.document?.ownerId ??
  submission.document?.user?.id ??
  submission.document?.owner?.id;

const getSubmissionDisplayTitle = (assignmentTitle: string, submission: Submission) =>
  `${assignmentTitle}-${getShortId(getSubmissionDocumentUserId(submission))}-${getShortId(getSubmissionDocumentId(submission))}`;

interface SubmissionSummaryProps {
  assignmentTitle: string;
  submission: Submission;
}

const SubmissionSummary = ({ assignmentTitle, submission }: SubmissionSummaryProps) => (
  <Stack spacing={0.5}>
    <Typography variant="body2" sx={{ fontWeight: 700 }}>
      {getSubmissionDisplayTitle(assignmentTitle, submission)}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {submission.currentVersion?.mimeType ?? 'Archivo de entrega'}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      Actualizada el {formatOptionalDate(submission.updatedAt ?? submission.currentVersion?.updatedAt)}
    </Typography>
  </Stack>
);

// ── Page ───────────────────────────────────────────────────────────────────────

const AssignmentDetailPage = () => {
  const { courseId, topicId, taskId } = useParams();
  const detail = useAssignmentDetail(taskId, courseId, topicId);

  if (detail.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (detail.error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {detail.error}
      </Alert>
    );
  }

  if (!detail.assignment) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No se encontró la tarea solicitada.
      </Alert>
    );
  }

  const assignment = detail.assignment;

  // ── Owner action menu for the description card ─────────────────────────────
  const ownerAssignmentMenuItems: ActionMenuItem[] = [
    { label: 'Editar tarea', icon: <EditIcon fontSize="small" />, onClick: detail.openEditAssignment },
    {
      label: 'Eliminar tarea',
      icon: <DeleteIcon fontSize="small" />,
      danger: true,
      onClick: detail.openConfirmDeleteAssignment,
    },
    {
      label: 'Agregar bibliografía',
      icon: <LibraryBooksIcon fontSize="small" />,
      dividerBefore: true,
      onClick: detail.openAddBibliography,
    },
    {
      label: 'Referenciar bibliografía existente',
      icon: <LinkIcon fontSize="small" />,
      onClick: detail.openRefBibliography,
    },
    {
      label: 'Referenciar sesión',
      icon: <LinkIcon fontSize="small" />,
      onClick: detail.openRefSession,
    },
  ];

  // ── Student submission menu ────────────────────────────────────────────────
  const studentSubmissionMenuItems: ActionMenuItem[] = detail.studentSubmission
    ? [
        {
          label: 'Actualizar entrega',
          icon: <EditIcon fontSize="small" />,
          onClick: detail.openEditSubmission,
        },
        {
          label: 'Borrar entrega',
          icon: <DeleteIcon fontSize="small" />,
          danger: true,
          onClick: () =>
            detail.openConfirmDeleteSubmission(detail.studentSubmission!.submission),
        },
      ]
    : [];

  return (
    <>
      <Box sx={{ pb: 4 }}>
        {detail.actionError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {detail.actionError}
          </Alert>
        )}

        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              lg: detail.isOwner ? '1fr' : 'minmax(0, 1fr) 360px',
            },
          }}
        >
          {/* ── Description card ────────────────────────────────────────── */}
          <Card variant="outlined" sx={{ borderRadius: 1 }}>
            <CardContent>
              <Box
                sx={{
                  alignItems: 'flex-start',
                  display: 'flex',
                  gap: 1,
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {assignment.title}
                </Typography>
                {detail.isOwner && (
                  <ActionMenuButton
                    label="Opciones de la tarea"
                    items={ownerAssignmentMenuItems}
                  />
                )}
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {assignment.description}
              </Typography>

              <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', mt: 2.5 }}>
                <MetricCard label="Inicio" value={formatDate(assignment.startDate)} />
                <MetricCard label="Fin" value={formatDate(assignment.endDate)} />
                <MetricCard
                  label="Estatus"
                  value={statusLabel[assignment.assignmentStatus]}
                />
              </Stack>

              {/* ── Linked bibliographies ──────────────────────────────── */}
              {detail.linkedBibliographies.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                    Bibliografía referenciada
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                    {detail.linkedBibliographies.map((bib, index) => (
                      <Chip
                        key={`assignment-bibliography-${bib.id ?? index}`}
                        label={bib.title}
                        size="small"
                        variant="outlined"
                        color="primary"
                        onDelete={
                          detail.isOwner
                            ? () => detail.openConfirmDeleteBibliography(bib)
                            : undefined
                        }
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* ── Linked sessions ────────────────────────────────────── */}
              {detail.linkedSessions.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                    Sesiones referenciadas
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                    {detail.linkedSessions.map((ref, index) => (
                      <Chip
                        key={`assignment-session-${ref.sessionId ?? index}`}
                        label={ref.title ?? getShortId(ref.sessionId)}
                        size="small"
                        variant="outlined"
                        color="success"
                        onDelete={
                          detail.isOwner
                            ? () => detail.openConfirmDeleteSession(ref)
                            : undefined
                        }
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Box sx={{ mt: 2 }}>
                <Chip
                  size="small"
                  label={statusLabel[assignment.assignmentStatus]}
                  color={statusColor[assignment.assignmentStatus]}
                />
              </Box>
            </CardContent>
          </Card>

          {/* ── Student panel ──────────────────────────────────────────── */}
          {!detail.isOwner && (
            <Stack spacing={2}>
              <Card variant="outlined" sx={{ borderRadius: 1 }}>
                <CardContent>
                  <Box
                    sx={{
                      alignItems: 'flex-start',
                      display: 'flex',
                      gap: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Entrega
                    </Typography>
                    <ActionMenuButton
                      label="Opciones de entrega"
                      items={studentSubmissionMenuItems}
                    />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  {detail.studentSubmission ? (
                    <SubmissionSummary
                      assignmentTitle={assignment.title}
                      submission={detail.studentSubmission.submission}
                    />
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      fullWidth
                      onClick={detail.openCreateSubmission}
                    >
                      Agregar entrega
                    </Button>
                  )}

                  {/* Student AI review button — disabled when up-to-date AI review exists */}
                  {(() => {
                    const studentAiReview = getAiReview(detail.studentSubmission?.reviews ?? []);
                    const studentSub = detail.studentSubmission?.submission;
                    const studentAiStale =
                      studentAiReview && studentSub
                        ? isAiReviewStale(studentSub, studentAiReview)
                        : false;
                    const studentAiDisabled =
                      !detail.hasStudentSubmission ||
                      detail.isActionLoading ||
                      (studentAiReview !== null && !studentAiStale);

                    return (
                      <Button
                        variant="outlined"
                        startIcon={<AutoFixHighIcon />}
                        disabled={studentAiDisabled}
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={detail.openConfirmAiReview}
                      >
                        Solicitar revisión por IA
                      </Button>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                    Revisiones
                  </Typography>
                  <ReviewList
                    reviews={detail.studentSubmission?.reviews ?? []}
                    submission={detail.studentSubmission?.submission}
                  />
                </CardContent>
              </Card>
            </Stack>
          )}
        </Box>

        {/* ── Owner submissions list ─────────────────────────────────────── */}
        {detail.isOwner && (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {detail.submissions.length > 0 ? (
              detail.submissions.map(({ submission, reviews }, index) => {
                const hasTeacherReview = reviews.some((r) => r.reviewType === 'TEACHER');
                const aiReview = getAiReview(reviews);
                const aiReviewStale = aiReview ? isAiReviewStale(submission, aiReview) : false;
                // Disabled when AI review exists and is NOT stale (submission unchanged since review)
                const aiReviewDisabled = aiReview !== null && !aiReviewStale;

                const submissionMenuItems: ActionMenuItem[] = [
                  {
                    label: 'Descargar entrega',
                    icon: <DownloadIcon fontSize="small" />,
                    onClick: () => detail.download(submission),
                  },
                  {
                    label: 'Solicitar revisión por IA',
                    icon: <AutoFixHighIcon fontSize="small" />,
                    dividerBefore: true,
                    disabled: aiReviewDisabled,
                    onClick: aiReviewDisabled
                      ? undefined
                      : () => detail.openConfirmOwnerAiReview(submission),
                  },
                ];

                return (
                  <Box
                    key={`submission-${submission.id ?? getSubmissionDocumentId(submission) ?? index}`}
                    sx={{
                      display: 'grid',
                      gap: 2,
                      gridTemplateColumns: { xs: '1fr', md: '320px minmax(0, 1fr)' },
                    }}
                  >
                    <Card variant="outlined" sx={{ borderRadius: 1 }}>
                      <CardContent>
                        <Box
                          sx={{
                            alignItems: 'flex-start',
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Entrega
                          </Typography>
                          <ActionMenuButton
                            label="Opciones de entrega"
                            items={submissionMenuItems}
                          />
                        </Box>
                        <Divider sx={{ my: 1.5 }} />
                        <SubmissionSummary
                          assignmentTitle={assignment.title}
                          submission={submission}
                        />
                      </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ borderRadius: 1 }}>
                      <CardContent>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'space-between',
                            mb: 1.5,
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Revisiones
                          </Typography>
                          {!hasTeacherReview && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<RateReviewIcon />}
                              onClick={() => detail.openReviewModal(submission)}
                            >
                              Realizar revisión
                            </Button>
                          )}
                        </Box>
                        <ReviewList
                          reviews={reviews}
                          submission={submission}
                          isOwner
                          onDeleteReview={detail.removeReview}
                          onEditReview={detail.openEditReview}
                        />
                      </CardContent>
                    </Card>
                  </Box>
                );
              })
            ) : (
              <Card variant="outlined" sx={{ borderRadius: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    No hay entregas realizadas
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    Cuando un estudiante suba una entrega, aparecerá en esta sección.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Stack>
        )}
      </Box>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}

      {/* Submission upload */}
      <NoteUploadModal
        open={detail.uploadModalMode !== 'closed'}
        mode={detail.uploadModalMode === 'edit' ? 'edit' : 'create'}
        title={detail.uploadModalMode === 'edit' ? 'Actualizar entrega' : 'Agregar entrega'}
        submitLabel={detail.uploadModalMode === 'edit' ? 'Actualizar entrega' : 'Subir entrega'}
        formik={detail.submissionFormik}
        isLoading={detail.isActionLoading}
        onClose={detail.closeUploadModal}
      />

      {/* Edit assignment */}
      <AssignmentFormModal
        open={detail.editAssignmentOpen}
        mode="edit"
        formik={detail.assignmentFormik}
        isLoading={detail.isActionLoading}
        onClose={detail.closeEditAssignment}
      />

      {/* Add bibliography */}
      <BibliographyFormModal
        open={detail.addBibliographyOpen}
        formik={detail.bibliographyFormik}
        isLoading={detail.isActionLoading}
        onClose={detail.closeAddBibliography}
      />

      {/* Reference existing bibliography */}
      <ReferenceBibliographyModal
        open={detail.refBibliographyOpen}
        available={detail.availableBibliographies}
        isLoading={detail.isActionLoading}
        onConfirm={detail.handleRefBibliographies}
        onClose={detail.closeRefBibliography}
      />

      {/* Reference session */}
      <ReferenceSessionModal
        open={detail.refSessionOpen}
        available={detail.availableSessions}
        isLoading={detail.isActionLoading}
        onConfirm={detail.handleRefSessions}
        onClose={detail.closeRefSession}
      />

      {/* Review form — create */}
      <ReviewFormModal
        open={Boolean(detail.reviewModalSubmission)}
        formik={detail.reviewFormik}
        isLoading={detail.isActionLoading}
        onClose={detail.closeReviewModal}
      />

      {/* Review form — edit */}
      <ReviewFormModal
        open={Boolean(detail.editReviewTarget)}
        title="Editar Revisión"
        submitLabel="Guardar cambios"
        formik={detail.editReviewFormik}
        isLoading={detail.isActionLoading}
        onClose={detail.closeEditReview}
      />

      {/* Confirm — delete submission */}
      <ConfirmModal
        open={detail.confirm.kind === 'deleteSubmission'}
        title="Borrar entrega"
        description="¿Estás seguro de que quieres borrar tu entrega? Esta acción no se puede deshacer."
        confirmLabel="Borrar"
        confirmColor="error"
        isLoading={detail.isActionLoading}
        onConfirm={detail.runConfirm}
        onClose={detail.closeConfirm}
      />

      {/* Confirm — AI review */}
      <ConfirmModal
        open={detail.confirm.kind === 'aiReview'}
        title="Solicitar revisión por IA"
        description="¿Quieres enviar tu entrega para revisión automática por IA? Se usará la bibliografía de la tarea como referencia."
        confirmLabel="Solicitar revisión"
        confirmColor="primary"
        isLoading={detail.isActionLoading}
        onConfirm={detail.runConfirm}
        onClose={detail.closeConfirm}
      />

      {/* Confirm — delete assignment */}
      <ConfirmModal
        open={detail.confirm.kind === 'deleteAssignment'}
        title="Eliminar tarea"
        description={`¿Estás seguro de que quieres eliminar la tarea "${assignment.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirmColor="error"
        isLoading={detail.isActionLoading}
        onConfirm={detail.runConfirm}
        onClose={detail.closeConfirm}
      />

      {/* Confirm — delete bibliography reference */}
      <ConfirmModal
        open={detail.confirm.kind === 'deleteBibliography'}
        title="Quitar bibliografía"
        description="¿Quieres quitar esta bibliografía de la tarea?"
        confirmLabel="Quitar"
        confirmColor="error"
        isLoading={detail.isActionLoading}
        onConfirm={detail.runConfirm}
        onClose={detail.closeConfirm}
      />

      {/* Confirm — delete session reference */}
      <ConfirmModal
        open={detail.confirm.kind === 'deleteSession'}
        title="Quitar sesión referenciada"
        description="¿Quieres quitar esta sesión de la tarea?"
        confirmLabel="Quitar"
        confirmColor="error"
        isLoading={detail.isActionLoading}
        onConfirm={detail.runConfirm}
        onClose={detail.closeConfirm}
      />
    </>
  );
};

export default AssignmentDetailPage;

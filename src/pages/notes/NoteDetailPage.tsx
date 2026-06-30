import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
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
import ReviewFormModal from '../../components/reviews/ReviewFormModal';
import { useNoteDetail } from '../../hooks/useNoteDetail';
import type { Note } from '../../services/models/noteModels';
import type { Review } from '../../services/models/reviewModels';
import type { Topic } from '../../services/models/topicModels';

// ── Helpers ────────────────────────────────────────────────────────────────────

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

const getShortId = (value?: string) => (value ? value.slice(0, 3) : '---');

const getNoteOwnerId = (note: Note): string | undefined =>
  note.document?.userId ??
  note.document?.ownerId ??
  note.document?.user?.id ??
  note.document?.owner?.id ??
  note.userId;

const getNoteDocumentId = (note: Note): string => note.document?.id ?? note.documentId;

/** topicTitle-ownerShort-documentShort */
const getNoteDisplayTitle = (topic: Topic | null, note: Note): string => {
  const topicTitle = topic?.title ?? 'Apunte';
  const ownerShort = getShortId(getNoteOwnerId(note));
  const documentShort = getShortId(getNoteDocumentId(note));
  return `${topicTitle}-${ownerShort}-${documentShort}`;
};

/** updatedAt if present, otherwise createdAt */
const getDisplayDate = (note: Note): string => {
  const raw =
    note.currentVersion?.updatedAt ??
    note.updatedAt ??
    note.currentVersion?.createdAt ??
    note.createdAt;
  return raw ? formatDate(raw) : '—';
};

/** True when the AI review predates the note's last update */
const isAiReviewStale = (note: Note, aiReview: Review): boolean => {
  const noteUpdated =
    note.currentVersion?.updatedAt ??
    note.currentVersion?.createdAt ??
    note.updatedAt ??
    note.createdAt;
  return new Date(noteUpdated) > new Date(aiReview.createdAt);
};

const getAiReview = (reviews: Review[]): Review | null =>
  reviews.find((r) => r.reviewType === 'AI') ?? null;

// ── ReviewList ─────────────────────────────────────────────────────────────────

interface ReviewListProps {
  reviews: Review[];
  note: Note;
  isInstructor?: boolean;
  onDeleteReview?: (review: Review) => void;
  onEditReview?: (review: Review) => void;
}

const ReviewList = ({
  reviews,
  note,
  isInstructor = false,
  onDeleteReview,
  onEditReview,
}: ReviewListProps) => {
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
        const stale = review.reviewType === 'AI' ? isAiReviewStale(note, review) : false;

        const label =
          review.reviewType === 'AI' ? (stale ? 'IA — DESACTUALIZADO' : 'IA') : 'Humano';

        // Instructors can edit/delete TEACHER reviews (not AI)
        const menuItems: ActionMenuItem[] =
          isInstructor && review.reviewType === 'TEACHER'
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
          <Card
            key={`review-${review.id ?? index}`}
            variant="outlined"
            sx={{ borderRadius: 1 }}
          >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box
                sx={{
                  alignItems: 'flex-start',
                  display: 'flex',
                  gap: 1,
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    label={label}
                    color={
                      review.reviewType === 'AI' ? (stale ? 'warning' : 'info') : 'primary'
                    }
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

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {formatDate(review.createdAt)}
                {stale && (
                  <Box component="span" sx={{ ml: 1, color: 'warning.main', fontWeight: 600 }}>
                    · Revisión anterior a la última actualización del apunte
                  </Box>
                )}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────────

const NoteDetailPage = () => {
  const { courseId, topicId, noteId } = useParams();
  const detail = useNoteDetail(noteId, topicId, courseId);

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

  if (!detail.note) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No se encontró el apunte solicitado.
      </Alert>
    );
  }

  const { note, topic, reviews, isInstructor, isNoteOwner } = detail;
  const displayTitle = getNoteDisplayTitle(topic, note);
  const aiReview = getAiReview(reviews);
  const aiStale = aiReview ? isAiReviewStale(note, aiReview) : false;
  const aiDisabled = aiReview !== null && !aiStale;
  const hasTeacherReview = reviews.some((r) => r.reviewType === 'TEACHER');

  // ── Note card action menu ──────────────────────────────────────────────────
  // Everyone sees Download + AI review request
  // Note owner additionally sees Edit + Delete
  const noteMenuItems: ActionMenuItem[] = [
    {
      label: 'Descargar apunte',
      icon: <DownloadIcon fontSize="small" />,
      onClick: detail.download,
    },
    {
      label: aiDisabled ? 'Revisión IA actualizada' : 'Solicitar revisión por IA',
      icon: <AutoFixHighIcon fontSize="small" />,
      dividerBefore: true,
      disabled: aiDisabled || detail.isActionLoading,
      onClick: aiDisabled ? undefined : detail.openConfirmAiReview,
    },
    ...(isNoteOwner
      ? [
          {
            label: 'Editar apunte',
            icon: <EditIcon fontSize="small" />,
            dividerBefore: true,
            onClick: detail.openEditNote,
          } satisfies ActionMenuItem,
          {
            label: 'Eliminar apunte',
            icon: <DeleteIcon fontSize="small" />,
            danger: true,
            onClick: detail.openConfirmDeleteNote,
          } satisfies ActionMenuItem,
        ]
      : []),
  ];

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
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' },
          }}
        >
          {/* ── Note info card ─────────────────────────────────────────── */}
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
                <Typography variant="h5" sx={{ fontWeight: 800, wordBreak: 'break-word' }}>
                  {displayTitle}
                </Typography>
                <ActionMenuButton label="Opciones del apunte" items={noteMenuItems} />
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Stack spacing={0.75}>
                {note.currentVersion?.mimeType && (
                  <Typography variant="body2" color="text.secondary">
                    Tipo:{' '}
                    <Box component="strong">{note.currentVersion.mimeType}</Box>
                  </Typography>
                )}

                {(note.currentVersion?.versionNumber ?? note.currentVersion?.version) !==
                  undefined && (
                  <Typography variant="body2" color="text.secondary">
                    Versión:{' '}
                    <Box component="strong">
                      {note.currentVersion?.versionNumber ?? note.currentVersion?.version}
                    </Box>
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary">
                  Última actualización:{' '}
                  <Box component="strong">{getDisplayDate(note)}</Box>
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* ── Reviews panel ─────────────────────────────────────────── */}
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
                {/* Instructors can add a teacher review when none exists yet */}
                {isInstructor && !hasTeacherReview && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<RateReviewIcon />}
                    onClick={detail.openReviewModal}
                  >
                    Realizar revisión
                  </Button>
                )}
              </Box>

              <ReviewList
                reviews={reviews}
                note={note}
                isInstructor={isInstructor}
                onDeleteReview={detail.openConfirmDeleteReview}
                onEditReview={detail.openEditReview}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}

      {/* Edit note (file upload) — note owner only */}
      <NoteUploadModal
        open={detail.editNoteOpen}
        mode="edit"
        title="Actualizar apunte"
        submitLabel="Actualizar apunte"
        formik={detail.editNoteFormik}
        isLoading={detail.isActionLoading}
        onClose={detail.closeEditNote}
      />

      {/* Review create — instructor only */}
      <ReviewFormModal
        open={detail.reviewModalOpen}
        formik={detail.reviewFormik}
        isLoading={detail.isActionLoading}
        onClose={detail.closeReviewModal}
      />

      {/* Review edit — instructor only */}
      <ReviewFormModal
        open={Boolean(detail.editReviewTarget)}
        title="Editar Revisión"
        submitLabel="Guardar cambios"
        formik={detail.editReviewFormik}
        isLoading={detail.isActionLoading}
        onClose={detail.closeEditReview}
      />

      {/* Confirm — AI review */}
      <ConfirmModal
        open={detail.confirm.kind === 'aiReview'}
        title="Solicitar revisión por IA"
        description="¿Quieres solicitar una revisión automática por IA para este apunte?"
        confirmLabel="Solicitar revisión"
        confirmColor="primary"
        isLoading={detail.isActionLoading}
        onConfirm={detail.runConfirm}
        onClose={detail.closeConfirm}
      />

      {/* Confirm — delete note */}
      <ConfirmModal
        open={detail.confirm.kind === 'deleteNote'}
        title="Eliminar apunte"
        description={`¿Estás seguro de que quieres eliminar el apunte "${displayTitle}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirmColor="error"
        isLoading={detail.isActionLoading}
        onConfirm={detail.runConfirm}
        onClose={detail.closeConfirm}
      />

      {/* Confirm — delete review */}
      <ConfirmModal
        open={detail.confirm.kind === 'deleteReview'}
        title="Eliminar revisión"
        description="¿Estás seguro de que quieres eliminar esta revisión?"
        confirmLabel="Eliminar"
        confirmColor="error"
        isLoading={detail.isActionLoading}
        onConfirm={detail.runConfirm}
        onClose={detail.closeConfirm}
      />
    </>
  );
};

export default NoteDetailPage;

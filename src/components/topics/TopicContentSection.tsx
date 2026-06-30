import { Box, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LinkIcon from '@mui/icons-material/Link';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import AssignmentFormModal from '../assignments/AssignmentFormModal';
import ReferenceBibliographyModal from '../assignments/ReferenceBibliographyModal';
import ReferenceSessionModal from '../assignments/ReferenceSessionModal';
import BibliographyFormModal from '../bibliography/BibliographyFormModal';
import ConfirmModal from '../common/ConfirmModal';
import ResourceCard, { type ResourceCardVariant } from '../common/ResourceCard';
import ActionMenuButton, { type ActionMenuItem } from '../common/ActionMenuButton';
import NoteUploadModal from '../notes/NoteUploadModal';
import SessionFormModal from '../sessions/SessionFormModal';
import TopicFormModal from './TopicFormModal';
import { buildTopicRoute, buildSessionRoute, buildNoteRoute, buildTaskRoute } from '../../constants/routes.constants';
import type { UseTopicActionsReturn } from '../../hooks/useTopicActions';
import type { TopicDetailContent } from '../../hooks/useCourseDetail';
import type { Assignment } from '../../services/models/assignmentModels';
import type { Bibliography } from '../../services/models/bibliographyModels';
import type { Note } from '../../services/models/noteModels';
import type { Session } from '../../services/models/sessionModels';

interface TopicContentSectionProps {
  detail: TopicDetailContent;
  isOwner: boolean;
  courseId?: string;
  enableTopicLink?: boolean;
  actions: UseTopicActionsReturn;
}

const emptyText = 'Sin elementos publicados.';

type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  date: string;
  variant: ResourceCardVariant;
  menuItems: ActionMenuItem[];
  footer?: React.ReactNode;
  actionLabel: string;
  onClick?: () => void;
};

const sortByNewestDate = (items: TimelineItem[]) =>
  [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const getShortId = (value?: string) => value?.slice(0, 3) ?? '---';

const getNoteOwnerName = (note: Note) => {
  const documentUser = note.document?.user ?? note.document?.owner;
  const fullName =
    `${documentUser?.firstname ?? note.user?.firstname ?? ''} ${documentUser?.lastname ?? note.user?.lastname ?? ''}`.trim();

  return (
    fullName ||
    documentUser?.email ||
    note.user?.email ||
    getShortId(
      note.document?.userId ??
        note.document?.ownerId ??
        documentUser?.id ??
        note.userId ??
        note.user?.id,
    )
  );
};

const getNoteDisplayTitle = (topicTitle: string, note: Note) =>
  `${topicTitle} - ${getNoteOwnerName(note)} - ${getShortId(note.document?.id ?? note.documentId ?? note.currentVersion?.documentId)}`;

const getAssignmentBibliographies = (assignment: Assignment) => assignment.bibliographies ?? [];
const getAssignmentSessions = (assignment: Assignment) =>
  assignment.sessionReferences ?? assignment.references ?? [];

const TopicContentSection = ({
  detail,
  isOwner,
  courseId,
  enableTopicLink = false,
  actions,
}: TopicContentSectionProps) => {
  const { topic, sessions, assignments, bibliographies, notes } = detail;
  const navigate = useNavigate();
  const {
    modal,
    isLoading,
    closeModal,
    openEditTopic,
    openDeleteTopic,
    openAddTopicBibliography,
    openDeleteTopicBibliography,
    openCreateSession,
    openEditSession,
    openDeleteSession,
    openCreateAssignment,
    openEditAssignment,
    openDeleteAssignment,
    openAddAssignmentBibliography,
    openDeleteAssignmentBibliography,
    openRefBibliographyAssignment,
    openRefSessionAssignment,
    openDeleteAssignmentSession,
    openPublishNote,
    openEditNote,
    openDeleteNote,
    openAiReviewNote,
    downloadNote,
    topicFormik,
    topicBibliographyFormik,
    sessionFormik,
    assignmentFormik,
    assignmentBibliographyFormik,
    noteFormik,
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
  } = actions;

  // ── Menu items (built with closures to capture data) ──────────────────────

  const ownerTopicMenuItems: ActionMenuItem[] = [
    { label: 'Editar tema', icon: <EditIcon fontSize="small" />, onClick: () => openEditTopic(topic) },
    { label: 'Borrar tema', icon: <DeleteIcon fontSize="small" />, danger: true, onClick: () => openDeleteTopic(topic) },
    { label: 'Agregar sesión', icon: <AddIcon fontSize="small" />, dividerBefore: true, onClick: openCreateSession },
    { label: 'Agregar tarea', icon: <AddIcon fontSize="small" />, onClick: openCreateAssignment },
    { label: 'Agregar bibliografía', icon: <LibraryBooksIcon fontSize="small" />, onClick: openAddTopicBibliography },
  ];

  const studentTopicMenuItems: ActionMenuItem[] = [
    { label: 'Publicar apunte', icon: <NoteAddIcon fontSize="small" />, onClick: openPublishNote },
  ];

  const buildOwnerSessionMenuItems = (session: Session): ActionMenuItem[] => [
    { label: 'Editar sesión', icon: <EditIcon fontSize="small" />, onClick: () => openEditSession(session) },
    { label: 'Eliminar sesión', icon: <DeleteIcon fontSize="small" />, danger: true, onClick: () => openDeleteSession(session) },
  ];

  const buildOwnerAssignmentMenuItems = (assignment: Assignment): ActionMenuItem[] => [
    { label: 'Editar tarea', icon: <EditIcon fontSize="small" />, onClick: () => openEditAssignment(assignment) },
    { label: 'Eliminar tarea', icon: <DeleteIcon fontSize="small" />, danger: true, onClick: () => openDeleteAssignment(assignment) },
    { label: 'Referencia bibliografía existente', icon: <LinkIcon fontSize="small" />, dividerBefore: true, onClick: () => openRefBibliographyAssignment(assignment) },
    { label: 'Agregar bibliografía', icon: <LibraryBooksIcon fontSize="small" />, onClick: () => openAddAssignmentBibliography(assignment) },
    { label: 'Referenciar sesión', icon: <LinkIcon fontSize="small" />, onClick: () => openRefSessionAssignment(assignment) },
  ];

  const buildStudentNoteMenuItems = (note: Note): ActionMenuItem[] => [
    { label: 'Editar nota', icon: <EditIcon fontSize="small" />, onClick: () => openEditNote(note) },
    { label: 'Borrar nota', icon: <DeleteIcon fontSize="small" />, danger: true, onClick: () => openDeleteNote(note) },
    { label: 'Descargar nota', icon: <DownloadIcon fontSize="small" />, dividerBefore: true, onClick: () => downloadNote(note) },
    { label: 'Solicitar revisión por IA', icon: <AutoAwesomeIcon fontSize="small" />, onClick: () => openAiReviewNote(note) },
  ];

  const buildOwnerNoteMenuItems = (note: Note): ActionMenuItem[] => [
    { label: 'Descargar nota', icon: <DownloadIcon fontSize="small" />, onClick: () => downloadNote(note) },
    { label: 'Solicitar revisión por IA', icon: <AutoAwesomeIcon fontSize="small" />, onClick: () => openAiReviewNote(note) },
  ];

  const buildTopicBibliographyMenuItems = (bibliography: Bibliography): ActionMenuItem[] => [
    { label: 'Borrar bibliografía', icon: <DeleteIcon fontSize="small" />, danger: true, onClick: () => openDeleteTopicBibliography(bibliography) },
  ];

  const buildAssignmentBibliographyChipDeleteHandler = (
    assignment: Assignment,
    bibliography: Bibliography,
  ) => () => openDeleteAssignmentBibliography(assignment, bibliography);

  const buildAssignmentSessionMenuItems = (
    assignment: Assignment,
    session: Session,
  ): ActionMenuItem[] => [
    {
      label: 'Quitar referencia',
      icon: <DeleteIcon fontSize="small" />,
      danger: true,
      onClick: () => openDeleteAssignmentSession(assignment, session),
    },
  ];

  // ── Assignment reference footer ────────────────────────────────────────────

  const renderAssignmentReferences = (assignment: Assignment) => {
    const assignmentBibliographies = getAssignmentBibliographies(assignment);
    const assignmentSessions = getAssignmentSessions(assignment);

    if (assignmentBibliographies.length === 0 && assignmentSessions.length === 0) return null;

    return (
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {assignmentBibliographies.map((bibliography) => (
          <Chip
            key={`bibliography-${bibliography.bibliographyId}`}
            label={bibliography.title ?? `Bibliografía ${getShortId(bibliography.bibliographyId)}`}
            size="small"
            variant="outlined"
            color="primary"
            onDelete={
              isOwner
                ? buildAssignmentBibliographyChipDeleteHandler(assignment, { id: bibliography.bibliographyId, title: bibliography.title ?? '', userId: '', url: '', bibliographyType: 'PDF', mimeType: '', summary: '', createdAt: '', updatedAt: '' })
                : undefined
            }
          />
        ))}
        {assignmentSessions.map((session) => {
          const fullSession = sessions.find((s) => s.id === session.sessionId);
          return (
            <Chip
              key={`session-${session.sessionId}`}
              label={session.title ?? `Sesión ${getShortId(session.sessionId)}`}
              size="small"
              variant="outlined"
              color="success"
              deleteIcon={
                isOwner && fullSession ? (
                  <Box component="span" onClick={(e) => e.stopPropagation()}>
                    <ActionMenuButton
                      label="Opciones de referencia"
                      items={buildAssignmentSessionMenuItems(assignment, fullSession)}
                    />
                  </Box>
                ) : undefined
              }
              onDelete={isOwner && fullSession ? () => undefined : undefined}
            />
          );
        })}
      </Stack>
    );
  };

  const timelineItems = sortByNewestDate([
    ...sessions.map((session) => ({
      id: `session-${session.id}`,
      title: session.title,
      description: session.summary,
      date: session.updatedAt,
      variant: 'session' as const,
      menuItems: isOwner ? buildOwnerSessionMenuItems(session) : [],
      actionLabel: 'Opciones de sesión',
      onClick: courseId ? () => navigate(buildSessionRoute(courseId, topic.id, session.id)) : undefined,
    })),
    ...assignments
      .filter((assignment) => {
        if (isOwner) return true;
        // Students don't see drafts or assignments that haven't started yet
        if (assignment.assignmentStatus === 'DRAFT') return false;
        if (new Date(assignment.startDate) > new Date()) return false;
        return true;
      })
      .map((assignment) => ({
      id: `assignment-${assignment.id}`,
      title: assignment.title,
      description: assignment.description,
      meta: `Finaliza: ${new Date(assignment.endDate).toLocaleDateString()}`,
      date: assignment.updatedAt,
      variant: 'assignment' as const,
      menuItems: isOwner ? buildOwnerAssignmentMenuItems(assignment) : [],
      footer: renderAssignmentReferences(assignment),
      actionLabel: 'Opciones de tarea',
      onClick: courseId ? () => navigate(buildTaskRoute(courseId, topic.id, assignment.id)) : undefined,
    })),
    ...(!isOwner
      ? notes.map((note) => ({
          id: `note-${note.documentId}`,
          title: getNoteDisplayTitle(topic.title, note),
          description: `Actualizado: ${new Date(note.currentVersion?.updatedAt ?? note.updatedAt).toLocaleString()}`,
          date: note.updatedAt,
          variant: 'note' as const,
          menuItems: buildStudentNoteMenuItems(note),
          actionLabel: 'Opciones de nota',
          onClick: courseId ? () => navigate(buildNoteRoute(courseId, topic.id, note.documentId)) : undefined,
        }))
      : []),
  ]);

  // ── Determine modal to render ──────────────────────────────────────────────

  const isBibliographyModal =
    modal.kind === 'addTopicBibliography' || modal.kind === 'addAssignmentBibliography';
  const bibliographyFormikForModal =
    modal.kind === 'addAssignmentBibliography'
      ? assignmentBibliographyFormik
      : topicBibliographyFormik;

  return (
    <>
      {/* ── Topic section ───────────────────────────────────────────────── */}
      <Box
        component="section"
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ alignItems: 'flex-start', display: 'flex', gap: 1, justifyContent: 'space-between' }}>
          {enableTopicLink && courseId ? (
            <Typography
              component={RouterLink}
              to={buildTopicRoute(courseId, topic.id)}
              variant="h6"
              sx={{
                color: 'text.primary',
                display: 'inline-block',
                fontWeight: 700,
                textDecoration: 'none',
                '&:hover': { color: 'primary.main', textDecoration: 'underline' },
              }}
            >
              {topic.title}
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {topic.title}
            </Typography>
          )}
          <ActionMenuButton
            label="Opciones del tema"
            items={isOwner ? ownerTopicMenuItems : studentTopicMenuItems}
          />
        </Box>

        {topic.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {topic.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 2 }}>
          {bibliographies.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Sin bibliografía publicada.
            </Typography>
          )}
          {bibliographies.map((bibliography: Bibliography) => (
            <Chip
              key={bibliography.id}
              label={bibliography.title}
              size="small"
              variant="outlined"
              color="primary"
              onDelete={isOwner ? () => undefined : undefined}
              deleteIcon={
                isOwner ? (
                  <Box component="span" onClick={(event) => event.stopPropagation()}>
                    <ActionMenuButton
                      label="Opciones de bibliografía"
                      items={buildTopicBibliographyMenuItems(bibliography)}
                    />
                  </Box>
                ) : undefined
              }
            />
          ))}
        </Stack>

        {isOwner && (
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
              Apuntes de estudiantes
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {notes.length > 0 ? (
                notes.map((note) => {
                  const noteRoute = courseId
                    ? buildNoteRoute(courseId, topic.id, note.documentId)
                    : undefined;
                  return (
                    <Box
                      key={note.documentId}
                      sx={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      <Chip
                        label={
                          noteRoute ? (
                            <RouterLink
                              to={noteRoute}
                              style={{ color: 'inherit', textDecoration: 'none' }}
                            >
                              {getNoteDisplayTitle(topic.title, note)}
                            </RouterLink>
                          ) : (
                            getNoteDisplayTitle(topic.title, note)
                          )
                        }
                        size="small"
                        variant="outlined"
                        onDelete={() => undefined}
                        deleteIcon={
                          <Box
                            component="span"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <ActionMenuButton
                              label="Opciones de nota"
                              items={buildOwnerNoteMenuItems(note)}
                            />
                          </Box>
                        }
                      />
                    </Box>
                  );
                })
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sin apuntes publicados.
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Publicaciones
          </Typography>
          <Stack spacing={1.25}>
            {timelineItems.length > 0 ? (
              timelineItems.map((item) => (
                <ResourceCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  meta={item.meta}
                  variant={item.variant}
                  menuItems={item.menuItems}
                  footer={item.footer}
                  actionLabel={item.actionLabel}
                  onClick={item.onClick}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                {emptyText}
              </Typography>
            )}
          </Stack>
        </Box>

      </Box>

      {/* ── Modals ──────────────────────────────────────────────────────── */}

      {/* Edit Topic */}
      <TopicFormModal
        open={modal.kind === 'editTopic'}
        mode="edit"
        formik={topicFormik}
        isLoading={isLoading}
        onClose={closeModal}
      />

      {/* Delete Topic */}
      <ConfirmModal
        open={modal.kind === 'deleteTopic'}
        title="Borrar Tema"
        description={`¿Estás seguro de que quieres borrar el tema "${modal.kind === 'deleteTopic' ? modal.topic.title : ''}"? Esta acción no se puede deshacer.`}
        confirmLabel="Borrar"
        confirmColor="error"
        isLoading={isLoading}
        onConfirm={handleDeleteTopic}
        onClose={closeModal}
      />

      {/* Add Bibliography (topic or assignment) */}
      <BibliographyFormModal
        open={isBibliographyModal}
        formik={bibliographyFormikForModal}
        isLoading={isLoading}
        onClose={closeModal}
      />

      {/* Delete Topic Bibliography */}
      <ConfirmModal
        open={modal.kind === 'deleteTopicBibliography'}
        title="Borrar Bibliografía"
        description={`¿Quieres borrar "${modal.kind === 'deleteTopicBibliography' ? modal.bibliography.title : ''}"?`}
        confirmLabel="Borrar"
        confirmColor="error"
        isLoading={isLoading}
        onConfirm={handleDeleteTopicBibliography}
        onClose={closeModal}
      />

      {/* Delete Assignment Bibliography reference */}
      <ConfirmModal
        open={modal.kind === 'deleteAssignmentBibliography'}
        title="Quitar Referencia de Bibliografía"
        description="¿Quieres quitar esta bibliografía de la tarea?"
        confirmLabel="Quitar"
        confirmColor="error"
        isLoading={isLoading}
        onConfirm={handleDeleteAssignmentBibliography}
        onClose={closeModal}
      />

      {/* Create/Edit Session */}
      <SessionFormModal
        open={modal.kind === 'createSession' || modal.kind === 'editSession'}
        mode={modal.kind === 'editSession' ? 'edit' : 'create'}
        formik={sessionFormik}
        isLoading={isLoading}
        onClose={closeModal}
      />

      {/* Delete Session */}
      <ConfirmModal
        open={modal.kind === 'deleteSession'}
        title="Eliminar Sesión"
        description={`¿Estás seguro de que quieres eliminar la sesión "${modal.kind === 'deleteSession' ? modal.session.title : ''}"?`}
        confirmLabel="Eliminar"
        confirmColor="error"
        isLoading={isLoading}
        onConfirm={handleDeleteSession}
        onClose={closeModal}
      />

      {/* Delete Assignment Session reference */}
      <ConfirmModal
        open={modal.kind === 'deleteAssignmentSession'}
        title="Quitar Referencia de Sesión"
        description="¿Quieres quitar esta sesión referenciada de la tarea?"
        confirmLabel="Quitar"
        confirmColor="error"
        isLoading={isLoading}
        onConfirm={handleDeleteAssignmentSession}
        onClose={closeModal}
      />

      {/* Create/Edit Assignment */}
      <AssignmentFormModal
        open={modal.kind === 'createAssignment' || modal.kind === 'editAssignment'}
        mode={modal.kind === 'editAssignment' ? 'edit' : 'create'}
        formik={assignmentFormik}
        isLoading={isLoading}
        onClose={closeModal}
      />

      {/* Delete Assignment */}
      <ConfirmModal
        open={modal.kind === 'deleteAssignment'}
        title="Eliminar Tarea"
        description={`¿Estás seguro de que quieres eliminar la tarea "${modal.kind === 'deleteAssignment' ? modal.assignment.title : ''}"?`}
        confirmLabel="Eliminar"
        confirmColor="error"
        isLoading={isLoading}
        onConfirm={handleDeleteAssignment}
        onClose={closeModal}
      />

      {/* Reference Bibliography to Assignment */}
      <ReferenceBibliographyModal
        open={modal.kind === 'refBibliographyAssignment'}
        available={modal.kind === 'refBibliographyAssignment' ? modal.available : []}
        isLoading={isLoading}
        onConfirm={handleRefBibliographies}
        onClose={closeModal}
      />

      {/* Reference Session to Assignment */}
      <ReferenceSessionModal
        open={modal.kind === 'refSessionAssignment'}
        available={modal.kind === 'refSessionAssignment' ? modal.available : []}
        isLoading={isLoading}
        onConfirm={handleRefSessions}
        onClose={closeModal}
      />

      {/* Publish/Edit Note */}
      <NoteUploadModal
        open={modal.kind === 'publishNote' || modal.kind === 'editNote'}
        mode={modal.kind === 'editNote' ? 'edit' : 'create'}
        formik={noteFormik}
        isLoading={isLoading}
        onClose={closeModal}
      />

      {/* Delete Note */}
      <ConfirmModal
        open={modal.kind === 'deleteNote'}
        title="Borrar Nota"
        description="¿Estás seguro de que quieres borrar esta nota? Esta acción no se puede deshacer."
        confirmLabel="Borrar"
        confirmColor="error"
        isLoading={isLoading}
        onConfirm={handleDeleteNote}
        onClose={closeModal}
      />

      {/* AI Review Note */}
      <ConfirmModal
        open={modal.kind === 'aiReviewNote'}
        title="Solicitar Revisión por IA"
        description="¿Quieres enviar esta nota para revisión automática por IA? Se usará la bibliografía del tema como referencia."
        confirmLabel="Solicitar revisión"
        confirmColor="primary"
        isLoading={isLoading}
        onConfirm={handleAiReviewNote}
        onClose={closeModal}
      />
    </>
  );
};

export default TopicContentSection;

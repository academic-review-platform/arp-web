import { Box, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LinkIcon from '@mui/icons-material/Link';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import ResourceCard, { type ResourceCardVariant } from '../common/ResourceCard';
import ActionMenuButton, { type ActionMenuItem } from '../common/ActionMenuButton';
import { buildTopicRoute } from '../../constants/routes.constants';
import type { TopicDetailContent } from '../../hooks/useCourseDetail';
import type { Assignment } from '../../services/models/assignmentModels';
import type { Bibliography } from '../../services/models/bibliographyModels';
import type { Note } from '../../services/models/noteModels';

interface TopicContentSectionProps {
  detail: TopicDetailContent;
  isOwner: boolean;
  courseId?: string;
  enableTopicLink?: boolean;
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
};

const sortByNewestDate = (items: TimelineItem[]) =>
  [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const bibliographyMenuItems: ActionMenuItem[] = [
  { label: 'Borrar bibliografía', icon: <DeleteIcon fontSize="small" />, danger: true },
];

const ownerTopicMenuItems: ActionMenuItem[] = [
  { label: 'Editar tema', icon: <EditIcon fontSize="small" /> },
  { label: 'Borrar tema', icon: <DeleteIcon fontSize="small" />, danger: true },
  { label: 'Agregar sesión', icon: <AddIcon fontSize="small" />, dividerBefore: true },
  { label: 'Agregar tarea', icon: <AddIcon fontSize="small" /> },
  { label: 'Agregar bibliografía', icon: <LibraryBooksIcon fontSize="small" /> },
];

const studentTopicMenuItems: ActionMenuItem[] = [
  { label: 'Publicar apunte', icon: <NoteAddIcon fontSize="small" /> },
];

const ownerSessionMenuItems: ActionMenuItem[] = [
  { label: 'Editar sesión', icon: <EditIcon fontSize="small" /> },
  { label: 'Eliminar sesión', icon: <DeleteIcon fontSize="small" />, danger: true },
];

const ownerAssignmentMenuItems: ActionMenuItem[] = [
  { label: 'Editar tarea', icon: <EditIcon fontSize="small" /> },
  { label: 'Eliminar tarea', icon: <DeleteIcon fontSize="small" />, danger: true },
  { label: 'Referencia bibliografía existente', icon: <LinkIcon fontSize="small" />, dividerBefore: true },
  { label: 'Agregar bibliografía', icon: <LibraryBooksIcon fontSize="small" /> },
  { label: 'Referenciar sesión', icon: <LinkIcon fontSize="small" /> },
];

const studentNoteMenuItems: ActionMenuItem[] = [
  { label: 'Editar nota', icon: <EditIcon fontSize="small" /> },
  { label: 'Borrar nota', icon: <DeleteIcon fontSize="small" />, danger: true },
  { label: 'Descargar nota', icon: <DownloadIcon fontSize="small" />, dividerBefore: true },
  { label: 'Solicitar revisión por IA', icon: <AutoAwesomeIcon fontSize="small" /> },
];

const ownerNoteMenuItems: ActionMenuItem[] = [
  { label: 'Descargar nota', icon: <DownloadIcon fontSize="small" /> },
  { label: 'Solicitar revisión por IA', icon: <AutoAwesomeIcon fontSize="small" /> },
];

const getShortId = (value?: string) => value?.slice(0, 3) ?? '---';

const getNoteOwnerName = (note: Note) => {
  const documentUser = note.document?.user ?? note.document?.owner;
  const fullName = `${documentUser?.firstname ?? note.user?.firstname ?? ''} ${documentUser?.lastname ?? note.user?.lastname ?? ''}`.trim();

  return (
    fullName ||
    documentUser?.email ||
    note.user?.email ||
    getShortId(note.document?.userId ?? note.document?.ownerId ?? documentUser?.id ?? note.userId ?? note.user?.id)
  );
};

const getNoteDisplayTitle = (topicTitle: string, note: Note) =>
  `${topicTitle} - ${getNoteOwnerName(note)} - ${getShortId(note.document?.id ?? note.documentId ?? note.currentVersion?.documentId)}`;

const getAssignmentBibliographies = (assignment: Assignment) =>
  assignment.bibliographies ?? [];

const getAssignmentSessions = (assignment: Assignment) =>
  assignment.sessionReferences ?? assignment.references ?? [];

const renderAssignmentReferences = (assignment: Assignment) => {
  const bibliographies = getAssignmentBibliographies(assignment);
  const sessions = getAssignmentSessions(assignment);

  if (bibliographies.length === 0 && sessions.length === 0) return null;

  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
      {bibliographies.map((bibliography) => (
        <Chip
          key={`bibliography-${bibliography.bibliographyId}`}
          label={bibliography.title ?? `Bibliografía ${getShortId(bibliography.bibliographyId)}`}
          size="small"
          variant="outlined"
          color="primary"
          onDelete={() => undefined}
        />
      ))}
      {sessions.map((session) => (
        <Chip
          key={`session-${session.sessionId}`}
          label={session.title ?? `Sesión ${getShortId(session.sessionId)}`}
          size="small"
          variant="outlined"
          color="success"
          onDelete={() => undefined}
        />
      ))}
    </Stack>
  );
};

const TopicContentSection = ({
  detail,
  isOwner,
  courseId,
  enableTopicLink = false,
}: TopicContentSectionProps) => {
  const { topic, sessions, assignments, bibliographies, notes } = detail;
  const timelineItems = sortByNewestDate([
    ...sessions.map((session) => ({
      id: `session-${session.id}`,
      title: session.title,
      description: session.summary,
      date: session.updatedAt,
      variant: 'session' as const,
      menuItems: isOwner ? ownerSessionMenuItems : [],
      actionLabel: 'Opciones de sesión',
    })),
    ...assignments.map((assignment) => ({
      id: `assignment-${assignment.id}`,
      title: assignment.title,
      description: assignment.description,
      meta: `Finaliza: ${new Date(assignment.endDate).toLocaleDateString()}`,
      date: assignment.updatedAt,
      variant: 'assignment' as const,
      menuItems: isOwner ? ownerAssignmentMenuItems : [],
      footer: renderAssignmentReferences(assignment),
      actionLabel: 'Opciones de tarea',
    })),
    ...(!isOwner
      ? notes.map((note) => ({
          id: `note-${note.documentId}`,
          title: getNoteDisplayTitle(topic.title, note),
          description: note.currentVersion?.mimeType ?? 'Documento sin versión disponible',
          date: note.updatedAt,
          variant: 'note' as const,
          menuItems: studentNoteMenuItems,
          actionLabel: 'Opciones de nota',
        }))
      : []),
  ]);

  return (
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
        {bibliographies.map((bibliography: Bibliography) => (
          <Chip
            key={bibliography.id}
            label={bibliography.title}
            size="small"
            variant="outlined"
            color="primary"
            onDelete={() => undefined}
            deleteIcon={
              <Box component="span" onClick={(event) => event.stopPropagation()}>
                <ActionMenuButton label="Opciones de bibliografía" items={bibliographyMenuItems} />
              </Box>
            }
          />
        ))}
      </Stack>

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
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {emptyText}
            </Typography>
          )}
        </Stack>
      </Box>

      {isOwner && (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Notas de estudiantes
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {notes.length > 0 ? (
            notes.map((note) => (
              <Chip
                key={note.documentId}
                label={getNoteDisplayTitle(topic.title, note)}
                size="small"
                variant="outlined"
                onDelete={() => undefined}
                deleteIcon={
                  <Box component="span" onClick={(event) => event.stopPropagation()}>
                    <ActionMenuButton label="Opciones de nota" items={ownerNoteMenuItems} />
                  </Box>
                }
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {emptyText}
            </Typography>
          )}
        </Stack>
      </Box>
      )}
    </Box>
  );
};

export default TopicContentSection;

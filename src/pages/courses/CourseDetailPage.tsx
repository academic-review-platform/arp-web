import { Alert, Box, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

import ActionMenuButton, { type ActionMenuItem } from '../../components/common/ActionMenuButton';
import TopicContentSection from '../../components/topics/TopicContentSection';
import { useCourseDetail } from '../../hooks/useCourseDetail';

const ownerCourseMenuItems: ActionMenuItem[] = [
  { label: 'Añadir un nuevo tema', icon: <AddIcon fontSize="small" /> },
  { label: 'Copiar código de inscripción', icon: <ContentCopyIcon fontSize="small" /> },
  { label: 'Añadir bibliografía', icon: <LibraryBooksIcon fontSize="small" /> },
  { label: 'Editar curso', icon: <EditIcon fontSize="small" />, dividerBefore: true },
  { label: 'Borrar curso', icon: <DeleteIcon fontSize="small" />, danger: true },
];

const bibliographyMenuItems: ActionMenuItem[] = [
  { label: 'Borrar bibliografía', icon: <DeleteIcon fontSize="small" />, danger: true },
];

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { course, courseBibliographies, topics, isOwner, isLoading, error } =
    useCourseDetail(courseId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!course) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No se encontró el curso solicitado.
      </Alert>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Box component="header" sx={{ mb: 3 }}>
        <Box sx={{ alignItems: 'flex-start', display: 'flex', gap: 1, justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {course.title}
          </Typography>
          {isOwner && <ActionMenuButton label="Opciones del curso" items={ownerCourseMenuItems} />}
        </Box>
        {course.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 880 }}>
            {course.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 2 }}>
          {courseBibliographies.length > 0 ? (
            courseBibliographies.map((bibliography) => (
              <Chip
                key={bibliography.id}
                label={bibliography.title}
                variant="outlined"
                color="primary"
                onDelete={() => undefined}
                deleteIcon={
                  <Box component="span" onClick={(event) => event.stopPropagation()}>
                    <ActionMenuButton label="Opciones de bibliografía" items={bibliographyMenuItems} />
                  </Box>
                }
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Este curso todavía no tiene bibliografía.
            </Typography>
          )}
        </Stack>
      </Box>

      <Stack spacing={2.5}>
        {topics.length > 0 ? (
          topics.map((topicDetail) => (
            <TopicContentSection
              key={topicDetail.topic.id}
              detail={topicDetail}
              isOwner={isOwner}
              courseId={course.id}
              enableTopicLink
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            Este curso todavía no tiene topics publicados.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default CourseDetailPage;

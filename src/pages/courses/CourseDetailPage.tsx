import { Alert, Box, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddIcon from '@mui/icons-material/Add';

import ActionMenuButton, { type ActionMenuItem } from '../../components/common/ActionMenuButton';
import BibliographyFormModal from '../../components/bibliography/BibliographyFormModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import CourseFormModal from '../../components/courses/CourseFormModal';
import TopicContentSection from '../../components/topics/TopicContentSection';
import TopicFormModal from '../../components/topics/TopicFormModal';
import { useCourseActions } from '../../hooks/useCourseActions';
import { useCourseDetail } from '../../hooks/useCourseDetail';
import { useTopicActions } from '../../hooks/useTopicActions';
import type { TopicDetailContent } from '../../hooks/useCourseDetail';
import type { Bibliography } from '../../services/models/bibliographyModels';

// ── Per-topic wrapper — each topic gets its own action hook ──────────────────

interface TopicSectionWrapperProps {
  topicDetail: TopicDetailContent;
  courseId: string;
  isOwner: boolean;
  enableTopicLink: boolean;
  courseBibliographies: Bibliography[];
  onRefresh: () => void;
}

const TopicSectionWrapper = ({
  topicDetail,
  courseId,
  isOwner,
  enableTopicLink,
  courseBibliographies,
  onRefresh,
}: TopicSectionWrapperProps) => {
  const actions = useTopicActions({
    topicId: topicDetail.topic.id,
    sessions: topicDetail.sessions,
    topicBibliographies: topicDetail.bibliographies,
    courseBibliographies,
    onRefresh,
  });

  return (
    <TopicContentSection
      detail={topicDetail}
      isOwner={isOwner}
      courseId={courseId}
      enableTopicLink={enableTopicLink}
      actions={actions}
    />
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { course, courseBibliographies, topics, isOwner, isLoading: courseLoading, error, refetch } =
    useCourseDetail(courseId);

  const courseActions = useCourseActions({ course, onRefresh: refetch });

  if (courseLoading) {
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

  const ownerCourseMenuItems: ActionMenuItem[] = [
    {
      label: 'Añadir un nuevo tema',
      icon: <AddIcon fontSize="small" />,
      onClick: courseActions.openCreateTopic,
    },
    {
      label: courseActions.copySuccess ? 'Código copiado' : 'Copiar código de inscripción',
      icon: courseActions.copySuccess ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />,
      onClick: courseActions.copyEnrollmentCode,
    },
    {
      label: 'Añadir bibliografía',
      icon: <LibraryBooksIcon fontSize="small" />,
      onClick: courseActions.openAddBibliography,
    },
    {
      label: 'Editar curso',
      icon: <EditIcon fontSize="small" />,
      dividerBefore: true,
      onClick: courseActions.openEditCourse,
    },
    {
      label: 'Borrar curso',
      icon: <DeleteIcon fontSize="small" />,
      danger: true,
      onClick: courseActions.openDeleteCourse,
    },
  ];

  return (
    <>
      <Box sx={{ pb: 4 }}>
        <Box component="header" sx={{ mb: 3 }}>
          <Box sx={{ alignItems: 'flex-start', display: 'flex', gap: 1, justifyContent: 'space-between' }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {course.title}
            </Typography>
            {isOwner && (
              <ActionMenuButton label="Opciones del curso" items={ownerCourseMenuItems} />
            )}
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
                  onDelete={isOwner ? () => undefined : undefined}
                  deleteIcon={
                    isOwner ? (
                      <Box component="span" onClick={(event) => event.stopPropagation()}>
                        <ActionMenuButton
                          label="Opciones de bibliografía"
                          items={[
                            {
                              label: 'Borrar bibliografía',
                              icon: <DeleteIcon fontSize="small" />,
                              danger: true,
                              onClick: () => courseActions.openDeleteBibliography(bibliography),
                            },
                          ]}
                        />
                      </Box>
                    ) : undefined
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
              <TopicSectionWrapper
                key={topicDetail.topic.id}
                topicDetail={topicDetail}
                courseId={course.id}
                isOwner={isOwner}
                enableTopicLink
                courseBibliographies={courseBibliographies}
                onRefresh={refetch}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Este curso todavía no tiene topics publicados.
            </Typography>
          )}
        </Stack>
      </Box>

      {/* ── Course-level modals ──────────────────────────────────────────── */}

      {/* Create Topic */}
      <TopicFormModal
        open={courseActions.modal.kind === 'createTopic'}
        mode="create"
        formik={courseActions.topicFormik}
        isLoading={courseActions.isLoading}
        onClose={courseActions.closeModal}
      />

      {/* Edit Course */}
      <CourseFormModal
        open={courseActions.modal.kind === 'editCourse'}
        mode="edit"
        formik={courseActions.courseFormik}
        isLoading={courseActions.isLoading}
        onClose={courseActions.closeModal}
      />

      {/* Delete Course */}
      <ConfirmModal
        open={courseActions.modal.kind === 'deleteCourse'}
        title="Borrar Curso"
        description={`¿Estás seguro de que quieres borrar el curso "${courseActions.modal.kind === 'deleteCourse' ? courseActions.modal.course.title : ''}"? Esta acción no se puede deshacer.`}
        confirmLabel="Borrar"
        confirmColor="error"
        isLoading={courseActions.isLoading}
        onConfirm={courseActions.handleDeleteCourse}
        onClose={courseActions.closeModal}
      />

      {/* Add Course Bibliography */}
      <BibliographyFormModal
        open={courseActions.modal.kind === 'addBibliography'}
        formik={courseActions.bibliographyFormik}
        isLoading={courseActions.isLoading}
        onClose={courseActions.closeModal}
      />

      {/* Delete Course Bibliography */}
      <ConfirmModal
        open={courseActions.modal.kind === 'deleteBibliography'}
        title="Borrar Bibliografía"
        description={`¿Quieres borrar "${courseActions.modal.kind === 'deleteBibliography' ? courseActions.modal.bibliography.title : ''}"?`}
        confirmLabel="Borrar"
        confirmColor="error"
        isLoading={courseActions.isLoading}
        onConfirm={courseActions.handleDeleteBibliography}
        onClose={courseActions.closeModal}
      />
    </>
  );
};

export default CourseDetailPage;

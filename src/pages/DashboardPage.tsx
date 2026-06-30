import { Alert, Box, CircularProgress, Grid, Typography } from '@mui/material';

import CourseCard from '../components/courses/CourseCard';
import CourseFormModal from '../components/courses/CourseFormModal';
import ConfirmModal from '../components/common/ConfirmModal';
import { useDashboard } from '../hooks/useDashboard';
import { useDashboardActions } from '../hooks/useDashboardActions';

const DashboardPage = () => {
  const { ownedCourses, enrolledCourses, currentUserId, isLoading, error } = useDashboard();
  const actions = useDashboardActions();

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

  const allCourses = [...ownedCourses, ...enrolledCourses];

  return (
    <Box>
      {allCourses.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          Aún no tienes cursos. Usa el botón <strong>+</strong> para crear o unirte a uno.
        </Typography>
      ) : (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Mis Cursos
          </Typography>

          <Grid container spacing={2}>
            {allCourses.map((course) => {
              const isOwner = course.ownerId === currentUserId;
              return (
                <Grid key={course.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <CourseCard
                    course={course}
                    isOwner={isOwner}
                    onEdit={isOwner ? actions.openEditModal : undefined}
                    onDelete={isOwner ? actions.openDeleteModal : undefined}
                    onLeave={!isOwner ? actions.openLeaveModal : undefined}
                  />
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {/* Modal editar curso — reutiliza CourseFormModal en modo edit */}
      <CourseFormModal
        open={actions.activeModal === 'edit'}
        mode="edit"
        formik={actions.editFormik}
        isLoading={actions.isEditing}
        onClose={actions.closeModal}
      />

      {/* Modal confirmar borrado */}
      <ConfirmModal
        open={actions.activeModal === 'delete'}
        title="Borrar curso"
        description={`¿Estás seguro de que quieres borrar "${actions.selectedCourse?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Borrar"
        confirmColor="error"
        isLoading={actions.isDeleting}
        onConfirm={actions.handleConfirmDelete}
        onClose={actions.closeModal}
      />

      {/* Modal confirmar abandono */}
      <ConfirmModal
        open={actions.activeModal === 'leave'}
        title="Abandonar curso"
        description={`¿Estás seguro de que quieres abandonar "${actions.selectedCourse?.name}"?`}
        confirmLabel="Abandonar"
        confirmColor="error"
        isLoading={actions.isLeaving}
        onConfirm={actions.handleConfirmLeave}
        onClose={actions.closeModal}
      />
    </Box>
  );
};

export default DashboardPage;

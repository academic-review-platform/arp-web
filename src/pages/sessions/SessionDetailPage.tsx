import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Alert, Box, Card, CardContent, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from 'react-router-dom';

import ActionMenuButton, { type ActionMenuItem } from '../../components/common/ActionMenuButton';
import ConfirmModal from '../../components/common/ConfirmModal';
import SessionFormModal from '../../components/sessions/SessionFormModal';
import { useSessionDetail } from '../../hooks/useSessionDetail';

const SessionDetailPage = () => {
  const { courseId, topicId, sessionId } = useParams();
  const detail = useSessionDetail({ courseId, topicId, sessionId });

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

  if (!detail.session) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No se encontró la sesión solicitada.
      </Alert>
    );
  }

  const ownerMenuItems: ActionMenuItem[] = [
    {
      label: 'Editar sesión',
      icon: <EditIcon fontSize="small" />,
      onClick: detail.openEditModal,
    },
    {
      label: 'Borrar sesión',
      icon: <DeleteIcon fontSize="small" />,
      danger: true,
      dividerBefore: true,
      onClick: detail.openDeleteModal,
    },
  ];

  return (
    <>
      <Box sx={{ pb: 4 }}>
        <Card variant="outlined" sx={{ borderRadius: 1 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box sx={{ alignItems: 'flex-start', display: 'flex', gap: 1.5, justifyContent: 'space-between' }}>
              <Box>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
                  {detail.session.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {detail.session.summary}
                </Typography>
              </Box>

              {detail.isOwner && <ActionMenuButton label="Opciones de sesión" items={ownerMenuItems} />}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Stack
              className="markdown-content"
              sx={{
                color: 'text.primary',
                '& > :first-of-type': { mt: 0 },
                '& > :last-child': { mb: 0 },
                '& h1': { fontSize: '1.75rem', fontWeight: 800, mb: 1.5, mt: 3 },
                '& h2': { fontSize: '1.45rem', fontWeight: 800, mb: 1.25, mt: 3 },
                '& h3': { fontSize: '1.2rem', fontWeight: 700, mb: 1, mt: 2.5 },
                '& p': { lineHeight: 1.75, mb: 1.5 },
                '& ul, & ol': { mb: 1.5, pl: 3 },
                '& li': { mb: 0.5 },
                '& blockquote': {
                  borderLeft: 3,
                  borderColor: 'primary.main',
                  color: 'text.secondary',
                  m: 0,
                  mb: 1.5,
                  pl: 2,
                },
                '& code': {
                  bgcolor: 'action.hover',
                  borderRadius: 0.75,
                  fontFamily: 'monospace',
                  px: 0.5,
                  py: 0.25,
                },
                '& pre': {
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  overflowX: 'auto',
                  p: 2,
                },
                '& pre code': {
                  bgcolor: 'transparent',
                  p: 0,
                },
                '& table': {
                  borderCollapse: 'collapse',
                  display: 'block',
                  mb: 2,
                  overflowX: 'auto',
                  width: '100%',
                },
                '& th, & td': {
                  border: 1,
                  borderColor: 'divider',
                  p: 1,
                },
              }}
            >
              {detail.session.contentMd ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{detail.session.contentMd}</ReactMarkdown>
              ) : (
                <Typography color="text.secondary">Esta sesión todavía no tiene contenido publicado.</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <SessionFormModal
        open={detail.modal === 'edit'}
        mode="edit"
        formik={detail.formik}
        isLoading={detail.isSaving}
        onClose={detail.closeModal}
      />

      <ConfirmModal
        open={detail.modal === 'delete'}
        title="Borrar Sesión"
        description={`¿Estás seguro de que quieres borrar la sesión "${detail.session.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Borrar"
        confirmColor="error"
        isLoading={detail.isSaving}
        onConfirm={detail.handleDeleteSession}
        onClose={detail.closeModal}
      />
    </>
  );
};

export default SessionDetailPage;

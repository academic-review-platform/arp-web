import { Alert, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';

import TopicContentSection from '../../components/topics/TopicContentSection';
import { useTopicActions } from '../../hooks/useTopicActions';
import { useTopicDetail } from '../../hooks/useTopicDetail';

const TopicDetailPage = () => {
  const { courseId, topicId } = useParams();
  const { detail, courseBibliographies, isOwner, isLoading, error, refetch } = useTopicDetail(courseId, topicId);

  const actions = useTopicActions({
    topicId: topicId ?? '',
    sessions: detail?.sessions ?? [],
    topicBibliographies: detail?.bibliographies ?? [],
    courseBibliographies,
    onRefresh: refetch,
  });

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

  if (!detail) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No se encontró el topic solicitado.
      </Alert>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <TopicContentSection
        detail={detail}
        isOwner={isOwner}
        actions={actions}
      />
    </Box>
  );
};

export default TopicDetailPage;

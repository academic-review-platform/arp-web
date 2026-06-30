import { Alert, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';

import TopicContentSection from '../../components/topics/TopicContentSection';
import { useTopicDetail } from '../../hooks/useTopicDetail';

const TopicDetailPage = () => {
  const { courseId, topicId } = useParams();
  const { detail, isOwner, isLoading, error } = useTopicDetail(courseId, topicId);

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
      <TopicContentSection detail={detail} isOwner={isOwner} />
    </Box>
  );
};

export default TopicDetailPage;

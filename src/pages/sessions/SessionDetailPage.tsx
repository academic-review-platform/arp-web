import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const SessionDetailPage = () => {
  const { courseId, topicId, sessionId } = useParams();
  return (
    <Typography variant="h5">
      Sesión {sessionId} — Topic {topicId} — Curso {courseId}
    </Typography>
  );
};

export default SessionDetailPage;

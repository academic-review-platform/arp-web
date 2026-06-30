import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const NoteDetailPage = () => {
  const { courseId, topicId, documentId } = useParams();
  return (
    <Typography variant="h5">
      Apunte {documentId} — Topic {topicId} — Curso {courseId}
    </Typography>
  );
};

export default NoteDetailPage;

import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  return <Typography variant="h5">Curso {courseId}</Typography>;
};

export default CourseDetailPage;

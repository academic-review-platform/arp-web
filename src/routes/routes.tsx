import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

import AuthGuard from './guards/authGuard';
import DashboardLayout from '../layout/DashboardLayout';
import { ROUTES } from '../constants/routes.constants';

// Auth pages (eager — pequeñas)
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Dashboard pages (lazy)
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

// Placeholder pages — se implementarán en su momento
const CourseDetailPage  = lazy(() => import('../pages/courses/CourseDetailPage'));
const TopicDetailPage   = lazy(() => import('../pages/topics/TopicDetailPage'));
const NoteDetailPage    = lazy(() => import('../pages/notes/NoteDetailPage'));
const SessionDetailPage = lazy(() => import('../pages/sessions/SessionDetailPage'));
const AssignmentDetailPage = lazy(() => import('../pages/assignments/AssignmentDetailPage'));

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <CircularProgress />
  </Box>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect raíz */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* Auth */}
        <Route path={ROUTES.LOGIN}    element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            }
          />

          {/* Detalle de curso */}
          <Route
            path={ROUTES.COURSE_DETAIL}
            element={
              <Suspense fallback={<PageLoader />}>
                <CourseDetailPage />
              </Suspense>
            }
          />

          {/* Detalle de topic (reemplaza subject) */}
          <Route
            path={ROUTES.TOPIC_DETAIL}
            element={
              <Suspense fallback={<PageLoader />}>
                <TopicDetailPage />
              </Suspense>
            }
          />

          {/* Recursos anidados en un topic */}
          <Route
            path={ROUTES.SESSION_DETAIL}
            element={
              <Suspense fallback={<PageLoader />}>
                <SessionDetailPage />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.NOTE_DETAIL}
            element={
              <Suspense fallback={<PageLoader />}>
                <NoteDetailPage />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.TASK_DETAIL}
            element={
              <Suspense fallback={<PageLoader />}>
                <AssignmentDetailPage />
              </Suspense>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

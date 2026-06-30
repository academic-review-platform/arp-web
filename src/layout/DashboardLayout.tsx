import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import TopBar from '../components/layout/TopBar';
import SideBar from '../components/layout/SideBar';
import AddMenu from '../components/layout/AddMenu';
import ProfileMenu from '../components/layout/ProfileMenu';
import CreateCourseModal from '../components/layout/courses/CreateCourseModal';
import EnrollCourseModal from '../components/layout/courses/EnrollCourseModal';
import { useDashboardLayout } from '../hooks/useDashboardLayout';
import { useAddMenu } from '../hooks/useAddMenu';
import { useProfileMenu } from '../hooks/useProfileMenu';
import { TOPBAR_HEIGHT } from '../constants/navigation.constants';

export default function DashboardLayout() {
  const {
    isSidebarOpen,
    isDesktop,
    closeSidebar,
    toggleSidebar,
    userInitial,
    ownedCourses,
    enrolledCourses,
  } = useDashboardLayout();

  const addMenu = useAddMenu();
  const profileMenu = useProfileMenu();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <TopBar
        onMenuClick={toggleSidebar}
        onAddClick={addMenu.openMenu}
        onAvatarClick={profileMenu.openMenu}
        userInitial={userInitial}
      />

      <SideBar
        open={isSidebarOpen}
        isDesktop={isDesktop}
        onClose={closeSidebar}
        ownedCourses={ownedCourses}
        enrolledCourses={enrolledCourses}
      />

      {/* Menú desplegable del "+" */}
      <AddMenu
        anchorEl={addMenu.menuAnchorEl}
        isOpen={addMenu.isMenuOpen}
        onClose={addMenu.closeMenu}
        onCreateCourse={addMenu.openCreateModal}
        onEnrollCourse={addMenu.openEnrollModal}
      />

      {/* Menú de perfil / avatar */}
      <ProfileMenu
        anchorEl={profileMenu.anchorEl}
        isOpen={profileMenu.isOpen}
        onClose={profileMenu.closeMenu}
        onLogout={profileMenu.handleLogout}
      />

      {/* Modales */}
      <CreateCourseModal
        open={addMenu.activeModal === 'create'}
        onClose={addMenu.closeModal}
        formik={addMenu.createFormik}
        isLoading={addMenu.isCreating}
      />
      <EnrollCourseModal
        open={addMenu.activeModal === 'enroll'}
        onClose={addMenu.closeModal}
        formik={addMenu.enrollFormik}
        isLoading={addMenu.isEnrolling}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: `${TOPBAR_HEIGHT}px`,
          p: { xs: 2, md: 3 },
          minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          // El Drawer permanent ya ocupa su ancho en el flex flow,
          // solo necesitamos ml en mobile cuando el temporary está abierto
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

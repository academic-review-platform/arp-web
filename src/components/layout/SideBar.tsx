import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  SIDEBAR_WIDTH,
  TOPBAR_HEIGHT,
  MAIN_NAV,
  NAV_GROUP_OWNED,
  NAV_GROUP_ENROLLED,
} from '../../constants/navigation.constants';
import { buildCourseRoute } from '../../constants/routes.constants';
import type { Course } from '../../store/models/courseStoreModels';

interface SideBarProps {
  open: boolean;
  isDesktop: boolean;
  onClose: () => void;
  ownedCourses: Course[];
  enrolledCourses: Course[];
}

const SideBar = ({ open, isDesktop, onClose, ownedCourses, enrolledCourses }: SideBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    // En mobile cerramos al navegar; en desktop no hace falta
    if (!isDesktop) onClose();
  };

  const isActive = (path: string) => location.pathname === path;

  const drawerContent = (
    <Box
      role="navigation"
      aria-label="Menú principal"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 1 }}
    >
      {/* Página Principal */}
      <List disablePadding>
        <ListItemButton
          onClick={() => handleNavigate(MAIN_NAV.path)}
          selected={isActive(MAIN_NAV.path)}
          sx={listItemStyles}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={MAIN_NAV.label}
            slotProps={{ primary: { sx: { fontSize: '0.9375rem' } } }}
          />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Cursos que dicto */}
      <GroupLabel label={NAV_GROUP_OWNED.label} />
      <List disablePadding>
        {ownedCourses.length === 0 ? (
          <EmptyHint text="Sin cursos creados" />
        ) : (
          ownedCourses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              isActive={isActive(buildCourseRoute(course.id))}
              onNavigate={() => handleNavigate(buildCourseRoute(course.id))}
            />
          ))
        )}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Cursos en los que estoy inscrito */}
      <GroupLabel label={NAV_GROUP_ENROLLED.label} />
      <List disablePadding>
        {enrolledCourses.length === 0 ? (
          <EmptyHint text="Sin cursos inscritos" />
        ) : (
          enrolledCourses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              isActive={isActive(buildCourseRoute(course.id))}
              onNavigate={() => handleNavigate(buildCourseRoute(course.id))}
            />
          ))
        )}
      </List>
    </Box>
  );

  const sharedPaperSx = {
    width: SIDEBAR_WIDTH,
    top: TOPBAR_HEIGHT,
    height: `calc(100% - ${TOPBAR_HEIGHT}px)`,
    boxSizing: 'border-box' as const,
    bgcolor: 'background.paper',
    borderRight: '1px solid',
    borderColor: 'divider',
  };

  if (isDesktop) {
    // Permanent: sin backdrop, nunca se cierra al hacer clic afuera
    return (
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? SIDEBAR_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            ...sharedPaperSx,
            width: open ? SIDEBAR_WIDTH : 0,
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: open
                  ? theme.transitions.duration.enteringScreen
                  : theme.transitions.duration.leavingScreen,
              }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Temporary: con backdrop, se cierra al hacer clic afuera (mobile)
  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': sharedPaperSx,
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

// ── Sub-componentes internos ────────────────────────────────────────────────

interface CourseItemProps {
  course: Course;
  isActive: boolean;
  onNavigate: () => void;
}

const CourseItem = ({ course, isActive, onNavigate }: CourseItemProps) => (
  <ListItemButton
    onClick={onNavigate}
    selected={isActive}
    sx={listItemStyles}
  >
    <ListItemIcon sx={{ minWidth: 40 }}>
      <SchoolIcon fontSize="small" />
    </ListItemIcon>
    <ListItemText
      primary={course.name}
      slotProps={{
        primary: {
          sx: {
            fontSize: '0.9375rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
      }}
    />
  </ListItemButton>
);

const GroupLabel = ({ label }: { label: string }) => (
  <Typography
    variant="caption"
    sx={{
      px: 2,
      py: 0.5,
      display: 'block',
      color: 'text.secondary',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontSize: '0.6875rem',
    }}
  >
    {label}
  </Typography>
);

const EmptyHint = ({ text }: { text: string }) => (
  <Typography
    variant="body2"
    sx={{ px: 2, py: 0.75, color: 'text.disabled', fontStyle: 'italic', fontSize: '0.8125rem' }}
  >
    {text}
  </Typography>
);

const listItemStyles = {
  borderRadius: 1,
  mx: 1,
  px: 1.5,
  '&.Mui-selected': {
    bgcolor: 'action.selected',
    '&:hover': { bgcolor: 'action.selected' },
  },
  '&:hover': { bgcolor: 'action.hover' },
} as const;

export default SideBar;

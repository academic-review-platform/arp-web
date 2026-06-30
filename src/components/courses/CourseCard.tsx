import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useCourseCard } from '../../hooks/useCourseCard';
import type { Course } from '../../store/models/courseStoreModels';

interface CourseCardProps {
  course: Course;
  isOwner: boolean;
  /** Callbacks de acciones — sin implementar aún, reciben el curso */
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onLeave?: (course: Course) => void;
}

const CourseCard = ({ course, isOwner, onEdit, onDelete, onLeave }: CourseCardProps) => {
  const {
    menuAnchorEl,
    isMenuOpen,
    openMenu,
    closeMenu,
    handleCardClick,
    handleCopyCode,
  } = useCourseCard(course);

  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          '&:hover': {
            boxShadow: 3,
            borderColor: 'primary.light',
          },
        }}
      >
        {/* Área clickeable del card — navega al curso */}
        <CardActionArea
          onClick={handleCardClick}
          sx={{ flexGrow: 1, alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}
        >
          <CardContent sx={{ width: '100%', pb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                mb: 0.75,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {course.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {course.description}
            </Typography>
          </CardContent>
        </CardActionArea>

        <Divider />

        {/* Footer del card — botón de menú, NO navega */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            px: 1,
            py: 0.5,
          }}
        >
          <IconButton
            size="small"
            aria-label="Opciones del curso"
            aria-haspopup="true"
            onClick={openMenu}
            sx={{ color: 'text.secondary' }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      </Card>

      {/* Menú de opciones — fuera del Card para evitar stacking context */}
      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={closeMenu}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: {
            elevation: 3,
            sx: { minWidth: 190, borderRadius: 1.5 },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleCopyCode}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
          Copiar código de curso
        </MenuItem>

        {isOwner && <Divider />}

        {isOwner && (
          <MenuItem onClick={() => { closeMenu(); onEdit?.(course); }}>
            <EditIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
            Editar curso
          </MenuItem>
        )}

        {isOwner && (
          <MenuItem
            onClick={() => { closeMenu(); onDelete?.(course); }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
            Borrar curso
          </MenuItem>
        )}

        {!isOwner && <Divider />}

        {!isOwner && (
          <MenuItem
            onClick={() => { closeMenu(); onLeave?.(course); }}
            sx={{ color: 'error.main' }}
          >
            <ExitToAppIcon fontSize="small" sx={{ mr: 1.5 }} />
            Abandonar curso
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default CourseCard;

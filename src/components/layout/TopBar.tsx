import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';

import { TOPBAR_HEIGHT } from '../../constants/navigation.constants';

interface TopBarProps {
  onMenuClick: () => void;
  userInitial: string;
  onAddClick: (event: React.MouseEvent<HTMLElement>) => void;
  onAvatarClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const TopBar = ({ onMenuClick, userInitial, onAddClick, onAvatarClick }: TopBarProps) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        height: TOPBAR_HEIGHT,
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          height: TOPBAR_HEIGHT,
          minHeight: `${TOPBAR_HEIGHT}px !important`,
          px: '20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: hamburger + título */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            aria-label="Abrir menú"
            edge="start"
            onClick={onMenuClick}
            size="small"
            sx={{ color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="span"
            sx={{ fontWeight: 600, fontSize: '1.5rem', letterSpacing: 0 }}
          >
            Note Validator
          </Typography>
        </Box>

        {/* Right: add + avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <IconButton
            aria-label="Añadir curso"
            onClick={onAddClick}
            size="small"
            sx={{ color: 'text.primary' }}
          >
            <AddCircleOutlineIcon />
          </IconButton>

          <Avatar
            onClick={onAvatarClick}
            role="button"
            aria-label="Menú de perfil"
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#2c2c2c',
              color: '#f5f5f5',
              fontSize: '1.25rem',
              fontWeight: 400,
              cursor: 'pointer',
            }}
          >
            {userInitial}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

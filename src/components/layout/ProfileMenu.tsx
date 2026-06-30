import { Menu, MenuItem } from '@mui/material';
import type { UseProfileMenuReturn } from '../../hooks/useProfileMenu';

interface ProfileMenuProps {
  anchorEl: UseProfileMenuReturn['anchorEl'];
  isOpen: UseProfileMenuReturn['isOpen'];
  onClose: UseProfileMenuReturn['closeMenu'];
  onLogout: UseProfileMenuReturn['handleLogout'];
}

const ProfileMenu = ({ anchorEl, isOpen, onClose, onLogout }: ProfileMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      slotProps={{
        paper: {
          elevation: 3,
          sx: { minWidth: 150, borderRadius: 1.5, mt: 0.5 },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={onLogout}>Cerrar Sesión</MenuItem>
    </Menu>
  );
};

export default ProfileMenu;

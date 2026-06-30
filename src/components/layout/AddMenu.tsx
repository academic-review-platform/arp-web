import { Divider, Menu, MenuItem } from '@mui/material';

interface AddMenuProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateCourse: () => void;
  onEnrollCourse: () => void;
}

const AddMenu = ({
  anchorEl,
  isOpen,
  onClose,
  onCreateCourse,
  onEnrollCourse,
}: AddMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      slotProps={{
        paper: {
          elevation: 3,
          sx: { minWidth: 180, borderRadius: 1.5, mt: 0.5 },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={onCreateCourse}>Crear una Clase</MenuItem>
      <Divider />
      <MenuItem onClick={onEnrollCourse}>Unirse a una Clase</MenuItem>
    </Menu>
  );
};

export default AddMenu;

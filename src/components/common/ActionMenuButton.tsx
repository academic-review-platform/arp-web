import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState, type ReactNode } from 'react';

export interface ActionMenuItem {
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  dividerBefore?: boolean;
  onClick?: () => void;
}

interface ActionMenuButtonProps {
  label: string;
  items: ActionMenuItem[];
}

const ActionMenuButton = ({ label, items }: ActionMenuButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const closeMenu = () => setAnchorEl(null);

  if (items.length === 0) return null;

  return (
    <>
      <IconButton
        size="small"
        aria-label={label}
        aria-haspopup="true"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={closeMenu}
        slotProps={{
          paper: {
            elevation: 3,
            sx: { minWidth: 230, borderRadius: 1 },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {items.map((item) => [
          item.dividerBefore ? <Divider key={`${item.label}-divider`} /> : null,
          <MenuItem
            key={item.label}
            onClick={() => {
              item.onClick?.();
              closeMenu();
            }}
            sx={item.danger ? { color: 'error.main' } : undefined}
          >
            {item.icon && <ListItemIcon sx={item.danger ? { color: 'error.main' } : undefined}>{item.icon}</ListItemIcon>}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>,
        ])}
      </Menu>
    </>
  );
};

export default ActionMenuButton;

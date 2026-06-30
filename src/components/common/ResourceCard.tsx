import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  type SvgIconProps,
} from '@mui/material';
import type { ElementType } from 'react';

import ActionMenuButton, { type ActionMenuItem } from './ActionMenuButton';

export type ResourceCardVariant = 'session' | 'assignment' | 'note';

interface ResourceCardProps {
  title: string;
  description?: string;
  meta?: string;
  variant: ResourceCardVariant;
  menuItems: ActionMenuItem[];
  footer?: React.ReactNode;
  actionLabel: string;
}

const variantStyles: Record<
  ResourceCardVariant,
  { Icon: ElementType<SvgIconProps>; color: 'primary' | 'success' | 'warning' }
> = {
  session: { Icon: MenuBookOutlinedIcon, color: 'primary' },
  assignment: { Icon: AssignmentOutlinedIcon, color: 'warning' },
  note: { Icon: DescriptionOutlinedIcon, color: 'success' },
};

const ResourceCard = ({
  title,
  description,
  meta,
  variant,
  menuItems,
  footer,
  actionLabel,
}: ResourceCardProps) => {
  const { Icon, color } = variantStyles[variant];
  const mainColor = `${color}.main`;
  const lightColor = `${color}.light`;

  return (
  <Card
    elevation={0}
    sx={{
      border: '1px solid',
      borderColor: lightColor,
      borderRadius: 1,
      height: '100%',
    }}
  >
    <CardActionArea sx={{ height: '100%', alignItems: 'stretch' }}>
      <CardContent sx={{ display: 'flex', gap: 1, height: '100%' }}>
        <Box
          sx={{
            alignItems: 'center',
            bgcolor: `${color}.50`,
            border: '1px solid',
            borderColor: lightColor,
            borderRadius: 1,
            color: mainColor,
            display: 'flex',
            flexShrink: 0,
            height: 36,
            justifyContent: 'center',
            width: 36,
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ color: mainColor, fontWeight: 700 }} noWrap>
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {description}
            </Typography>
          )}
          {meta && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {meta}
            </Typography>
          )}
          {footer && <Box sx={{ mt: 1.25 }}>{footer}</Box>}
        </Box>
        {menuItems.length > 0 && (
          <Box onClick={(event) => event.stopPropagation()}>
            <ActionMenuButton label={actionLabel} items={menuItems} />
          </Box>
        )}
      </CardContent>
    </CardActionArea>
  </Card>
  );
};

export default ResourceCard;

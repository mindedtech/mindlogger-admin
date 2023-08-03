import { Svg } from 'shared/components/Svg';

import { ChipProps, ChipShape } from './Chip.types';
import { StyledChip, StyledClearedButton } from './Chip.styles';

export const Chip = ({
  title,
  icon,
  color = 'primary',
  shape = ChipShape.Rectangular,
  onRemove,
  canRemove = true,
  onClick,
  sxProps,
}: ChipProps) => (
  <StyledChip
    shape={shape}
    color={color}
    deleteIcon={
      canRemove ? (
        <StyledClearedButton>
          <Svg id="close" width={18} height={18} />
        </StyledClearedButton>
      ) : undefined
    }
    label={title}
    icon={icon || undefined}
    onDelete={onRemove}
    onClick={onClick}
    sx={sxProps}
  />
);

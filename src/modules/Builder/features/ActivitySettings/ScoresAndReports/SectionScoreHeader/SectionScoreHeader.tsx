import { StyledClearedButton, StyledFlexTopCenter, theme } from 'shared/styles';
import { Svg } from 'shared/components';

import { SectionScoreHeaderProps } from './SectionScoreHeader.types';
import { StyledWrapper } from './SectionScoreHeader.styles';
import { TitleComponent } from '../../TitleComponent';

export const SectionScoreHeader = ({
  onRemove,
  name,
  title,
  open,
  dragHandleProps,
}: SectionScoreHeaderProps) => (
  <StyledWrapper>
    <TitleComponent title={title} name={name} open={open} />
    <StyledFlexTopCenter>
      <StyledClearedButton sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }} onClick={onRemove}>
        <Svg id="trash" width="20" height="20" />
      </StyledClearedButton>
      {dragHandleProps && (
        <StyledClearedButton
          sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
          {...dragHandleProps}
        >
          <Svg id="drag" />
        </StyledClearedButton>
      )}
    </StyledFlexTopCenter>
  </StyledWrapper>
);

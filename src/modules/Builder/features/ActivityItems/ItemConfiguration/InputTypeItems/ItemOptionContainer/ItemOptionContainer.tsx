import {
  theme,
  variables,
  StyledFlexColumn,
  StyledLabelBoldLarge,
  StyledTitleMedium,
} from 'shared/styles';

import { ItemOptionContainerProps } from './ItemOptionContainer.types';
import { StyledItemOptionContainer } from './ItemOptionContainer.styles';

export const ItemOptionContainer = ({ title, description, children }: ItemOptionContainerProps) => (
  <StyledItemOptionContainer>
    <StyledFlexColumn>
      {title && (
        <StyledLabelBoldLarge sx={{ mb: theme.spacing(description ? 1 : 3.8) }}>
          {title}
        </StyledLabelBoldLarge>
      )}
      {description && (
        <StyledTitleMedium color={variables.palette.on_surface} sx={{ mb: theme.spacing(1) }}>
          {description}
        </StyledTitleMedium>
      )}
      {children}
    </StyledFlexColumn>
  </StyledItemOptionContainer>
);

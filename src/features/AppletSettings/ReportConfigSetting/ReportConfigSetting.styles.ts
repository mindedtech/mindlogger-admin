import styled from '@emotion/styled/macro';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import {
  StyledFlexAllCenter,
  StyledClearedButton,
  StyledFlexColumn,
} from 'styles/styledComponents';

export const StyledForm = styled('form')`
  margin: ${theme.spacing(0, 6.4, 6.4, 0)};
`;

export const StyledContainer = styled(StyledFlexColumn)`
  width: 54.6rem;
`;

export const StyledSvg = styled(StyledFlexAllCenter)`
  width: 4rem;
  height: 4rem;
  border-radius: ${variables.borderRadius.half};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledButton = styled(StyledClearedButton)`
  justify-content: space-between;
  width: 18.6rem;
  color: ${variables.palette.on_surface};
  margin: ${theme.spacing(2.4, 0)};

  &.MuiButtonBase-root.MuiButton-root.MuiButton-text:hover {
    background-color: transparent;
  }

  &:hover {
    ${StyledSvg} {
      background-color: ${variables.palette.on_surface_alfa8};
    }
  }
`;

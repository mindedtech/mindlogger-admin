import styled from '@emotion/styled/macro';

import { variables, StyledFlexAllCenter, StyledClearedButton } from 'shared/styles';

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

  &.MuiButtonBase-root.MuiButton-root.MuiButton-text:hover {
    background-color: transparent;
  }

  &:hover {
    ${StyledSvg} {
      background-color: ${variables.palette.on_surface_alfa8};
    }
  }
`;

export const StyledLink = styled('a')`
  color: ${variables.palette.primary};
  text-decoration: none;
  transition: ${variables.transitions.opacity};

  &:hover {
    opacity: 0.8;
  }
`;

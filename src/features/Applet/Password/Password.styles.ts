import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledController = styled(Box)`
  margin-bottom: ${theme.spacing(2)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${variables.palette.surface3} inset;
  }
`;

export const StyledHint = styled(StyledBodyMedium, shouldForwardProp)`
  padding: ${theme.spacing(0.4, 1.6)};
  line-height: ${variables.font.lineHeight.sm};
  color: ${({ isError }: { isError?: boolean }) => isError && variables.palette.semantic.error};
`;

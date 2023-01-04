import { Box } from '@mui/material';
import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledReminder = styled(Box)`
  margin: ${theme.spacing(1, 0, 0, 1.1)};
  padding: ${theme.spacing(3, 3, 2.4, 1.6)};
  background-color: ${variables.palette.surface5};
  border-radius: ${variables.borderRadius.lg2};
  position: relative;
`;

export const StyledInputWrapper = styled(Box)`
  width: 50%;
  margin-right: ${theme.spacing(2)};
`;

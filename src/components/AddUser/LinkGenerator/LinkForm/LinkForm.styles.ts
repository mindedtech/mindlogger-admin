import { Button, TextField } from '@mui/material';
import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledButton = styled(Button)`
  background-color: transparent;
  color: ${variables.palette.primary};
  margin-right: ${theme.spacing(5)};
`;

export const StyledInput = styled(TextField)`
  margin: ${theme.spacing(2, 1, 2, 0)};
  width: 80rem;
`;

import { Box, Button, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledReviewer = styled(Box)`
  background-color: ${variables.palette.surface3};
  border-radius: ${variables.borderRadius.lg2};
  padding: ${theme.spacing(2.4)};
`;

export const StyledButton = styled(Button)`
  padding: 0;
  height: auto;
  min-width: unset;
`;

export const StyledItem = styled(Box)`
  margin: ${theme.spacing(3.2, 0)};

  &:last-of-type {
    margin-bottom: 0;
  }
`;

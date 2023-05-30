import { Button, styled } from '@mui/material';

import { EditorController } from 'shared/components/FormComponents';
import { StyledClearedButton, theme, variables } from 'shared/styles';

export const StyledButton = styled(Button)`
  width: 19.6rem;
  margin: ${theme.spacing(2.4, 0)};
  padding: ${theme.spacing(1.6)};
`;

export const StyledEditor = styled(EditorController)`
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledDuplicateButton = styled(StyledClearedButton)`
  svg {
    fill: ${variables.palette.primary};
  }
`;

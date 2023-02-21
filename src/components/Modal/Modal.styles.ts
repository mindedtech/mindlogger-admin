import { styled } from '@mui/system';
import { Button, DialogTitle, Dialog, DialogActions } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { FontWeight } from 'styles/styledComponents/Typography';
import { shouldForwardProp } from 'utils/shouldForwardProp';

import { ActionsAlign } from './Modal.types';

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: ${variables.palette.surface3};
    width: ${({ width }: { width?: string }) => (width ? `${width}rem` : 'auto')};
    max-width: 100rem;
  }
`;

export const StyledDialogTitle = styled(DialogTitle)`
  padding: ${theme.spacing(4.8, 2.4, 3.4)};
`;

export const StyledCloseButton = styled(StyledClearedButton)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  border-radius: ${variables.borderRadius.half};
  padding: 0.8rem;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledDialogActions = styled(DialogActions, shouldForwardProp)`
  justify-content: ${({ actionsAlign }: { actionsAlign: ActionsAlign }) => actionsAlign};
`;

export const StyledButton = styled(Button)`
  font-weight: ${({ fontWeight }: { fontWeight?: FontWeight }) =>
    fontWeight ? variables.font.weight[fontWeight] : variables.font.weight.bold};
  padding: ${theme.spacing(1.4, 3.4)};
`;

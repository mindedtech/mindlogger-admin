import { styled, DialogTitle, Dialog, DialogActions } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledClearedButton } from 'shared/styles/styledComponents/Buttons';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { ActionsAlign } from './Modal.types';

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    // Use the modalBackground variable to prevent unexpected styles for table headings inside modals.
    background-color: ${variables.modalBackground};
    width: ${({ width }: { width?: string; height?: string }) => (width ? `${width}rem` : 'auto')};
    max-width: 100rem;
    height: ${({ height }) => height || 'auto'};
    overflow-y: unset;
    padding: ${theme.spacing(2, 0)};
  }
`;

export const StyledDialogTitle = styled(DialogTitle)`
  && {
    padding: ${theme.spacing(2, 3.2, 3.4)};
  }
`;

export const StyledCloseButton = styled(StyledClearedButton)`
  position: absolute;
  top: 1.5rem;
  right: 3.2rem;
  border-radius: ${variables.borderRadius.half};
  padding: 0.8rem;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledDialogActions = styled(DialogActions, shouldForwardProp)`
  justify-content: ${({ actionsAlign }: { actionsAlign?: ActionsAlign }) =>
    actionsAlign || 'flex-start'};
  margin-top: auto;
  padding: ${theme.spacing(2.4, 3.2, 1.2)};
`;

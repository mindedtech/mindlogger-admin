import { Button, styled, Box } from '@mui/material';
import MdEditor from 'md-editor-rt';

import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledMdEditor = styled(MdEditor)`
  background-color: transparent;
  color: ${variables.palette.on_surface};
  font-size: ${variables.font.size.lrg};
  font-weight: normal;
  text-align: initial;
`;

export const StyledCollapsedContainer = styled(Box, shouldForwardProp)`
  overflow-y: hidden;

  max-height: ${({
    maxHeight,
    isOpen,
    isLarge,
  }: {
    maxHeight: number;
    isOpen: boolean;
    isLarge: boolean;
  }) => (!isOpen ? `${maxHeight}px` : 'unset')};
  border-bottom: ${({ isOpen, isLarge }) =>
    isLarge && !isOpen
      ? `${variables.borderWidth.md} solid ${variables.palette.outline_variant}`
      : 'unset'};
`;

export const StyledBtn = styled(Button)`
  margin-left: ${theme.spacing(-2)};

  &.MuiButton-text:hover {
    text-decoration-line: underline;
    background-color: unset;
  }
`;

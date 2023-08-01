import { styled } from '@mui/material';

import { theme } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';
import { StyledCounter as Counter } from 'shared/components/FormComponents/InputController/InputController.styles';

export const StyledCounter = styled(Counter, shouldForwardProp)`
  white-space: nowrap;

  .shortened-counter {
    display: none;
  }

  ${({ isShortenedVisible }: { isShortenedVisible?: boolean }) =>
    isShortenedVisible &&
    `
    ${theme.breakpoints.down('xl')} {
      .shortened-counter {
        display: inline;
       }
    
      .primary-counter {
        display: none;
      }
    }
  `}
`;

import { Button } from '@mui/material';
import { styled } from '@mui/system';

import { StyledFlexAllCenter } from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledButton = styled(Button)`
  margin: ${theme.spacing(-3.4, 3.2, 4, 0)};
  border: unset;
  background-color: ${variables.palette.secondary_container};
  color: ${variables.palette.black};
  padding: ${theme.spacing(1.4, 2.4)};

  &:hover {
    border: unset;
  }
`;

export const StyledContainer = styled(StyledFlexAllCenter)`
  justify-content: flex-end;
`;

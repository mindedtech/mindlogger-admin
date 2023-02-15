import { Box, styled } from '@mui/material';

import { StyledFlexAllCenter } from 'styles/styledComponents';
import theme from 'styles/theme';

export const StyledEmptyTable = styled(StyledFlexAllCenter)`
  flex-direction: column;
  width: 38.1rem;
  height: 100%;
  text-align: center;
  margin: 0 auto;
  padding: ${theme.spacing(6.4, 0)};
`;

export const StyledIcon = styled(Box)`
  margin-bottom: ${theme.spacing(1.6)};
`;

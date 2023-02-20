import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexAllCenter, StyledFlexColumn } from 'styles/styledComponents';

export const StyledAuthLayout = styled(StyledFlexColumn)`
  height: 100vh;
  margin: 0;
  overflow: auto;
`;

export const StyledHeader = styled(StyledFlexAllCenter)`
  position: sticky;
  top: 0;
  background-color: ${variables.palette.primary};
  padding: ${theme.spacing(1, 2.4)};
  z-index: ${theme.zIndex.fab};
`;

export const StyledOutlet = styled(Box)`
  display: flex;
  flex: 1;
`;

export const StyledAuthWrapper = styled(StyledFlexAllCenter)`
  height: 100%;
  width: 100%;
`;

export const StyledAuthWrapperInner = styled(Box)`
  width: 37.6rem;
  margin: ${theme.spacing(2.4, 0)};
`;

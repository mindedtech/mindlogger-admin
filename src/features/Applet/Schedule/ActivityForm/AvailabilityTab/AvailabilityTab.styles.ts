import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const StyledWrapper = styled(Box)`
  margin: ${theme.spacing(2.4, 0)};

  .MuiToggleButtonGroup-root .MuiToggleButton-root {
    width: 100%;
  }
`;

export const StyledButtonsTitle = styled(StyledBodyMedium)`
  margin-bottom: ${theme.spacing(1.2)};
`;

export const StyledTimeWrapper = styled(Box)`
  flex: 1;
`;

export const StyledTimeRow = styled(StyledFlexTopCenter)`
  justify-content: space-between;
`;

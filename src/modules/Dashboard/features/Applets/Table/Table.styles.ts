import { Box, styled, TableContainer } from '@mui/material';

import { variables, StyledFlexTopCenter } from 'shared/styles';

export const StyledTableContainer = styled(TableContainer)`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: ${variables.borderRadius.lg2};

  .MuiTableCell-head {
    background: ${variables.palette.surface};
  }

  && .MuiTableRow-root.dragged-over {
    .MuiTableCell-body {
      border-top: ${variables.borderWidth.lg} solid ${variables.palette.primary};
      border-bottom: ${variables.borderWidth.lg} solid ${variables.palette.primary};
    }

    .MuiTableCell-body:first-of-type {
      border-left: ${variables.borderWidth.lg} solid ${variables.palette.primary};
      border-top-left-radius: ${variables.borderRadius.xs} ${variables.borderRadius.xs};
      border-bottom-left-radius: ${variables.borderRadius.xs} ${variables.borderRadius.xs};
    }

    .MuiTableCell-body:last-of-type {
      border-right: ${variables.borderWidth.lg} solid ${variables.palette.primary};
      border-top-right-radius: ${variables.borderRadius.xs} ${variables.borderRadius.xs};
      border-bottom-right-radius: ${variables.borderRadius.xs} ${variables.borderRadius.xs};
    }
  }
`;

export const StyledTableCellContent = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

export const StyledCellItem = styled(StyledFlexTopCenter)`
  cursor: pointer;
`;

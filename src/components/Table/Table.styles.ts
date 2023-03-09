import { styled, TableContainer } from '@mui/material';

import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { variables } from 'styles/variables';
import { shouldForwardProp } from 'utils/shouldForwardProp';

import { UiType } from './Table.types';

export const StyledTableContainer = styled(TableContainer, shouldForwardProp)`
  height: 100%;
  max-height: ${({ maxHeight }: { maxHeight: string; uiType: UiType }) => maxHeight};

  ${({ uiType }) =>
    (uiType === UiType.Secondary || uiType === UiType.Tertiary) &&
    `
    border-color: ${variables.palette.outline_variant};
    
    & .MuiTableCell-root {
      background-color: transparent;
      border-color: ${variables.palette.outline_variant};
    }
    
    & .MuiTableBody-root .MuiTableRow-root:hover {
      background-color: transparent;
    }
  `}

  ${({ uiType }) =>
    uiType === UiType.Tertiary &&
    `
    & .MuiTableCell-root {
      cursor: default;
      font-size: ${variables.font.size.md};
      line-height: ${variables.font.lineHeight.md};
      letter-spacing: ${variables.font.letterSpacing.lg};
    }
  `}
`;

export const StyledTableCellContent = styled(StyledFlexTopCenter, shouldForwardProp)`
  justify-content: ${({ uiType }: { uiType: UiType }) =>
    uiType === UiType.Primary ? 'flex-end' : 'flex-start'};

  & .MuiTablePagination-displayedRows {
    color: ${({ uiType }) => uiType === UiType.Tertiary && variables.palette.outline};
  }
`;

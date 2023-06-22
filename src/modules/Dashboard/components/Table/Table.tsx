import { useState } from 'react';
import { Table as MuiTable, TableBody, TablePagination, TableRow } from '@mui/material';

import {
  DEFAULT_ROWS_PER_PAGE,
  EmptyState,
  TableHead,
  UiType,
  StyledTableCellContent,
  StyledTableContainer,
} from 'shared/components';

import { TableProps } from './Table.types';
import { StyledTableCell } from './Table.styles';

// TODO: make rows rendering more strict
export const Table = ({
  columns,
  rows,
  maxHeight = '100%',
  uiType = UiType.Primary,
  className = '',
  order,
  orderBy,
  emptyComponent,
  page,
  handleRequestSort,
  handleChangePage,
  count,
  rowsPerPage = DEFAULT_ROWS_PER_PAGE,
}: TableProps) => {
  const tableHeader = (
    <StyledTableCellContent uiType={uiType}>
      <TablePagination
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        labelRowsPerPage=""
        rowsPerPageOptions={[]}
      />
    </StyledTableCellContent>
  );
  const [hoveredRowIndex, setHoveredRowIndex] = useState(-1);

  return (
    <>
      <StyledTableContainer className={className} maxHeight={maxHeight} uiType={uiType}>
        {!!rows?.length && (
          <MuiTable stickyHeader>
            <TableHead
              headCells={columns}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              tableHeader={tableHeader}
              uiType={uiType}
            />
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={`row-${index}`}
                  onMouseEnter={() => setHoveredRowIndex(index)}
                  onMouseLeave={() => setHoveredRowIndex(-1)}
                >
                  {Object.keys(row)?.map((key) => (
                    <StyledTableCell
                      onClick={row[key].onClick}
                      scope="row"
                      key={key}
                      align={row[key].align}
                      width={row[key].width}
                    >
                      {row[key].content(row, hoveredRowIndex === index)}
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </MuiTable>
        )}
        {emptyComponent && <EmptyState>{emptyComponent}</EmptyState>}
      </StyledTableContainer>
      {uiType === UiType.Tertiary && tableHeader}
    </>
  );
};

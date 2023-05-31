import { ChangeEvent, MouseEvent, useState } from 'react';
import { Table as MuiTable, TableBody, TableCell, TablePagination, TableRow } from '@mui/material';

import { Order } from 'shared/types/table';
import { EmptyTable } from 'shared/components/EmptyTable';

import { TableHead } from './TableHead';
import { DEFAULT_ROWS_PER_PAGE, SEVEN_ROWS_PER_PAGE } from './Table.const';
import { StyledTableCellContent, StyledTableContainer } from './Table.styles';
import { Row, TableProps, UiType } from './Table.types';

// TODO: make rows rendering more strict
export const Table = ({
  columns,
  rows,
  orderBy: orderByProp,
  maxHeight = '100%',
  uiType = UiType.Primary,
  emptyComponent,
  className = '',
}: TableProps) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>(orderByProp);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    uiType === UiType.Tertiary || uiType === UiType.Quaternary
      ? SEVEN_ROWS_PER_PAGE
      : DEFAULT_ROWS_PER_PAGE,
  );

  function descendingComparator(a: Row, b: Row, orderBy: string) {
    if (b[orderBy]?.value < a[orderBy]?.value) {
      return -1;
    }
    if (b[orderBy]?.value > a[orderBy]?.value) {
      return 1;
    }

    return 0;
  }

  function getComparator(order: Order, orderBy: string): (a: Row, b: Row) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableHeader = (
    <StyledTableCellContent uiType={uiType}>
      <TablePagination
        component="div"
        count={rows?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage=""
        rowsPerPageOptions={[]}
      />
    </StyledTableCellContent>
  );

  return (
    <>
      <StyledTableContainer className={className} maxHeight={maxHeight} uiType={uiType}>
        {rows?.length ? (
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
              {rows
                ?.sort(getComparator(order, orderBy))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={`row-${index}`} data-testid="table-row">
                    {Object.keys(row)?.map((key) => (
                      <TableCell
                        onClick={row[key].onClick}
                        scope="row"
                        key={key}
                        align={row[key].align}
                        width={row[key].width}
                      >
                        {row[key].content(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </MuiTable>
        ) : (
          <EmptyTable>{emptyComponent}</EmptyTable>
        )}
      </StyledTableContainer>
      {uiType === UiType.Tertiary && tableHeader}
    </>
  );
};

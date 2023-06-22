import { Fragment } from 'react';
import { Table as MuiTable, TableBody, TablePagination } from '@mui/material';

import { DEFAULT_ROWS_PER_PAGE, EmptyState, TableHead } from 'shared/components';

import { Applet, Folder } from 'api';
import { StyledCellItem, StyledTableCellContent, StyledTableContainer } from './Table.styles';
import { TableProps } from './Table.types';
import { FolderItem } from './FolderItem';
import { AppletItem } from './AppletItem';

export const Table = ({
  columns,
  rows,
  order,
  orderBy,
  headerContent,
  emptyComponent,
  page,
  count,
  handleRequestSort,
  handleChangePage,
  handleReload,
}: TableProps) => {
  const tableHeader = (
    <StyledTableCellContent>
      {headerContent && <StyledCellItem>{headerContent}</StyledCellItem>}
      <StyledCellItem>
        <TablePagination
          component="div"
          count={count}
          rowsPerPage={DEFAULT_ROWS_PER_PAGE}
          page={page - 1}
          onPageChange={handleChangePage}
          labelRowsPerPage=""
          rowsPerPageOptions={[]}
        />
      </StyledCellItem>
    </StyledTableCellContent>
  );

  const getRowComponent = (row: Folder | Applet) =>
    row?.isFolder ? (
      <FolderItem item={row as Folder} />
    ) : (
      <AppletItem item={row as Applet} onPublish={handleReload} />
    );

  const getEmptyTable = () => <EmptyState>{emptyComponent}</EmptyState>;

  return (
    <StyledTableContainer>
      {!!rows?.length && (
        <MuiTable stickyHeader>
          <TableHead
            headCells={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            tableHeader={tableHeader}
          />
          <TableBody>
            {rows.map((row) => (
              <Fragment key={row.id}>{getRowComponent(row)}</Fragment>
            ))}
          </TableBody>
        </MuiTable>
      )}
      {emptyComponent && getEmptyTable()}
    </StyledTableContainer>
  );
};

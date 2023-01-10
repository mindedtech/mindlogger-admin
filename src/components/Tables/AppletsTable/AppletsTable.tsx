import { useEffect, useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { useAppDispatch } from 'redux/store';
import { auth, FolderApplet, folders } from 'redux/modules';
import { Menu, Search, Svg } from 'components';

import { Table } from './Table/Table';
import { getHeadCells, getMenuItems } from './AppletsTable.const';
import { StyledButtons, AppletsTableHeader } from './AppletsTable.styles';
import { generateNewFolderName } from './AppletsTable.utils';

export const AppletsTable = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const foldersApplets: FolderApplet[] = folders.useFlattenFoldersApplets();
  const authData = auth.useData();

  const [searchValue, setSearchValue] = useState('');
  const [flattenItems, setFlattenItems] = useState<FolderApplet[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    setFlattenItems(foldersApplets);
  }, [foldersApplets]);

  const addFolder = () => {
    const newFolderName = generateNewFolderName(foldersApplets, t);
    const folder = {
      id: (Math.random() + Math.random()).toString(),
      name: newFolderName,
      isFolder: true,
      description: '',
      isExpanded: false,
      items: [],
      roles: [],
      isNew: true,
      isRenaming: true,
      isVisible: true,
      depth: 0,
      parentId: authData?.user?.['_id'] || '',
    };
    dispatch(folders.actions.createNewFolder(folder));
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filterRows = (row: FolderApplet) => {
    if (!row.isVisible) return;
    if (!searchValue) {
      return row;
    }
    if (!row?.isFolder && row?.name?.toLowerCase().includes(searchValue?.toLowerCase())) {
      return row;
    } else {
      let isFolderContainsSearchApplet = false;

      row?.items?.forEach((itemInFolder) => {
        if (itemInFolder?.name?.toLowerCase().includes(searchValue.toLowerCase())) {
          isFolderContainsSearchApplet = true;
        }
      });

      if (isFolderContainsSearchApplet) {
        return row;
      }
    }
  };

  const headerContent = (
    <Box onClick={() => addFolder()}>
      <Svg id="add-folder" />
    </Box>
  );

  const handleAddAppletClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <AppletsTableHeader>
        <StyledButtons>
          <Button
            variant="outlined"
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            startIcon={<Svg width="18" height="18" id="applet-outlined" />}
            endIcon={<Svg id={openMenu ? 'navigate-up' : 'navigate-down'} width="9" height="9" />}
            onClick={handleAddAppletClick}
          >
            {t('addApplet')}
          </Button>
        </StyledButtons>
        <Menu
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          menuItems={getMenuItems(handleMenuClose)}
        />
        <Search placeholder={t('searchApplets')} onSearch={handleSearch} />
      </AppletsTableHeader>
      <Table
        columns={getHeadCells()}
        rows={flattenItems?.filter(filterRows)}
        orderBy="updated"
        headerContent={headerContent}
      />
    </>
  );
};

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg } from 'components/Svg';
import { AddUser } from 'components/AddUser';
import { useBreadcrumbs } from 'hooks';
import { appletPages } from 'utils/constants';
import { Box } from '@mui/system';

export const More = () => {
  const { id } = useParams();
  const history = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('app');
  const [activeAddUser, setActiveAddUser] = useState(false);

  useBreadcrumbs([
    {
      icon: <Svg id="dots-filled" width="15" height="15" />,
      label: t('more'),
    },
  ]);

  const handleAddUserClick = () => {
    setActiveAddUser(true);
    history(`/${id}/${appletPages.addUser}`);
  };

  useEffect(() => {
    const { pathname } = location;
    setActiveAddUser(pathname.includes(appletPages.addUser));
  }, [location]);

  return !activeAddUser ? (
    <Box>
      <Button variant="contained" onClick={handleAddUserClick}>
        Add Users
      </Button>
    </Box>
  ) : (
    <AddUser />
  );
};

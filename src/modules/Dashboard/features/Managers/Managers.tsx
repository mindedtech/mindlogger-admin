import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateManagersPinApi } from 'api';
import { Actions, DEFAULT_ROWS_PER_PAGE, Pin, Search } from 'shared/components';
import { users, workspaces, Manager } from 'redux/modules';
import { useAsync, useBreadcrumbs, usePermissions, useTable } from 'shared/hooks';
import { Table } from 'modules/Dashboard/components';
import { useAppDispatch } from 'redux/store';
import { isManagerOrOwner, joinWihComma } from 'shared/utils';

import { ManagersRemoveAccessPopup, EditAccessPopup } from './Popups';
import { ManagersTableHeader } from './Managers.styles';
import { getActions, getHeadCells } from './Managers.const';

export const Managers = () => {
  const { appletId } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  useBreadcrumbs([
    {
      icon: 'manager-outlined',
      label: t('managers'),
    },
  ]);
  const rolesData = workspaces.useRolesData();
  const { ownerId } = workspaces.useData() || {};
  const managersData = users.useManagersData();
  const { getWorkspaceManagers } = users.thunk;

  const { isForbidden, noPermissionsComponent } = usePermissions(() =>
    dispatch(
      getWorkspaceManagers({
        params: {
          ownerId,
          limit: DEFAULT_ROWS_PER_PAGE,
          ...(appletId && { appletId }),
        },
      }),
    ),
  );

  const { searchValue, handleSearch, handleReload, ...tableProps } = useTable((args) => {
    const params = {
      ...args,
      params: {
        ...args.params,
        ...(appletId && { appletId }),
      },
    };

    return dispatch(getWorkspaceManagers(params));
  });

  const filterAplletsByRoles = (user: Manager) => ({
    ...user,
    applets: user.applets.filter((applet) => {
      const workspaceUserRole = rolesData?.data?.[applet.id][0];
      const withoutManagerOrOwner = !applet.roles?.some(({ role }) => isManagerOrOwner(role));

      return isManagerOrOwner(workspaceUserRole) && withoutManagerOrOwner;
    }),
  });

  const [editAccessPopupVisible, setEditAccessPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  const { execute } = useAsync(updateManagersPinApi, handleReload);

  const actions = {
    removeAccessAction: (user: Manager) => {
      setSelectedManager(filterAplletsByRoles(user));
      setRemoveAccessPopupVisible(true);
    },
    editAccessAction: (user: Manager) => {
      setSelectedManager(filterAplletsByRoles(user));
      setEditAccessPopupVisible(true);
    },
  };

  const handlePinClick = (userId: string) => {
    execute({ ownerId, userId });
  };

  const rows = managersData?.result?.map((user) => {
    const { email, firstName, lastName, roles, isPinned, id } = user;
    const stringRoles = joinWihComma(roles);

    return {
      pin: {
        content: () => <Pin isPinned={isPinned} />,
        value: '',
        onClick: () => handlePinClick(id),
      },
      firstName: {
        content: () => firstName,
        value: firstName,
      },
      lastName: {
        content: () => lastName,
        value: lastName,
      },
      email: {
        content: () => email,
        value: email,
      },
      ...(appletId && {
        roles: {
          content: () => stringRoles,
          value: stringRoles,
        },
      }),
      actions: {
        content: () => {
          if (ownerId === id) {
            return;
          }

          return <Actions items={getActions(actions)} context={user} />;
        },
        value: '',
        width: '20%',
      },
    };
  });

  const renderEmptyComponent = () => {
    if (rows && !rows?.length) {
      return appletId ? t('noManagersForApplet') : t('noManagers');
    }

    return searchValue && t('noMatchWasFound', { searchValue });
  };

  if (isForbidden) return noPermissionsComponent;

  return (
    <>
      <ManagersTableHeader>
        <Search placeholder={t('searchManagers')} onSearch={handleSearch} />
      </ManagersTableHeader>
      <Table
        columns={getHeadCells(appletId)}
        rows={rows}
        emptyComponent={renderEmptyComponent()}
        count={managersData?.count || 0}
        {...tableProps}
      />
      {removeAccessPopupVisible && selectedManager && (
        <ManagersRemoveAccessPopup
          removeAccessPopupVisible={removeAccessPopupVisible}
          onClose={() => setRemoveAccessPopupVisible(false)}
          user={selectedManager}
          refetchManagers={handleReload}
        />
      )}
      {editAccessPopupVisible && selectedManager && (
        <EditAccessPopup
          editAccessPopupVisible={editAccessPopupVisible}
          onClose={() => setEditAccessPopupVisible(false)}
          user={selectedManager}
          refetchManagers={handleReload}
        />
      )}
    </>
  );
};

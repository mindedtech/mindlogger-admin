import i18n from 'i18n';
import { Svg } from 'shared/components';
import { HeadCell } from 'shared/types/table';

import { ManagersActions } from './Managers.types';

export const getHeadCells = (id?: string): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'firstName',
      label: t('firstName'),
      enableSort: true,
    },
    {
      id: 'lastName',
      label: t('lastName'),
      enableSort: true,
    },
    {
      id: 'email',
      label: t('email'),
      enableSort: true,
    },
    ...(id
      ? [
          {
            id: 'roles',
            label: t('roles'),
            enableSort: true,
          },
        ]
      : []),
    {
      id: 'actions',
      label: t('actions'),
    },
  ];
};

export const getActions = (
  id: string | undefined,
  { removeAccessAction, editAccessAction }: ManagersActions,
) => {
  const { t } = i18n;

  return id
    ? []
    : [
        {
          icon: <Svg id="remove-access" />,
          action: removeAccessAction,
          tooltipTitle: t('removeAccess'),
        },
        {
          icon: <Svg id="edit-user" />,
          action: editAccessAction,
          tooltipTitle: t('editAccess'),
        },
      ];
};

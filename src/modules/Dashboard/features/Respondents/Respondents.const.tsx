import { t } from 'i18next';

import { HeadCell } from 'shared/types';

export const headCells: HeadCell[] = [
  {
    id: 'pin',
    label: '',
    enableSort: true,
    width: '4.8rem',
  },
  {
    id: 'secretId',
    label: t('secretUserId'),
    enableSort: true,
  },
  {
    id: 'nickname',
    label: t('nickname'),
    enableSort: true,
  },
  {
    id: 'latestActive',
    label: t('latestActive'),
    enableSort: true,
  },
  {
    id: 'actions',
    label: t('actions'),
  },
];

import { t } from 'i18next';

import { ItemResponseType } from 'shared/consts';

import { UNSUPPORTED_ITEMS } from './consts';

export const isItemUnsupported = (type: ItemResponseType) => UNSUPPORTED_ITEMS.includes(type);

export const getRespondentLabel = (secretId: string | undefined, nickname: string | undefined) =>
  secretId ? `${t('user')}: ${secretId} (${nickname})` : '';

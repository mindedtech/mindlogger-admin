import i18n from 'i18next';

import { Svg } from 'shared/components';
import { ItemFormValues } from 'modules/Builder/pages';
import { ItemResponseType } from 'shared/consts';

import { ActivitySettingsOptionsItems } from './ActivitySettings.types';

const { t } = i18n;

export const getSettings = () => [
  {
    label: 'reports',
    items: [
      {
        name: ActivitySettingsOptionsItems.ScoresAndReports,
        title: t('scoresAndReports'),
        icon: <Svg id="scores-and-reports" />,
        path: 'scores-and-reports',
      },
    ],
  },
  {
    label: 'subscales',
    items: [
      {
        name: ActivitySettingsOptionsItems.SubscalesConfiguration,
        title: t('subscalesConfiguration'),
        icon: <Svg id="grid-outlined" />,
        path: 'subscales-configuration',
      },
    ],
  },
];

export const getSetting = (settingPath?: string) => {
  const settings = getSettings();
  const group = settings.find(({ items }) => items.find(({ path }) => path === settingPath));

  return group?.items.find(({ path }) => path === settingPath) || null;
};

export const checkOnItemType = (item: ItemFormValues) =>
  [
    ItemResponseType.SingleSelection,
    ItemResponseType.MultipleSelection,
    ItemResponseType.Slider,
  ].includes(item.responseType as ItemResponseType);

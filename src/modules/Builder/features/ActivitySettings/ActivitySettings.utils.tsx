import { Svg } from 'shared/components/Svg';
import { ActivityFormValues, ItemFormValues } from 'modules/Builder/types';
import { ItemResponseType } from 'shared/consts';
import { Item, SingleAndMultipleSelectionConfig, SliderConfig } from 'shared/state';
import { ReportConfigSetting } from 'shared/features/AppletSettings';
import { SettingParam } from 'shared/utils';

import { SubscalesConfiguration } from './SubscalesConfiguration';
import { ScoresAndReports } from './ScoresAndReports';

export const getSettings = (activityFieldName?: string, activity?: ActivityFormValues) => {
  const isNewActivity = !activity?.id;
  const dataTestid = 'builder-activity-settings';

  return [
    {
      label: 'reports',
      items: [
        {
          label: 'scoresAndReports',
          icon: <Svg id="scores-and-reports" />,
          component: <ScoresAndReports />,
          param: SettingParam.ScoresAndReports,
          'data-testid': `${dataTestid}-scores-and-reports`,
        },
        {
          label: 'reportConfiguration',
          icon: <Svg id="configure" />,
          component: <ReportConfigSetting data-testid={`${dataTestid}-report-config-form`} />,
          param: SettingParam.ReportConfiguration,
          disabled: isNewActivity,
          tooltip: isNewActivity ? 'saveAndPublishFirst' : undefined,
          'data-testid': `${dataTestid}-report-config`,
        },
      ],
    },
    {
      label: 'subscales',
      items: [
        {
          label: 'subscalesConfiguration',
          icon: <Svg id="grid-outlined" />,
          component: (
            <SubscalesConfiguration key={`subscales-configuration-${activityFieldName}`} />
          ),
          param: SettingParam.SubscalesConfiguration,
          'data-testid': `${dataTestid}-subscales-config`,
        },
      ],
    },
  ];
};

export const checkOnItemTypeAndScore = (item: ItemFormValues | Item) =>
  (item.config as SingleAndMultipleSelectionConfig | SliderConfig).addScores &&
  [
    ItemResponseType.SingleSelection,
    ItemResponseType.MultipleSelection,
    ItemResponseType.Slider,
  ].includes(item.responseType as ItemResponseType);

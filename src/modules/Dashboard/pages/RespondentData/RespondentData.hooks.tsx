import { generatePath, useParams } from 'react-router-dom';

import { Svg } from 'shared/components';
import { page } from 'resources';

export const useRespondentDataTabs = () => {
  const { appletId, respondentId } = useParams();

  return [
    {
      labelKey: 'summary',
      icon: <Svg id="chart" />,
      activeIcon: <Svg id="chart" />,
      path: generatePath(page.appletRespondentDataSummary, {
        appletId,
        respondentId,
      }),
      'data-testid': 'respondents-summary-tab-summary',
    },
    {
      labelKey: 'review',
      icon: <Svg id="checkbox-outlined" />,
      activeIcon: <Svg id="checkbox-filled" />,
      path: generatePath(page.appletRespondentDataReview, {
        appletId,
        respondentId,
      }),
      'data-testid': 'respondents-summary-tab-review',
    },
  ];
};

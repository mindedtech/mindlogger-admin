import { Svg } from 'shared/components';
import { ActivityFlowFormValues } from 'modules/Builder/pages';

import { GetActivityFlowActions } from './ActivityFlow.types';

export const getFlowsItemActions = ({
  activityFlowIndex,
  activityFlowId,
  activityFlowHidden,
  removeActivityFlow,
  editActivityFlow,
  duplicateActivityFlow,
  toggleActivityFlowVisibility,
}: GetActivityFlowActions) => [
  {
    icon: <Svg id="edit" />,
    action: () => editActivityFlow(activityFlowId),
  },
  {
    icon: <Svg id="duplicate" />,
    action: () => duplicateActivityFlow(activityFlowIndex),
  },
  {
    icon: <Svg id={activityFlowHidden ? 'visibility-off' : 'visibility-on'} />,
    action: () => toggleActivityFlowVisibility(activityFlowIndex),
    isStatic: activityFlowHidden,
  },
  {
    icon: <Svg id="trash" />,
    action: removeActivityFlow,
  },
];

export const getActivityFlowKey = (flow: ActivityFlowFormValues) => flow.id ?? flow.key ?? '';

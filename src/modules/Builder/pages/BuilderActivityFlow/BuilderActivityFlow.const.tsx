import { Svg } from 'shared/components';
import { page } from 'resources';

export const newActivityFlowTabs = [
  {
    labelKey: 'aboutActivityFlow',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: page.builderAppletNewActivityFlowAbout,
  },
  {
    labelKey: 'activityFlowBuilder',
    icon: <Svg id="checklist-outlined" />,
    activeIcon: <Svg id="checklist-filled" />,
    path: page.builderAppletNewActivityFlowBuilder,
  },
];

import { useParams } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { APPLET_PAGES } from 'consts';

export const useAppletTabs = () => {
  const { id } = useParams();
  const { respondents, managers, addUser, settings, schedule } = APPLET_PAGES;

  return [
    {
      labelKey: 'respondents',
      icon: <Svg id="respondent-outlined" />,
      activeIcon: <Svg id="respondent-filled" />,
      path: `/${id}/${respondents}`,
    },
    {
      labelKey: 'managers',
      icon: <Svg id="manager-outlined" />,
      activeIcon: <Svg id="manager-filled" />,
      path: `/${id}/${managers}`,
    },
    {
      labelKey: 'addUsers',
      icon: <Svg id="add-users-outlined" />,
      activeIcon: <Svg id="add-users-filled" />,
      isMinHeightAuto: true,
      path: `/${id}/${addUser}`,
    },
    {
      labelKey: 'generalSchedule',
      icon: <Svg id="schedule-outlined" />,
      activeIcon: <Svg id="schedule-filled" />,
      path: `/${id}/${schedule}`,
    },
    {
      labelKey: 'appletSettings',
      icon: <Svg id="settings" />,
      activeIcon: <Svg id="settings" />,
      path: `/${id}/${settings}`,
    },
  ];
};

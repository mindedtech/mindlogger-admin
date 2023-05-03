import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { LinkedTabs } from 'shared/components';
import { StyledBody } from 'shared/styles';
import { applets, calendarEvents } from 'modules/Dashboard/state';
import { applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';

import { useAppletTabs } from './Applet.hooks';

export const Applet = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const appletTabs = useAppletTabs();
  const { appletId } = useParams();

  const hiddenHeader = location.pathname.includes('dataviz');

  useEffect(() => {
    if (!appletId) return;

    const { getApplet } = applet.thunk;
    const { getEvents } = applets.thunk;

    dispatch(getApplet({ appletId }));
    dispatch(getEvents({ appletId }));

    return () => {
      dispatch(applets.actions.resetEventsData());
      dispatch(calendarEvents.actions.resetCalendarEvents());
    };
  }, [appletId]);

  return (
    <StyledBody>
      <LinkedTabs hiddenHeader={hiddenHeader} tabs={appletTabs} />
    </StyledBody>
  );
};

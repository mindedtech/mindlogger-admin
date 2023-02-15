import { useEffect, useMemo, useState } from 'react';
import {
  Calendar as ReactCalendar,
  dateFnsLocalizer,
  Formats,
  SlotInfo,
  View,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

import i18n from 'i18n';
import { Svg } from 'components';

import { CreateActivityPopup } from '../CreateActivityPopup';
import { EditActivityPopup } from '../EditActivityPopup';
import {
  eventPropGetter,
  getCalendarComponents,
  getProcessedEvents,
  hiddenEventsIds,
  getHasWrapperMoreBtn,
} from './Calendar.utils';
import { StyledAddBtn, StyledCalendarWrapper } from './Calendar.styles';
import { AllDayEventsVisible, CalendarEvent, CalendarViews, OnViewFunc } from './Calendar.types';

const locales = {
  'en-US': enUS,
  fr,
};

const dateFnsLocalize = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export const Calendar = () => {
  const [activeView, setActiveView] = useState<CalendarViews>(CalendarViews.Month);
  const [date, setDate] = useState<Date>(new Date());
  const processedEvents = useMemo(() => getProcessedEvents(date), [date]);
  const [events, setEvents] = useState<CalendarEvent[]>(processedEvents);
  const [createActivityPopupVisible, setCreateActivityPopupVisible] = useState(false);
  const [editActivityPopupVisible, setEditActivityPopupVisible] = useState(false);
  const [isAllDayEventsVisible, setIsAllDayEventsVisible] = useState<AllDayEventsVisible>(null);

  const { components, messages, views, formats } = getCalendarComponents(
    activeView,
    setActiveView,
    date,
    setDate,
    events,
    setEvents,
    isAllDayEventsVisible,
    setIsAllDayEventsVisible,
  );

  const onNavigate = (newDate: Date) => setDate(newDate);

  const handleAddClick = () => setCreateActivityPopupVisible(true);

  const onSelectSlot = (slotInfo: SlotInfo) => {
    console.log('on select slot', slotInfo);
    setCreateActivityPopupVisible(true);
  };

  const onSelectEvent = (event: CalendarEvent) => {
    console.log('on select event', event);
    setEditActivityPopupVisible(true);
  };

  useEffect(() => {
    setIsAllDayEventsVisible(null);
    setEvents((prevState) =>
      prevState.map((event) => ({
        ...event,
        isHiddenInTimeView: hiddenEventsIds.some((id) => id === event.id),
      })),
    );
  }, [date, activeView]);

  const hasWrapperMoreBtn = useMemo(
    () =>
      (activeView === CalendarViews.Week || activeView === CalendarViews.Day) &&
      getHasWrapperMoreBtn(activeView, events, date, isAllDayEventsVisible),
    [activeView, events, date, isAllDayEventsVisible],
  );

  return (
    <>
      <StyledCalendarWrapper hasMoreBtn={hasWrapperMoreBtn} className={activeView}>
        <ReactCalendar
          date={date}
          onNavigate={onNavigate}
          localizer={dateFnsLocalize}
          culture={i18n.language}
          events={events}
          startAccessor="start"
          endAccessor="end"
          components={components}
          views={views}
          selectable={true}
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          eventPropGetter={(event) => eventPropGetter(event, activeView)}
          view={activeView as View}
          onView={setActiveView as OnViewFunc}
          messages={messages}
          scrollToTime={new Date(date.setHours(3, 56))}
          formats={formats as Formats}
          dayLayoutAlgorithm="no-overlap"
        />
        <StyledAddBtn onClick={handleAddClick}>
          <Svg id="add" />
        </StyledAddBtn>
      </StyledCalendarWrapper>
      {createActivityPopupVisible && (
        <CreateActivityPopup
          open={createActivityPopupVisible}
          setCreateActivityPopupVisible={setCreateActivityPopupVisible}
          activityName="Daily Journal"
        />
      )}
      <EditActivityPopup
        open={editActivityPopupVisible}
        activityName="Daily Journal"
        setEditActivityPopupVisible={setEditActivityPopupVisible}
      />
    </>
  );
};

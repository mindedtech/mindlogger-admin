import { useState } from 'react';
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
import { mockedEvents } from './Calendar.const';
import { getCalendarComponents, getEventsWithOffRange, eventPropGetter } from './Calendar.utils';
import { StyledAddBtn, StyledCalendarWrapper } from './Calendar.styles';
import { CalendarEvent, CalendarViews, OnViewFunc } from './Calendar.types';

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
  const [createActivityPopupVisible, setCreateActivityPopupVisible] = useState(false);
  const [editActivityPopupVisible, setEditActivityPopupVisible] = useState(false);

  const events = getEventsWithOffRange(mockedEvents, date);

  const { components, messages, views, formats } = getCalendarComponents(
    activeView,
    setActiveView,
    date,
    setDate,
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

  return (
    <>
      <StyledCalendarWrapper>
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
      <CreateActivityPopup
        open={createActivityPopupVisible}
        setCreateActivityPopupVisible={setCreateActivityPopupVisible}
        activityName="Daily Journal"
      />
      <EditActivityPopup
        open={editActivityPopupVisible}
        onClose={() => setEditActivityPopupVisible(false)}
        activityName="Daily Journal"
        setEditActivityPopupVisible={setEditActivityPopupVisible}
      />
    </>
  );
};

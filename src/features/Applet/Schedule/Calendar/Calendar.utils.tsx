import { Dispatch, SetStateAction } from 'react';
import {
  Culture,
  DateLocalizer,
  DateRange,
  EventProps,
  HeaderProps,
  ToolbarProps,
} from 'react-big-calendar';
import { format } from 'date-fns';

import { Svg } from 'components';
import i18n from 'i18n';
import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledLabelBoldMedium } from 'styles/styledComponents/Typography';
import { DateFormats } from 'consts';

import { UiType } from './Event/Event.types';
import { Toolbar } from './Toolbar';
import { MonthHeader } from './MonthHeader';
import { Event } from './Event';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import { CalendarEvent, CalendarViews } from './Calendar.types';
import { StyledTimeHeaderGutter } from './Calendar.styles';

const { t } = i18n;

export const formatToYearMonthDate = (date?: Date) =>
  date && format(date, DateFormats.DayMonthYear);

export const getCalendarComponents = (
  activeView: string,
  setActiveView: Dispatch<SetStateAction<CalendarViews>>,
  date: Date,
  setDate: Dispatch<SetStateAction<Date>>,
) => ({
  components: {
    toolbar: (props: ToolbarProps) => (
      <Toolbar {...props} activeView={activeView} setActiveView={setActiveView} />
    ),
    month: {
      header: (props: HeaderProps) => <MonthHeader {...props} calendarDate={date} />,
      event: Event,
    },
    day: {
      event: (props: EventProps<CalendarEvent>) => <Event {...props} uiType={UiType.Secondary} />,
    },
    timeGutterHeader: () => (
      <StyledTimeHeaderGutter>
        <Svg id="navigate-right" width="19" height="19" />
        <StyledLabelBoldMedium sx={{ ml: theme.spacing(0.7) }} color={variables.palette.outline}>
          {t('allDay')}
        </StyledLabelBoldMedium>
      </StyledTimeHeaderGutter>
    ),
    date,
    setDate,
    activeView,
    setActiveView,
  },
  messages: {
    showMore: (total: number) => `${total} ${t('more').toLowerCase()}...`,
  },
  views: {
    month: MonthView,
    day: true,
    week: true,
    year: YearView,
  },
  formats: {
    dayHeaderFormat: (date: Date, culture?: Culture, localizer?: DateLocalizer) =>
      localizer?.format(date, DateFormats.FullWeekDayFullMonthYear, culture),
    dayRangeHeaderFormat: (range: DateRange, culture?: Culture, localizer?: DateLocalizer) =>
      `${localizer?.format(range.start, DateFormats.DayFullMonth, culture)} - ${localizer?.format(
        range.end,
        DateFormats.DayFullMonthYear,
        culture,
      )}`,
    timeGutterFormat: (date: Date, culture?: Culture, localizer?: DateLocalizer) =>
      localizer?.format(date, DateFormats.Time, culture),
  },
});

export const eventPropGetter = (event: CalendarEvent, activeView: CalendarViews) => {
  const isAllDayEvent = event.allDayEvent || event.alwaysAvailable;
  const isDayWeekView = activeView === CalendarViews.Day || activeView === CalendarViews.Week;
  const isScheduledDayWeekEvent = isDayWeekView && !isAllDayEvent;

  return {
    style: {
      padding: isScheduledDayWeekEvent ? theme.spacing(0.2, 0.8) : theme.spacing(0.2, 0.4),
      borderRadius: isScheduledDayWeekEvent ? variables.borderRadius.md : variables.borderRadius.xs,
      borderWidth: `0 0 0 ${isScheduledDayWeekEvent ? variables.borderWidth.xl : 0}`,
      borderColor: isScheduledDayWeekEvent ? event.scheduledColor : 'transparent',
      backgroundColor:
        (isScheduledDayWeekEvent && event.scheduledBackground) || event.backgroundColor,
      color: event.alwaysAvailable ? variables.palette.white : variables.palette.on_surface,
      ...(event.isOffRange && { opacity: '0.38' }),
    },
  };
};

export const getEventsWithOffRange = (events: CalendarEvent[], date: Date) =>
  events.map((event) => ({
    ...event,
    isOffRange: event.start.getMonth() !== date.getMonth(),
  }));

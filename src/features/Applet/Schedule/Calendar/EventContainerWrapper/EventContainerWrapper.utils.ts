import {
  EventsWidthBreakpoints,
  EventStartEndDates,
  EventInterval,
  EventsHeightBreakpoints,
} from './EventContainerWrapper.types';
import {
  MAX_VISIBLE_EVENTS_WEEK_VIEW,
  MAX_VISIBLE_EVENTS_DAY_VIEW,
  LEFT_OFFSET_COEFFICIENT_WEEK_VIEW,
  LEFT_OFFSET_COEFFICIENT_DAY_VIEW,
  LEFT_START_VAL_WEEK_VIEW,
  LEFT_START_VAL_DAY_VIEW,
  VALUE_DECREASING_CONTAINER_WIDTH_WEEK_VIEW,
  VALUE_DECREASING_CONTAINER_WIDTH_DAY_VIEW,
} from './EventContainerWrapper.const';

export const getVariables = (isWeekView: boolean) => {
  const VISIBLE_EVENTS_QUANTITY = isWeekView
    ? MAX_VISIBLE_EVENTS_WEEK_VIEW
    : MAX_VISIBLE_EVENTS_DAY_VIEW;
  const ALL_COL_QUANTITY = VISIBLE_EVENTS_QUANTITY + 1;
  const INDEX_SHOW_MORE_BTN = VISIBLE_EVENTS_QUANTITY - 1;
  const LEFT_OFFSET_COEFFICIENT = isWeekView
    ? LEFT_OFFSET_COEFFICIENT_WEEK_VIEW
    : LEFT_OFFSET_COEFFICIENT_DAY_VIEW;
  const LEFT_OFFSET_START_VAL = isWeekView ? LEFT_START_VAL_WEEK_VIEW : LEFT_START_VAL_DAY_VIEW;
  const VALUE_DECREASING_FULL_CONTAINER_WIDTH = isWeekView
    ? VALUE_DECREASING_CONTAINER_WIDTH_WEEK_VIEW
    : VALUE_DECREASING_CONTAINER_WIDTH_DAY_VIEW;

  return {
    VISIBLE_EVENTS_QUANTITY,
    ALL_COL_QUANTITY,
    INDEX_SHOW_MORE_BTN,
    LEFT_OFFSET_COEFFICIENT,
    LEFT_OFFSET_START_VAL,
    VALUE_DECREASING_FULL_CONTAINER_WIDTH,
  };
};

export const getEventClassNames = (width: number, height: number) => {
  let widthClassName = 'w-xl';
  let heightClassName = 'h-lg';

  if (width <= EventsWidthBreakpoints.Lg) {
    widthClassName = 'w-lg';
  }
  if (width <= EventsWidthBreakpoints.Md) {
    widthClassName = 'w-md';
  }
  if (width <= EventsWidthBreakpoints.Sm) {
    widthClassName = 'w-sm';
  }
  if (height <= EventsHeightBreakpoints.Md) {
    heightClassName = 'h-md';
  }
  if (height <= EventsHeightBreakpoints.Sm) {
    heightClassName = 'h-sm';
  }

  return [widthClassName, heightClassName];
};

export const getOverlappingEvents = (eventsArr: EventStartEndDates[]): EventInterval[] => {
  const intervals: EventInterval[] = [];
  for (const currEvent of eventsArr) {
    const currEventStart = new Date(currEvent.start).getTime();
    const currEventEnd = new Date(currEvent.end).getTime();
    let overlappingInterval: EventInterval | undefined;

    for (const interval of intervals) {
      if (currEventStart <= interval.intervalEnd && currEventEnd >= interval.intervalStart) {
        overlappingInterval = interval;
        break;
      }
    }

    if (overlappingInterval) {
      overlappingInterval.intervalStart = Math.min(
        currEventStart,
        overlappingInterval.intervalStart,
      );
      overlappingInterval.intervalEnd = Math.max(currEventEnd, overlappingInterval.intervalEnd);
      overlappingInterval.eventIds.push(currEvent.id);
    } else {
      intervals.push({
        intervalStart: currEventStart,
        intervalEnd: currEventEnd,
        eventIds: [currEvent.id],
      });
    }
  }

  return intervals.filter((interval) => interval.eventIds.length > MAX_VISIBLE_EVENTS_WEEK_VIEW);
};

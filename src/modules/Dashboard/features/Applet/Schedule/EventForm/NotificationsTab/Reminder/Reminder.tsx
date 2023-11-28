import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { addDays, getDate } from 'date-fns';

import { DatePicker, TimePicker } from 'shared/components';
import { ArrowPressType, InputController } from 'shared/components/FormComponents';
import { StyledBodyMedium, StyledFlexTopStart, StyledLabelLarge, theme } from 'shared/styles';
import { Periodicity } from 'modules/Dashboard/api';
import {
  getDaysInMonthlyPeriodicity,
  getNextDayComparison,
} from 'modules/Dashboard/state/CalendarEvents/CalendarEvents.utils';
import { SelectEvent } from 'shared/types';

import { EventFormValues } from '../../EventForm.types';
import { getDaysInPeriod, getWeeklyDays } from '../../EventForm.utils';
import { DEFAULT_ACTIVITY_INCOMPLETE_VALUE } from '../../EventForm.const';
import { Header } from '../Header';
import { StyledColInner, StyledNotificationWrapper } from '../NotificationsTab.styles';
import { StyledInputWrapper, StyledReminder } from './Reminder.styles';
import { findClosestValues } from './Reminder.utils';
import { ReminderProps } from './Reminder.types';

export const Reminder = ({ 'data-testid': dataTestid }: ReminderProps) => {
  const { t } = useTranslation('app');
  const { setValue, control, trigger } = useFormContext<EventFormValues>();
  const activityIncompleteField = 'reminder.activityIncomplete';
  const activityIncompleteDateField = 'reminder.activityIncompleteDate';
  const reminderTimeField = 'reminder.reminderTime';

  const [periodicity, startDate, endDate, startTime, endTime] = useWatch({
    control,
    name: ['periodicity', 'startDate', 'endDate', 'startTime', 'endTime'],
  });

  const isOncePeriodicity = periodicity === Periodicity.Once;
  const isWeeklyPeriodicity = periodicity === Periodicity.Weekly;
  const isWeekdaysPeriodicity = periodicity === Periodicity.Weekdays;
  const isMonthlyPeriodicity = periodicity === Periodicity.Monthly;
  const isCrossDayEvent = getNextDayComparison(startTime, endTime);

  const handleRemoveReminder = () => {
    setValue('reminder', null, { shouldDirty: true });
  };

  const triggerFields = () => {
    trigger(activityIncompleteField);
    trigger(reminderTimeField);
  };

  const includedMonthlyDates = isMonthlyPeriodicity
    ? (getDaysInMonthlyPeriodicity({
        chosenDate: getDate(startDate as Date),
        eventStart: startDate as Date,
        eventEnd: endDate as Date,
      }) as Date[])
    : undefined;

  const includedMonthlyDatesCrossDay =
    includedMonthlyDates && isCrossDayEvent
      ? includedMonthlyDates.reduce((acc: Date[], date) => [...acc, date, addDays(date, 1)], [])
      : undefined;

  const daysInPeriod =
    isWeeklyPeriodicity &&
    startDate &&
    endDate &&
    getDaysInPeriod({
      isCrossDayEvent,
      startDate: startDate as Date,
      endDate: endDate as Date,
    });

  const weeklyDays =
    daysInPeriod &&
    getWeeklyDays({ daysInPeriod, startDate: startDate as Date, isCrossDayEvent }).daysArr;

  const handleArrowPress = (value: number, type: ArrowPressType) => {
    if (isWeeklyPeriodicity && weeklyDays) {
      const isAddType = type === ArrowPressType.Add;
      const prevValue = isAddType ? value - 1 : value + 1;
      let currentIndex = weeklyDays.indexOf(prevValue);

      if (currentIndex === -1) {
        const { closestBefore, closestAfter } = findClosestValues(weeklyDays, prevValue);
        const prevIndex = weeklyDays.indexOf(isAddType ? closestAfter : closestBefore);
        currentIndex = isAddType ? prevIndex - 1 : prevIndex + 1;
      }

      if (type === ArrowPressType.Add) {
        const addResult =
          currentIndex === weeklyDays.length - 1 ? weeklyDays[0] : weeklyDays[currentIndex + 1];
        setValue(activityIncompleteField, addResult);
      } else {
        const subtractResult =
          currentIndex === 0 ? weeklyDays[weeklyDays.length - 1] : weeklyDays[currentIndex - 1];
        setValue(activityIncompleteField, subtractResult, { shouldDirty: true });
      }
    } else if (value >= DEFAULT_ACTIVITY_INCOMPLETE_VALUE) {
      setValue(activityIncompleteField, value, { shouldDirty: true });
    }

    triggerFields();
  };

  const handleActivityIncompleteChange = (event: SelectEvent) => {
    const newValue =
      +event.target.value < DEFAULT_ACTIVITY_INCOMPLETE_VALUE
        ? DEFAULT_ACTIVITY_INCOMPLETE_VALUE
        : +event.target.value;
    setValue(activityIncompleteField, newValue, { shouldDirty: true });
    triggerFields();
  };

  return (
    <StyledNotificationWrapper>
      <StyledLabelLarge sx={{ margin: theme.spacing(1.2, 0, 0, 1.1) }}>
        {t('reminder')}
      </StyledLabelLarge>
      <StyledReminder>
        <Header onClickHandler={handleRemoveReminder} data-testid={dataTestid} />
        <StyledFlexTopStart>
          <StyledInputWrapper>
            {isMonthlyPeriodicity ? (
              <DatePicker
                name={activityIncompleteDateField}
                key="activityIncompleteDate"
                control={control}
                label={t('activityIncomplete')}
                includeDates={includedMonthlyDatesCrossDay || includedMonthlyDates}
                tooltip={t('deadlineForActivityCompletion')}
                onCloseCallback={() => trigger(reminderTimeField)}
                data-testid={`${dataTestid}-activity-incomplete-monthly-date`}
              />
            ) : (
              <InputController
                label={t('activityIncomplete')}
                type="number"
                name={activityIncompleteField}
                control={control}
                textAdornment="day"
                tooltip={t('numberOfConsecutiveDays')}
                minNumberValue={DEFAULT_ACTIVITY_INCOMPLETE_VALUE}
                disabled={isOncePeriodicity && !isCrossDayEvent}
                onChange={handleActivityIncompleteChange}
                onArrowPress={handleArrowPress}
                data-testid={`${dataTestid}-activity-incomplete`}
              />
            )}
          </StyledInputWrapper>
          <StyledColInner>
            <TimePicker
              name={reminderTimeField}
              label={t('reminderTime')}
              data-testid={`${dataTestid}-reminder-time`}
            />
          </StyledColInner>
        </StyledFlexTopStart>
        {isWeekdaysPeriodicity && (
          <StyledBodyMedium sx={{ mt: theme.spacing(2) }}>
            {t('weekdaysReminderMessage')}
          </StyledBodyMedium>
        )}
      </StyledReminder>
    </StyledNotificationWrapper>
  );
};

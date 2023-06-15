import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { endOfMonth, format, startOfMonth } from 'date-fns';

import { ReviewActivity, getReviewActivitiesApi, getAppletSubmitDateListApi } from 'api';
import { DatePicker, DatePickerUiType } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { DateFormats } from 'shared/consts';
import { StyledHeadlineLarge, StyledLabelLarge, theme } from 'shared/styles';
import { useRespondentLabel } from 'modules/Dashboard/hooks';

import { StyledMenu } from '../../RespondentData.styles';
import { StyledHeader } from './ReviewMenu.styles';
import { ReviewMenuProps } from './ReviewMenu.types';
import { ReviewMenuItem } from './ReviewMenuItem';

export const ReviewMenu = ({
  selectedActivity,
  selectedAnswer,
  setSelectedActivity,
  setSelectedAnswer,
}: ReviewMenuProps) => {
  const { t } = useTranslation();
  const { appletId, respondentId } = useParams();
  const respondentLabel = useRespondentLabel();
  const { control, watch, setValue } = useForm({ defaultValues: { date: undefined } });
  const date = watch('date');

  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [submitDates, setSubmitDates] = useState<Date[] | undefined>(undefined);
  const [activities, setActivities] = useState<ReviewActivity[]>([]);

  const { execute: getAppletSubmitDateList } = useAsync(getAppletSubmitDateListApi, (res) => {
    if (res?.data?.result) {
      const dates = res.data.result.dates.map((date: string) => new Date(date));
      setSubmitDates(dates);
      setValue('date', dates[dates.length - 1]);
    }
  });

  const { execute: getReviewActivities } = useAsync(
    getReviewActivitiesApi,
    (res) => res?.data?.result && setActivities(res.data.result),
  );

  useEffect(() => {
    if (appletId && respondentId) {
      getAppletSubmitDateList({
        appletId,
        respondentId,
        fromDate: String(startDate.getTime()),
        toDate: String(endDate.getTime()),
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (appletId && respondentId && (date || submitDates)) {
      getReviewActivities({
        appletId,
        respondentId,
        createdDate: format(date || new Date(), DateFormats.YearMonthDay),
      });
    }
  }, [date, submitDates]);

  const onMonthChange = (date: Date) => {
    setStartDate(startOfMonth(date));
    setEndDate(endOfMonth(date));
  };

  return (
    <StyledMenu>
      <StyledHeader>
        <StyledHeadlineLarge>{t('review')}</StyledHeadlineLarge>
        <StyledLabelLarge sx={{ marginBottom: theme.spacing(4) }}>
          {respondentLabel}
        </StyledLabelLarge>
        <DatePicker
          name="date"
          control={control}
          uiType={DatePickerUiType.OneDate}
          label={t('reviewDate')}
          minDate={null}
          includeDates={submitDates}
          onMonthChange={onMonthChange}
          disabled={!submitDates}
        />
      </StyledHeader>
      <StyledLabelLarge sx={{ margin: theme.spacing(1.6) }}>
        {t('selectActivityAndResponse')}
      </StyledLabelLarge>
      {activities.map((activity) => (
        <ReviewMenuItem
          key={activity.id}
          isSelected={selectedActivity?.id === activity.id}
          activity={activity}
          setSelectedActivity={setSelectedActivity}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
        />
      ))}
    </StyledMenu>
  );
};

import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';
import { DecryptedTimeAnswer } from 'shared/types';
import { Svg } from 'shared/components/Svg';
import { StyledTitleLarge, theme, variables } from 'shared/styles';
import i18n from 'i18n';

import { Answer } from '../RespondentDataReview.types';

const { t } = i18n;

export const getTimeResponseItem = (answer?: DecryptedTimeAnswer) => {
  if (!answer) return;

  const date = new Date();

  const hours = answer?.value?.hours ?? answer?.hour;
  const minutes = answer?.value?.minutes ?? answer?.minute;

  date.setHours(hours!);
  date.setMinutes(minutes!);

  return format(date, DateFormats.Time);
};

export const renderEmptyState = (selectedAnswer: Answer | null) => {
  if (!selectedAnswer) {
    return (
      <>
        <Svg id="data" width="80" height="80" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('emptyReview')}
        </StyledTitleLarge>
      </>
    );
  }

  return (
    <>
      <Svg id="chart" width="67" height="67" />
      <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
        {t('noDataForActivity')}
      </StyledTitleLarge>
    </>
  );
};

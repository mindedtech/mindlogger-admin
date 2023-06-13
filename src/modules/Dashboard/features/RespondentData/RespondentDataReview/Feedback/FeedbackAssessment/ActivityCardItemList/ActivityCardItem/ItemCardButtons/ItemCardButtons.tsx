import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { StyledFlexTopCenter, theme } from 'shared/styles';
import { checkAnswerValue } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackAssessment/FeedbackAssessmentForm/FeedbackAssessmentForm.utils';

import { ItemCardButtonsProps } from './ItemCardButtons.types';

export const ItemCardButtons = ({
  step,
  config,
  isSubmitVisible,
  onBackButtonClick,
  onNextButtonClick,
  onSubmit,
}: ItemCardButtonsProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext();

  const answerValue = watch(`assessmentItems.${step}.answers`);

  const [isNextDisable, setIsNextDisable] = useState(checkAnswerValue(answerValue));

  useEffect(() => {
    setIsNextDisable(checkAnswerValue(answerValue));
  }, [answerValue]);

  return (
    <StyledFlexTopCenter sx={{ justifyContent: 'flex-end', mt: theme.spacing(1.6) }}>
      {config.isBackVisible && (
        <Button sx={{ minWidth: '10rem' }} onClick={onBackButtonClick}>
          {t('back')}
        </Button>
      )}
      <Button
        sx={{ minWidth: '10rem', ml: theme.spacing(1.6) }}
        variant="contained"
        disabled={!config.isSkippable && isNextDisable}
        onClick={isSubmitVisible ? onSubmit : onNextButtonClick}
      >
        {isSubmitVisible ? t('submit') : t('next')}
      </Button>
    </StyledFlexTopCenter>
  );
};

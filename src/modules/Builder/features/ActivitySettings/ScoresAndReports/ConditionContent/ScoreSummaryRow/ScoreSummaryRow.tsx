import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StyledLabelBoldLarge } from 'shared/styles';
import {
  StyledSummaryRow,
  StyledSummarySelectController,
} from 'shared/styles/styledComponents/ConditionalSummary';

import { ScoreSummaryRowProps } from './ScoreSummaryRow.types';
import { getMatchOptions } from './ScoreSummaryRow.utils';

export const ScoreSummaryRow = ({ name }: ScoreSummaryRowProps) => {
  const { t } = useTranslation('app');
  const { control } = useFormContext();

  return (
    <StyledSummaryRow>
      <StyledLabelBoldLarge>{t('if')}</StyledLabelBoldLarge>
      <StyledSummarySelectController
        control={control}
        name={`${name}.match`}
        options={getMatchOptions()}
        placeholder={t('select')}
      />
      <StyledLabelBoldLarge>{t('scoreSummaryDescription')}</StyledLabelBoldLarge>
    </StyledSummaryRow>
  );
};

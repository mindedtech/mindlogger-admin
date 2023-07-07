import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { Condition } from 'shared/state';
import { getEntityKey } from 'shared/utils';
import { ConditionRow } from 'modules/Builder/components';
import { ConditionRowType } from 'modules/Builder/types';
import { StyledBodyMedium, theme, variables } from 'shared/styles';

import { ConditionContentProps } from './ConditionContent.types';
import { ScoreSummaryRow } from './ScoreSummaryRow';
import { StyledButton } from '../ScoresAndReports.styles';
import { getDefaultScoreCondition } from './ConditionContent.utils';

export const ConditionContent = ({ name, type, scoreId }: ConditionContentProps) => {
  const { t } = useTranslation();
  const conditionsName = `${name}.conditions`;

  const { control, watch, getFieldState } = useFormContext();
  const { append: appendCondition, remove: removeCondition } = useFieldArray({
    control,
    name: conditionsName,
  });
  const error = getFieldState(`${name}.conditions`).error;

  const conditions = watch(conditionsName);

  const handleAddCondition = () => {
    appendCondition(
      type === ConditionRowType.Score && scoreId ? getDefaultScoreCondition(scoreId) : {},
    );
  };

  return (
    <>
      {conditions?.map((condition: Condition, index: number) => (
        <ConditionRow
          key={`score-condition-${getEntityKey(condition) || index}-${index}`}
          name={name}
          index={index}
          type={type}
          scoreId={type === ConditionRowType.Score ? scoreId : ''}
          onRemove={() => removeCondition(index)}
        />
      ))}
      {!!error && (
        <StyledBodyMedium color={variables.palette.semantic.error}>
          {error.message}
        </StyledBodyMedium>
      )}
      <StyledButton
        startIcon={<Svg id="add" width="20" height="20" />}
        onClick={handleAddCondition}
        sx={{ m: theme.spacing(1.2, 0, 1.2, -2.4) }}
      >
        {t('addCondition')}
      </StyledButton>
      <ScoreSummaryRow name={name} />
    </>
  );
};

import { useTranslation } from 'react-i18next';
import { useFieldArray } from 'react-hook-form';

import { Svg } from 'shared/components/Svg';
import { Condition } from 'shared/state';
import { getEntityKey } from 'shared/utils';
import { ConditionRow } from 'modules/Builder/components';
import { ConditionRowType } from 'modules/Builder/types';
import { StyledBodyMedium, theme, variables } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { ConditionContentProps } from './ConditionContent.types';
import { ScoreSummaryRow } from './ScoreSummaryRow';
import { StyledButton } from '../ScoresAndReports.styles';
import { getDefaultScoreCondition } from './ConditionContent.utils';
import { defaultSectionCondition } from './CondtitionContent.const';

export const ConditionContent = ({
  name,
  type,
  score,
  'data-testid': dataTestid,
}: ConditionContentProps) => {
  const { t } = useTranslation();
  const conditionsName = `${name}.conditions`;

  const { control, getFieldState } = useCustomFormContext();
  const { fieldName } = useCurrentActivity();
  const {
    fields: conditions,
    append: appendCondition,
    remove: removeCondition,
  } = useFieldArray<Record<string, Condition[]>>({
    control,
    name: conditionsName,
  });
  const error = getFieldState(`${name}.conditions`).error;

  const handleAddCondition = () => {
    appendCondition(
      type === ConditionRowType.Score && score
        ? getDefaultScoreCondition(score)
        : (defaultSectionCondition as Condition),
    );
  };

  return (
    <>
      {conditions?.map((condition: Condition, index: number) => (
        <ConditionRow
          key={`score-condition-${getEntityKey(condition) || index}-${index}`}
          name={name}
          activityName={fieldName}
          index={index}
          type={type}
          scoreKey={type === ConditionRowType.Score ? score?.key : ''}
          onRemove={() => removeCondition(index)}
          data-testid={`${dataTestid}-condition-${index}`}
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
        data-testid={`${dataTestid}-add-condition`}
      >
        {t('addCondition')}
      </StyledButton>
      <ScoreSummaryRow name={name} data-testid={`${dataTestid}-summary-row`} />
    </>
  );
};

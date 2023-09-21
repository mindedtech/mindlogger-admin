import { useState, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Condition } from 'shared/state';
import { StyledFlexColumn, theme } from 'shared/styles';
import { InputController } from 'shared/components/FormComponents';
import { Svg } from 'shared/components/Svg';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { ConditionRowType } from 'modules/Builder/types';

import { SectionContentProps } from './SectionContent.types';
import { ConditionContent } from '../ConditionContent';
import { StyledButton } from '../ScoresAndReports.styles';
import { SectionScoreHeader } from '../SectionScoreHeader';
import { SectionScoreCommonFields } from '../SectionScoreCommonFields';
import { defaultConditionalValue } from './SectionContent.const';
import { RemoveConditionalLogicPopup } from '../RemoveConditionalLogicPopup';

export const SectionContent = ({
  name,
  title,
  sectionId,
  'data-testid': dataTestid,
}: SectionContentProps) => {
  const { t } = useTranslation('app');
  const { control, watch, setValue } = useFormContext();
  const conditionalLogicName = `${name}.conditionalLogic`;
  const conditionsName = `${name}.conditions`;

  const { append: appendCondition } = useFieldArray<Record<string, Condition[]>>({
    control,
    name: conditionsName,
  });
  const conditionalLogic = watch(conditionalLogicName);
  const [isContainConditional, setIsContainConditional] = useState(!!conditionalLogic);
  const [isRemoveConditionalPopupVisible, setIsRemoveConditionalPopupVisible] = useState(false);
  const conditionalDataTestid = `${dataTestid}-conditional`;

  useEffect(() => {
    if (isContainConditional) {
      if (!conditionalLogic) {
        setValue(conditionalLogicName, defaultConditionalValue);
        appendCondition({} as Condition);
      }

      return;
    }

    setValue(conditionalLogicName, undefined);
  }, [isContainConditional]);

  const removeConditional = () => {
    setIsRemoveConditionalPopupVisible(true);
  };

  return (
    <StyledFlexColumn sx={{ mt: theme.spacing(1.6) }}>
      <InputController
        control={control}
        key={`${name}.name`}
        name={`${name}.name`}
        label={t('sectionName')}
        data-testid={`${dataTestid}-name`}
      />
      <Box sx={{ mt: theme.spacing(2.4) }}>
        {isContainConditional ? (
          <ToggleItemContainer
            HeaderContent={SectionScoreHeader}
            Content={ConditionContent}
            contentProps={{
              name: conditionalLogicName,
              type: ConditionRowType.Section,
              'data-testid': conditionalDataTestid,
            }}
            headerContentProps={{
              onRemove: removeConditional,
              title: t('conditionalLogic'),
              name: conditionalLogicName,
              'data-testid': conditionalDataTestid,
            }}
            uiType={ToggleContainerUiType.Score}
            data-testid={conditionalDataTestid}
          />
        ) : (
          <StyledButton
            sx={{ mt: 0 }}
            startIcon={<Svg id="add" width="20" height="20" />}
            onClick={() => setIsContainConditional(true)}
            data-testid={`${dataTestid}-add-condition`}
          >
            {t('addConditionalLogic')}
          </StyledButton>
        )}
      </Box>
      <SectionScoreCommonFields name={name} sectionId={sectionId} data-testid={dataTestid} />
      {isRemoveConditionalPopupVisible && (
        <RemoveConditionalLogicPopup
          onClose={() => setIsRemoveConditionalPopupVisible(false)}
          onRemove={() => setIsContainConditional(false)}
          name={title}
          data-testid={`${dataTestid}-remove-condition-popup`}
        />
      )}
    </StyledFlexColumn>
  );
};

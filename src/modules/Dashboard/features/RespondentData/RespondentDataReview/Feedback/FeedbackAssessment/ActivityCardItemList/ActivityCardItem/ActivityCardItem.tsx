import { CollapsedMdText } from 'modules/Dashboard/features/RespondentData/CollapsedMdText';
import { getDictionaryText } from 'shared/utils';

import { ItemPicker } from './ItemPicker';
import { ActivityCardItemProps, ItemCardButtonsConfig } from './ActivityCardItem.types';
import { StyledCardItemContainer } from './ActivityCardItem.styles';
import { ItemCardButtons } from './ItemCardButtons';

export const ActivityCardItem = ({
  activityItem,
  isBackVisible,
  isSubmitVisible,
  step,
  toNextStep,
  toPrevStep,
  isActive,
  onSubmit,
}: ActivityCardItemProps) => {
  const buttonConfig: ItemCardButtonsConfig = {
    isSkippable: activityItem.activityItem.config.skippableItem,
    isBackVisible: isBackVisible && !activityItem.activityItem.config.removeBackButton,
  };

  const onNextButtonClick = () => {
    if (toNextStep) {
      toNextStep();
    }
  };

  const onBackButtonClick = () => {
    if (toPrevStep) {
      toPrevStep();
    }
  };

  return (
    <StyledCardItemContainer>
      <CollapsedMdText
        text={getDictionaryText(activityItem.activityItem.question)}
        maxHeight={120}
      />
      <ItemPicker activityItem={activityItem} isDisabled={!isActive} />
      {isActive && (
        <ItemCardButtons
          step={step}
          config={buttonConfig}
          isSubmitVisible={isSubmitVisible}
          onNextButtonClick={onNextButtonClick}
          onBackButtonClick={onBackButtonClick}
          onSubmit={onSubmit}
        />
      )}
    </StyledCardItemContainer>
  );
};

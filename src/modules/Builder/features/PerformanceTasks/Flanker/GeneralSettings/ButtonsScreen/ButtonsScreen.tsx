import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { FlankerItemPositions } from 'modules/Builder/types';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { ButtonsContent } from './ButtonsContent';

export const ButtonsScreen = () => {
  const { t } = useTranslation();
  const { activityObjField } = useCurrentActivity();
  const {
    formState: { errors },
  } = useFormContext();

  const error = get(
    errors,
    `${activityObjField}.items[${FlankerItemPositions.PracticeFirst}].config.buttons`,
  );

  return (
    <ToggleItemContainer
      errorMessage={error ? 'fillInAllRequired' : null}
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerButtons.title')}
      Content={ButtonsContent}
      tooltip={t('flankerButtons.tooltip')}
      data-testid="builder-activity-flanker-buttons"
    />
  );
};

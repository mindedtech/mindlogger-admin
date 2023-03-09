import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { Svg } from 'components';
import { EditorController, InputController } from 'components/FormComponents';
import {
  StyledHeadlineLarge,
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledBodyMedium,
  StyledTitleLarge,
} from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { TextInputOption } from './TextInputOption';
import { ItemSettingsDrawer, ItemSettingsController } from './Settings';
import { Date, NumberSelection } from './InputTypeItems';
import {
  StyledTop,
  StyledInputWrapper,
  StyledItemConfigurationWrapper,
} from './ItemConfiguration.styles';
import {
  ItemConfigurationForm,
  ItemConfigurationSettings,
  ItemInputTypes,
} from './ItemConfiguration.types';
import {
  itemsTypeOptions,
  DEFAULT_TIMER_VALUE,
  DEFAULT_MIN_NUMBER,
  DEFAULT_MAX_NUMBER,
} from './ItemConfiguration.const';

export const ItemConfiguration = () => {
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

  const { t } = useTranslation('app');
  const { control, watch, setValue } = useForm<ItemConfigurationForm>({
    defaultValues: {
      itemsInputType: '',
      name: '',
      body: '',
      settings: [],
      timer: DEFAULT_TIMER_VALUE,
      isTextInputOptionRequired: true,
      minNumber: DEFAULT_MIN_NUMBER,
      maxNumber: DEFAULT_MAX_NUMBER,
      date: '',
    },
    mode: 'onChange',
  });

  const selectedInputType = watch('itemsInputType');
  const settings = watch('settings');

  useEffect(() => {
    setValue('settings', []);
    setValue('timer', DEFAULT_TIMER_VALUE);
  }, [selectedInputType]);

  const isTextInputOptionVisible = settings?.includes(ItemConfigurationSettings.HasTextInput);

  const handleRemoveTextInputOption = () => {
    setValue(
      'settings',
      settings?.filter(
        (settingKey: ItemConfigurationSettings) =>
          settingKey !== ItemConfigurationSettings.HasTextInput,
      ),
    );
  };

  return (
    <StyledItemConfigurationWrapper>
      <StyledTop>
        <StyledHeadlineLarge>{t('itemConfiguration')}</StyledHeadlineLarge>
        <StyledFlexTopCenter>
          <StyledClearedButton
            sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
            onClick={() => setSettingsDrawerVisible(true)}
          >
            <Svg id="report-configuration" />
          </StyledClearedButton>
          <StyledClearedButton sx={{ p: theme.spacing(1) }}>
            <Svg id="close" />
          </StyledClearedButton>
        </StyledFlexTopCenter>
      </StyledTop>
      <StyledInputWrapper>
        <GroupedSelectSearchController
          name="itemsInputType"
          options={itemsTypeOptions}
          control={control}
        />
      </StyledInputWrapper>
      <StyledInputWrapper>
        <StyledBodyMedium
          sx={{ m: theme.spacing(0.5, 0, 4, 1.4) }}
          color={variables.palette.on_surface_variant}
        >
          {t('itemTypeDescription')}
        </StyledBodyMedium>
        <InputController
          fullWidth
          name="name"
          control={control}
          label={t('itemName')}
          type="text"
          sx={{ mb: theme.spacing(4) }}
        />
      </StyledInputWrapper>
      <StyledTitleLarge sx={{ mb: theme.spacing(1) }}>{t('itemBody')}</StyledTitleLarge>
      <EditorController name="body" control={control} />
      {selectedInputType === ItemInputTypes.NumberSelection && (
        <NumberSelection name="minNumber" maxName="maxNumber" control={control} />
      )}
      {selectedInputType === ItemInputTypes.Date && <Date name="date" control={control} />}
      {isTextInputOptionVisible && (
        <TextInputOption
          name="isTextInputOptionRequired"
          control={control}
          onRemove={handleRemoveTextInputOption}
        />
      )}
      {settingsDrawerVisible && (
        <ItemSettingsDrawer
          open={settingsDrawerVisible}
          onClose={() => setSettingsDrawerVisible(false)}
        >
          <ItemSettingsController
            timerName="timer"
            name="settings"
            inputType={selectedInputType}
            control={control}
          />
        </ItemSettingsDrawer>
      )}
    </StyledItemConfigurationWrapper>
  );
};

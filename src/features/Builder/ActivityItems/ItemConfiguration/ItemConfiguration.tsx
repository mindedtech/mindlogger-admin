import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { Svg } from 'components';
import { EditorController, InputController } from 'components/FormComponents';
import {
  StyledHeadlineLarge,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledBodyMedium,
  StyledTitleLarge,
} from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { TextInputOption } from './TextInputOption';
import { ItemSettingsDrawer, ItemSettingsController } from './Settings';
import { NumberSelection } from './InputTypeItems';
import { StyledTop, StyledInputWrapper } from './ItemConfiguration.styles';
import {
  ItemConfigurationFields,
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
      [ItemConfigurationFields.itemsInputType]: '',
      [ItemConfigurationFields.name]: '',
      [ItemConfigurationFields.body]: '',
      settings: [],
      timer: DEFAULT_TIMER_VALUE,
      isTextInputOptionRequired: true,
      minNumber: DEFAULT_MIN_NUMBER,
      maxNumber: DEFAULT_MAX_NUMBER,
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
    <StyledFlexColumn>
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
          name={ItemConfigurationFields.itemsInputType}
          options={itemsTypeOptions}
          control={control}
        />
        <StyledBodyMedium
          sx={{ m: theme.spacing(0.5, 0, 4, 1.4) }}
          color={variables.palette.on_surface_variant}
        >
          {t('itemTypeDescription')}
        </StyledBodyMedium>
        <InputController
          fullWidth
          name={ItemConfigurationFields.name}
          control={control}
          label={t('itemName')}
          type="text"
          sx={{ mb: theme.spacing(4) }}
        />
        <StyledTitleLarge sx={{ mb: theme.spacing(1) }}>{t('itemBody')}</StyledTitleLarge>
        <EditorController name={ItemConfigurationFields.body} control={control} />
      </StyledInputWrapper>
      {selectedInputType === ItemInputTypes.NumberSelection && (
        <NumberSelection name="minNumber" maxName="maxNumber" control={control} />
      )}
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
    </StyledFlexColumn>
  );
};

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useForm, FormProvider } from 'react-hook-form';
import { Button } from '@mui/material';

import { Svg } from 'components';
import { EditorController, InputController } from 'components/FormComponents';
import {
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledHeadlineLarge,
  StyledTitleLarge,
} from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { TextInputOption } from './TextInputOption';
import { ItemSettingsDrawer, ItemSettingsController } from './Settings';
import { Date, SelectionOption, NumberSelection } from './InputTypeItems';
import {
  StyledTop,
  StyledInputWrapper,
  StyledOptionsWrapper,
  StyledItemConfiguration,
} from './ItemConfiguration.styles';
import {
  ItemConfigurationForm,
  ItemInputTypes,
  ItemConfigurationSettings,
} from './ItemConfiguration.types';
import {
  itemsTypeOptions,
  DEFAULT_TIMER_VALUE,
  DEFAULT_SCORE_VALUE,
  DEFAULT_MIN_NUMBER,
  DEFAULT_MAX_NUMBER,
} from './ItemConfiguration.const';

export const ItemConfiguration = () => {
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const { t } = useTranslation('app');

  const methods = useForm<ItemConfigurationForm>({
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

  const { control, watch, setValue } = methods;

  const {
    fields: options,
    append: appendOption,
    remove: removeOptions,
    update: updateOptions,
  } = useFieldArray({
    control,
    name: 'options',
  });

  const selectedInputType = watch('itemsInputType');
  const settings = watch('settings');

  const hasOptions =
    selectedInputType === ItemInputTypes.SingleSelection ||
    selectedInputType === ItemInputTypes.MultipleSelection;

  const isTextInputOptionVisible = settings?.includes(ItemConfigurationSettings.HasTextInput);
  const hasScores = settings?.includes(ItemConfigurationSettings.HasScores);

  const handleAddOption = () =>
    appendOption({
      text: '',
      isVisible: true,
      ...(hasScores && { score: DEFAULT_SCORE_VALUE }),
    });

  const handleRemoveTextInputOption = () => {
    setValue(
      'settings',
      settings?.filter(
        (settingKey: ItemConfigurationSettings) =>
          settingKey !== ItemConfigurationSettings.HasTextInput,
      ),
    );
  };

  useEffect(() => {
    setValue('settings', []);
    setValue('timer', DEFAULT_TIMER_VALUE);
    removeOptions();
  }, [selectedInputType]);

  return (
    <FormProvider {...methods}>
      <StyledItemConfiguration>
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
        {hasOptions && (
          <StyledOptionsWrapper>
            {options?.length
              ? options.map((option, index) => (
                  <SelectionOption
                    key={option.id}
                    onRemoveOption={removeOptions}
                    onUpdateOption={updateOptions}
                    index={index}
                  />
                ))
              : null}
            <Button
              onClick={handleAddOption}
              variant="outlined"
              startIcon={<Svg id="add" width="20" height="20" />}
            >
              {t('addOption')}
            </Button>
          </StyledOptionsWrapper>
        )}
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
      </StyledItemConfiguration>
    </FormProvider>
  );
};

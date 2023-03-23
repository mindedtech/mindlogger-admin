import { useFieldArray, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

import { ItemInputTypes } from 'shared/types';

import {
  OptionalItemSetupProps,
  SettingsSetupProps,
  ItemConfigurationSettings,
} from './ItemConfiguration.types';
import { DEFAULT_TIMER_VALUE } from './ItemConfiguration.const';
import { getEmptySliderOption } from './ItemConfiguration.utils';

export const useOptionalItemSetup = ({
  name,
  defaultValue = '',
  itemType,
}: OptionalItemSetupProps) => {
  const { control, setValue, getValues } = useFormContext();

  useEffect(() => {
    const initialValue = getValues()[name];
    if (initialValue === undefined) {
      setValue(name, defaultValue);
    }

    return () => {
      const itemsInputType = getValues().itemsInputType;
      if (itemsInputType === itemType) return;

      setValue(name, undefined);
    };
  }, [getValues]);

  return { control };
};

export const useSettingsSetup = ({
  control,
  setValue,
  getValues,
  watch,
  register,
  unregister,
}: SettingsSetupProps) => {
  const selectedInputType = watch('itemsInputType');
  const settings = watch('settings');

  const { remove: removeOptions } = useFieldArray({
    control,
    name: 'options',
  });
  const { remove: removeAlert } = useFieldArray({
    control,
    name: 'alerts',
  });

  const hasTimer = settings?.includes(ItemConfigurationSettings.HasTimer);
  const hasAlerts = settings?.includes(ItemConfigurationSettings.HasAlerts);
  const hasPalette = settings?.includes(ItemConfigurationSettings.HasColorPalette);
  const isTextInputOptionVisible = settings?.includes(ItemConfigurationSettings.HasTextInput);
  const isTextInputRequired = settings?.includes(ItemConfigurationSettings.IsTextInputRequired);
  const isSkippable = settings?.includes(ItemConfigurationSettings.IsSkippable);

  useEffect(() => {
    setValue('settings', []);
    setValue('timer', DEFAULT_TIMER_VALUE);
    removeOptions();

    if (
      selectedInputType === ItemInputTypes.Slider ||
      selectedInputType === ItemInputTypes.SliderRows
    ) {
      setValue('sliderOptions', [getEmptySliderOption()]);
    } else setValue('sliderOptions', undefined);
  }, [selectedInputType]);

  useEffect(() => {
    !hasAlerts && removeAlert();
  }, [hasAlerts]);

  useEffect(() => {
    if (hasPalette) {
      register('paletteName', { value: '' });
    } else unregister('paletteName');
  }, [hasPalette]);

  useEffect(() => {
    //TODO add to isSkippable: 'Reset to True IF Allow respondent to skip all Items = True AND Required = False;'
    if (isTextInputRequired && isSkippable) {
      setValue(
        'settings',
        settings?.filter(
          (settingKey: ItemConfigurationSettings) =>
            settingKey !== ItemConfigurationSettings.IsSkippable,
        ),
      );
    }

    if (isTextInputOptionVisible) {
      const initialValue = getValues()['isTextInputOptionRequired'];

      register('isTextInputOptionRequired', { value: initialValue });
    } else unregister('isTextInputOptionRequired');
  }, [settings]);

  useEffect(() => {
    if (hasTimer) {
      const initialValue = getValues()['timer'];
      if (initialValue === undefined) {
        setValue('timer', DEFAULT_TIMER_VALUE);
      }

      return;
    }

    setValue('timer', undefined);
  }, [selectedInputType, hasTimer]);
};

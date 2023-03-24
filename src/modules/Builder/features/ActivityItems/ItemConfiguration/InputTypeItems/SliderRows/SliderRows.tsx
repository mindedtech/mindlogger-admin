import { useTranslation } from 'react-i18next';
import { FieldValues, Controller } from 'react-hook-form';
import { Button } from '@mui/material';

import { Svg } from 'shared/components';
import { theme, StyledFlexColumn } from 'shared/styles';

import { SliderPanel } from './SliderPanel';
import { SliderProps } from './SliderRows.types';
import { SliderOption } from '../../ItemConfiguration.types';
import { getEmptySliderOption } from '../../ItemConfiguration.utils';

export const SliderRows = <T extends FieldValues>({
  name,
  control,
  isMultiple = false,
}: SliderProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const handleAddSlider = () => {
          onChange([...value, getEmptySliderOption(isMultiple)]);
        };

        return (
          <StyledFlexColumn sx={{ mb: theme.spacing(2), gap: '2.4rem' }}>
            {value?.map(({ id }: SliderOption, index: number) => {
              const handleRemove = () => {
                onChange(value.filter(({ id: sliderId }: SliderOption) => sliderId !== id));
              };

              return (
                <SliderPanel
                  key={`slider-panel-${id}`}
                  name={`${name}[${index}]`}
                  label={t('slider', {
                    context: 'option',
                    index: isMultiple ? index + 1 : undefined,
                  })}
                  isMultiple={isMultiple}
                  onRemove={handleRemove}
                />
              );
            })}
            {isMultiple && (
              <Button
                onClick={handleAddSlider}
                variant="outlined"
                startIcon={<Svg id="add" width="20" height="20" />}
                sx={{ width: '13.2rem' }}
              >
                {t('addSlider')}
              </Button>
            )}
          </StyledFlexColumn>
        );
      }}
    />
  );
};

import { Controller, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg, Tooltip, TooltipUiType } from 'shared/components';
import {
  StyledBodyLarge,
  StyledClearedButton,
  StyledFlexTopCenter,
} from 'shared/styles/styledComponents';

import { InputControllerProps } from './InputController.types';
import {
  StyledCounter,
  StyledTextField,
  StyledTextFieldContainer,
  StyledUpDown,
} from './InputController.styles';

export const InputController = <T extends FieldValues>({
  name,
  control,
  error: providedError,
  textAdornment,
  maxLength,
  tooltip,
  InputProps,
  maxNumberValue,
  defaultNumberValue = 1,
  ...textFieldProps
}: InputControllerProps<T>) => {
  const { t } = useTranslation('app');
  const isNumberType = textFieldProps.type === 'number';

  const getTextAdornment = (value: number) => {
    if (!textAdornment || !value) return null;

    return <StyledBodyLarge>{t(textAdornment, { count: value })}</StyledBodyLarge>;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleAddNumber = () => {
          if (+value < maxNumberValue) onChange(+value + 1);
        };

        const handleDistractNumber = () => {
          const minNumberVal = defaultNumberValue === 0 ? 0 : 1;
          +value > minNumberVal && onChange(+value - 1);
        };

        return (
          <Tooltip uiType={TooltipUiType.Secondary} tooltipTitle={tooltip}>
            <StyledTextFieldContainer>
              <StyledTextField
                {...textFieldProps}
                onChange={onChange}
                value={isNumberType && value < defaultNumberValue ? defaultNumberValue : value}
                error={!!error || providedError}
                helperText={error?.message || null}
                InputProps={
                  isNumberType
                    ? {
                        endAdornment: (
                          <StyledFlexTopCenter>
                            {getTextAdornment(value)}
                            <StyledUpDown>
                              <StyledClearedButton onClick={handleAddNumber}>
                                <Svg id="navigate-up" />
                              </StyledClearedButton>
                              <StyledClearedButton onClick={handleDistractNumber}>
                                <Svg id="navigate-down" />
                              </StyledClearedButton>
                            </StyledUpDown>
                          </StyledFlexTopCenter>
                        ),
                      }
                    : InputProps
                }
              />
              {maxLength && !error && (
                <StyledCounter>
                  {value?.length || 0}/{maxLength} {t('characters')}
                </StyledCounter>
              )}
            </StyledTextFieldContainer>
          </Tooltip>
        );
      }}
    />
  );
};

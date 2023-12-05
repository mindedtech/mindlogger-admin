import { MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker';
import { Controller, FieldValues } from 'react-hook-form';
import fr from 'date-fns/locale/fr';

import { Svg } from 'shared/components/Svg';
import { Spinner, SpinnerUiType } from 'shared/components/Spinner';
import { Tooltip } from 'shared/components/Tooltip';
import { StyledBodyLarge, theme } from 'shared/styles';

import {
  StyledButton,
  StyledButtons,
  StyledCancelButton,
  StyledIconBtn,
  StyledPopover,
  StyledTextField,
} from './DatePicker.styles';
import { DateType, DateArrayType, DatePickerProps, DateVariant, UiType } from './DatePicker.types';
import { DatePickerHeader } from './DatePickerHeader';
import { getStringFromDate } from './DatePicker.utils';
import { DATE_PLACEHOLDER } from './DatePicker.const';
import { PopoverHeader } from './PopoverHeader';

export const DatePicker = <T extends FieldValues>({
  control,
  name,
  uiType = UiType.OneDate,
  inputSx = {},
  label,
  includeDates,
  minDate,
  maxDate,
  onMonthChange,
  disabled,
  onCloseCallback,
  isLoading,
  tooltip,
  'data-testid': dataTestid,
}: DatePickerProps<T>) => {
  const { t, i18n } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);
  const isOpen = !disabled && open;
  const id = isOpen ? 'date-picker-popover' : undefined;
  const isStartEndingDate = uiType === UiType.StartEndingDate;

  const handlePickerShow: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handlePickerClose = () => {
    onCloseCallback?.();
    setAnchorEl(null);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const singleDate = value as DateType;
        const startEndingValue = value as DateArrayType;

        const getSelectedDate = (variant?: DateVariant) => {
          if (isStartEndingDate) {
            if (variant === DateVariant.End) {
              return startEndingValue[1] || null;
            }

            return startEndingValue[0];
          }

          return singleDate;
        };

        const getValue = () => {
          if (value && isStartEndingDate) {
            return [
              getStringFromDate(startEndingValue[0]) || DATE_PLACEHOLDER,
              getStringFromDate(startEndingValue[1]) || DATE_PLACEHOLDER,
            ];
          }

          return getStringFromDate(singleDate) || '';
        };

        const textFieldProps = {
          fullWidth: true,
          disabled,
          onClick: handlePickerShow,
          className: isOpen ? 'active' : '',
          sx: { ...inputSx },
          error: !!error,
          helperText: error?.message || null,
          InputProps: {
            endAdornment: (
              <StyledIconBtn aria-describedby={id} disabled={disabled}>
                <Svg id="date" />
              </StyledIconBtn>
            ),
          },
          'data-testid': dataTestid,
        };

        return (
          <>
            <Tooltip tooltipTitle={tooltip}>
              {uiType === UiType.OneDate ? (
                <StyledTextField
                  variant="outlined"
                  {...textFieldProps}
                  label={label || t('date')}
                  value={getValue()}
                />
              ) : (
                <>
                  <StyledTextField
                    variant="outlined"
                    {...textFieldProps}
                    label={t('startDate')}
                    value={getValue()[0] || ''}
                    data-testid={`${dataTestid}-start`}
                  />
                  <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>
                    {t('smallTo')}
                  </StyledBodyLarge>
                  <StyledTextField
                    variant="outlined"
                    {...textFieldProps}
                    label={t('endDate')}
                    value={getValue()[1] || ''}
                    data-testid={`${dataTestid}-end`}
                  />
                </>
              )}
            </Tooltip>
            <StyledPopover
              id={id}
              open={isOpen}
              anchorEl={anchorEl}
              onClose={handlePickerClose}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              data-testid={`${dataTestid}-popover`}
            >
              {isLoading && <Spinner uiType={SpinnerUiType.Secondary} />}
              {value && (
                <PopoverHeader uiType={uiType} date={value as Date | Date[]} tooltip={tooltip} />
              )}
              <ReactDatePicker
                locale={i18n.language === 'fr' ? fr : undefined}
                renderCustomHeader={(props) => <DatePickerHeader uiType={uiType} {...props} />}
                startDate={isStartEndingDate ? (getSelectedDate() as DateType) : undefined}
                endDate={
                  isStartEndingDate ? (getSelectedDate(DateVariant.End) as DateType) : undefined
                }
                selectsRange={isStartEndingDate}
                inline
                selected={getSelectedDate() as DateType}
                disabled={disabled}
                onChange={(date) => onChange(date)}
                monthsShown={isStartEndingDate ? 2 : 1}
                formatWeekDay={(nameOfDay) => nameOfDay[0]}
                minDate={minDate === undefined ? new Date() : minDate}
                maxDate={maxDate === undefined ? null : maxDate}
                focusSelectedMonth
                onMonthChange={onMonthChange}
                includeDates={includeDates}
              />
              <StyledButtons>
                <StyledCancelButton variant="text" onClick={handlePickerClose}>
                  {t('cancel')}
                </StyledCancelButton>
                <StyledButton variant="text" onClick={handlePickerClose}>
                  {t('ok')}
                </StyledButton>
              </StyledButtons>
            </StyledPopover>
          </>
        );
      }}
    />
  );
};

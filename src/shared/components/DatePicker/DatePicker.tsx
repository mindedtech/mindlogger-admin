import { MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker';
import { Controller, FieldValues } from 'react-hook-form';
import fr from 'date-fns/locale/fr';

import { Svg } from 'shared/components/Svg';

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
  value: providedValue,
  name,
  uiType = UiType.OneDate,
  inputSx = {},
}: DatePickerProps<T>) => {
  const { t, i18n } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'date-picker-popover' : undefined;
  const isStartEndingDate = uiType === UiType.StartEndingDate;

  const handlePickerShow: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handlePickerClose = () => setAnchorEl(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value: fieldValue }, fieldState: { error } }) => {
        const value = providedValue || fieldValue;
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
            return `${getStringFromDate(startEndingValue[0]) || DATE_PLACEHOLDER} - ${
              getStringFromDate(startEndingValue[1]) || DATE_PLACEHOLDER
            }`;
          }

          return getStringFromDate(singleDate) || '';
        };

        return (
          <>
            <StyledTextField
              disabled
              variant="outlined"
              label={uiType === UiType.OneDate ? t('date') : t('startEndDate')}
              value={getValue()}
              onClick={handlePickerShow}
              className={(open && 'active') || ''}
              sx={{ ...inputSx }}
              error={!!error}
              helperText={error?.message || null}
              InputProps={{
                endAdornment: (
                  <StyledIconBtn aria-describedby={id}>
                    <Svg id="date" />
                  </StyledIconBtn>
                ),
              }}
            />
            <StyledPopover
              id={id}
              open={open}
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
            >
              {value && <PopoverHeader uiType={uiType} date={value as Date | Date[]} />}
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
                onChange={(date) => onChange(date)}
                monthsShown={isStartEndingDate ? 2 : 1}
                formatWeekDay={(nameOfDay) => nameOfDay[0]}
                minDate={new Date()}
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

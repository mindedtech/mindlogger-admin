import { ChangeEvent, KeyboardEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, FieldValues } from 'react-hook-form';
import { TextField, FormControl, InputLabel } from '@mui/material';

import { Svg } from 'components';
import theme from 'styles/theme';
import { StyledClearedButton, StyledFlexTopCenter } from 'styles/styledComponents';
import { variables } from 'styles/variables';

import { ItemInputTypes } from '../ItemConfiguration.types';
import { itemsTypeIcons } from '../ItemConfiguration.const';
import { GroupedSelectControllerProps } from './GroupedSelectSearchController.types';
import {
  StyledGroupName,
  StyledMenuItem,
  StyledSelect,
  StyledListSubheader,
} from './GroupedSelectSearchController.styles';
import { ItemTypeTooltip } from './ItemTypeTooltip';

export const GroupedSelectSearchController = <T extends FieldValues>({
  name,
  control,
  options,
}: GroupedSelectControllerProps<T>) => {
  const { t } = useTranslation('app');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLLIElement | null>(null);
  const [currentItemType, setCurrentItemType] = useState<ItemInputTypes | null>(null);

  const handleTooltipOpen = (event: MouseEvent<HTMLLIElement>, itemType: ItemInputTypes) => {
    setCurrentItemType(itemType);
    setAnchorEl(event.currentTarget);
  };

  const handleTooltipClose = () => {
    setCurrentItemType(null);
    setAnchorEl(null);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') {
      event.stopPropagation();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleSelectOpen = () => setSelectOpen(true);

  const handleSelectClose = async () => {
    await setSelectOpen(false);
    setSearchTerm('');
    handleTooltipClose();
  };

  const paperStyles = {
    maxHeight: '35rem',
    width: '58rem',
    mt: `${theme.spacing(2.5)} !important`,
    ml: theme.spacing(1.1),
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControl fullWidth>
            <InputLabel id="input-type-label">{t('itemType')}</InputLabel>
            <StyledSelect
              fullWidth
              MenuProps={{
                autoFocus: false,
                PaperProps: { sx: paperStyles },
              }}
              onChange={onChange}
              value={value}
              labelId="input-type-label"
              label={t('inputType')}
              renderValue={() => (
                <StyledFlexTopCenter>
                  <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
                    {itemsTypeIcons[value]}
                  </StyledFlexTopCenter>
                  {t(value)}
                </StyledFlexTopCenter>
              )}
              open={selectOpen}
              onClose={handleSelectClose}
              onOpen={handleSelectOpen}
              IconComponent={() => <Svg id={selectOpen ? 'navigate-up' : 'navigate-down'} />}
              defaultValue=""
            >
              <StyledListSubheader
                sx={{
                  borderBottom: `${variables.borderWidth.md} solid ${variables.palette.outline_variant}`,
                }}
              >
                <form autoComplete="off">
                  <TextField
                    autoFocus
                    placeholder={t('searchItemType')}
                    fullWidth
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    InputProps={{
                      startAdornment: <Svg id="search" />,
                      endAdornment: (
                        <StyledClearedButton onClick={handleSelectClose}>
                          <Svg id="close" />
                        </StyledClearedButton>
                      ),
                    }}
                  />
                </form>
              </StyledListSubheader>
              {options?.map(({ groupName, groupOptions }, index) => [
                searchTerm ? (
                  []
                ) : (
                  <StyledGroupName isFirstName={index === 0} key={groupName}>
                    {t(groupName)}
                  </StyledGroupName>
                ),
                ...groupOptions.map(({ value: groupValue, icon }) => {
                  const isHidden =
                    t(groupValue).toLowerCase().indexOf(searchTerm.toLowerCase()) === -1;

                  return (
                    <StyledMenuItem
                      onMouseEnter={
                        selectOpen ? (event) => handleTooltipOpen(event, groupValue) : () => false
                      }
                      onMouseLeave={handleTooltipClose}
                      isHidden={isHidden}
                      key={groupValue}
                      value={groupValue}
                    >
                      <StyledFlexTopCenter>
                        <StyledFlexTopCenter sx={{ mr: theme.spacing(1.8) }}>
                          {icon}
                        </StyledFlexTopCenter>
                        {t(groupValue)}
                      </StyledFlexTopCenter>
                    </StyledMenuItem>
                  );
                }),
              ])}
            </StyledSelect>
          </FormControl>
        )}
      />
      {currentItemType && <ItemTypeTooltip uiType={currentItemType} anchorEl={anchorEl} />}
    </>
  );
};

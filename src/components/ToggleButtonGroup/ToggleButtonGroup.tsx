import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleButtonGroup as MuiToggleButtonGroup } from '@mui/material';

import { Svg, Tooltip, TooltipUiType } from 'components';

import { StyledIcon, StyledToggleBtn } from './ToggleButtonGroup.styles';
import { ToggleButtonGroupProps } from './ToggleButtonGroup.types';

export const ToggleButtonGroup = ({
  toggleButtons,
  activeButton,
  setActiveButton,
  customChange,
}: ToggleButtonGroupProps) => {
  const { t } = useTranslation('app');

  const handleChange = (e: MouseEvent<HTMLElement>, selected: string) => {
    if (selected) {
      customChange && customChange(selected);
      setActiveButton(selected);
    }
  };

  return (
    <MuiToggleButtonGroup fullWidth value={activeButton} exclusive onChange={handleChange}>
      {toggleButtons.map(({ value, label, tooltip, icon }) => (
        <StyledToggleBtn withIcon={!!icon} key={value} value={value}>
          {activeButton === value && !icon && (
            <StyledIcon>
              <Svg id="check" />
            </StyledIcon>
          )}
          {icon && <StyledIcon>{icon}</StyledIcon>}
          <Tooltip uiType={TooltipUiType.Secondary} tooltipTitle={t(tooltip || '')}>
            <span> {t(label)}</span>
          </Tooltip>
        </StyledToggleBtn>
      ))}
    </MuiToggleButtonGroup>
  );
};

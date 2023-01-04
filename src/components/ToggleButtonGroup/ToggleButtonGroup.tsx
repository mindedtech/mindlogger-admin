import { useTranslation } from 'react-i18next';
import { ToggleButton, ToggleButtonGroup as MuiToggleButtonGroup } from '@mui/material';

import { Svg } from 'components/Svg';
import { Tooltip, TooltipUiType } from 'components/Tooltip';

import { StyledIcon } from './ToggleButtonGroup.styles';
import { ToggleButtonGroupProps } from './ToggleButtonGroup.types';

export const ToggleButtonGroup = ({
  toggleButtons,
  activeButton,
  setActiveButton,
  customChange,
}: ToggleButtonGroupProps) => {
  const { t } = useTranslation('app');

  const handleChange = (e: React.MouseEvent<HTMLElement>, selected: string) => {
    if (selected) {
      customChange && customChange(selected);
      setActiveButton(selected);
    }
  };

  return (
    <MuiToggleButtonGroup fullWidth value={activeButton} exclusive onChange={handleChange}>
      {toggleButtons.map(({ value, label, tooltip }) => (
        <ToggleButton key={value} value={value}>
          {activeButton === value && (
            <StyledIcon>
              <Svg id="check" />
            </StyledIcon>
          )}
          <Tooltip uiType={TooltipUiType.secondary} tooltipTitle={t(tooltip || '')}>
            <span> {t(label)}</span>
          </Tooltip>
        </ToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
};

import { useTranslation } from 'react-i18next';

import { StyledTitleSmall } from 'shared/styles/styledComponents';

import {
  StyledSetting,
  StyledSettings,
  StyledContainer,
  StyledHeadline,
  StyledSettingsGroup,
  StyledTitle,
} from './Navigation.styles';
import { NavigationProps } from './Navigation.types';

export const Navigation = ({ settings, selectedSetting, handleSettingClick }: NavigationProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledContainer>
      <StyledHeadline>{t('appletSettings')}</StyledHeadline>
      {settings.map(({ label, items }) => (
        <StyledSettingsGroup key={label} isCompact={!!selectedSetting}>
          <StyledTitleSmall>{t(label)}</StyledTitleSmall>
          <StyledSettings isCompact={!!selectedSetting}>
            {items.map(({ icon, label, component, param }) => (
              <StyledSetting
                onClick={() => handleSettingClick({ label, component, param })}
                key={label}
                isCompact={!!selectedSetting}
                isSelected={selectedSetting?.label === label}
              >
                {icon}
                <StyledTitle>{t(label)}</StyledTitle>
              </StyledSetting>
            ))}
          </StyledSettings>
        </StyledSettingsGroup>
      ))}
    </StyledContainer>
  );
};

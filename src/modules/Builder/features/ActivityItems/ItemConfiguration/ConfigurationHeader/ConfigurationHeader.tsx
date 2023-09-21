import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import {
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledStickyHeadline,
  theme,
} from 'shared/styles';
import { useHeaderSticky } from 'shared/hooks';

import { StyledHeader } from './ConfigurationHeader.styles';
import { ConfigurationHeaderProps } from './ConfigurationHeader.types';

export const ConfigurationHeader = ({
  containerRef,
  responseType,
  optionalItemsRef,
  onClose,
}: ConfigurationHeaderProps) => {
  const isHeaderSticky = useHeaderSticky(containerRef);
  const { t } = useTranslation('app');

  return (
    <StyledHeader isSticky={isHeaderSticky}>
      <StyledStickyHeadline isSticky={isHeaderSticky}>
        {t('itemConfiguration')}
      </StyledStickyHeadline>
      <StyledFlexTopCenter>
        {responseType && (
          <StyledClearedButton
            sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
            onClick={() => optionalItemsRef.current?.setSettingsDrawerVisible(true)}
            data-testid="builder-activity-items-item-configuration-settings"
          >
            <Svg id="configure" />
          </StyledClearedButton>
        )}
        <StyledClearedButton
          sx={{ p: theme.spacing(1) }}
          onClick={onClose}
          data-testid="builder-activity-items-item-configuration-close"
        >
          <Svg id="close" />
        </StyledClearedButton>
      </StyledFlexTopCenter>
    </StyledHeader>
  );
};

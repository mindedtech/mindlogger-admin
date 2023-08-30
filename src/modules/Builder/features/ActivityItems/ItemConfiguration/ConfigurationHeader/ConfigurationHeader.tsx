import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import {
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledHeadlineLarge,
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
      <StyledHeadlineLarge>{t('itemConfiguration')}</StyledHeadlineLarge>
      <StyledFlexTopCenter>
        {responseType && (
          <StyledClearedButton
            sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
            onClick={() => optionalItemsRef.current?.setSettingsDrawerVisible(true)}
          >
            <Svg id="report-configuration" />
          </StyledClearedButton>
        )}
        <StyledClearedButton sx={{ p: theme.spacing(1) }} onClick={onClose}>
          <Svg id="close" />
        </StyledClearedButton>
      </StyledFlexTopCenter>
    </StyledHeader>
  );
};

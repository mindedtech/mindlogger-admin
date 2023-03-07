import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import { StyledBodyMedium } from 'styles/styledComponents';

import { StyledPresentation } from './TooltipComponents.styles';

export const Slider = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledPresentation>
        <Svg id="slider-number" width="114" height="72" />
      </StyledPresentation>
      <StyledBodyMedium>{t('createNumericalScale')}</StyledBodyMedium>
    </>
  );
};

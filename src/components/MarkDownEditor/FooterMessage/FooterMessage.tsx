import { useTranslation } from 'react-i18next';

import { THRESHOLD_SIZE } from 'components';

import { FooterMessageProps } from './FooterMessage.types';
import { StyledText } from './FooterMessage.styles';

export const FooterMessage = ({ inputSize }: FooterMessageProps) => {
  const { t } = useTranslation('app');

  if (inputSize <= THRESHOLD_SIZE) return null;

  return (
    <StyledText>
      {t('mdEditorThresholdMessage', {
        size: THRESHOLD_SIZE,
      })}
    </StyledText>
  );
};

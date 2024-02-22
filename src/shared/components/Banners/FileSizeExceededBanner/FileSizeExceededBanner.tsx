import { useTranslation } from 'react-i18next';

import { byteFormatter } from 'shared/utils';

import { Banner, BannerProps } from '../Banner';

export const FileSizeExceededBanner = ({ size, ...props }: BannerProps) => {
  const { t } = useTranslation('app');

  return (
    <Banner severity="error" data-testid="file-size-exceeded-banner" {...props}>
      {t('fileSizeExceed', { size: byteFormatter(size as number) })}
    </Banner>
  );
};

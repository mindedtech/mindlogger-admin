import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { getDictionaryText } from 'shared/utils';
import { SuccessShared } from 'modules/Dashboard/features/Applet/ShareApplet/SuccessShared';

import { SuccessSharePopupProps } from './SuccessSharePopup.types';

export const SuccessSharePopup = ({
  applet,
  keywords,
  libraryUrl,
  sharePopupVisible,
  setSharePopupVisible,
}: SuccessSharePopupProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={sharePopupVisible}
      onClose={() => setSharePopupVisible(false)}
      onSubmit={() => setSharePopupVisible(false)}
      title={t('appletIsSharedWithLibrary')}
      buttonText={t('ok')}
      width="60"
    >
      <SuccessShared
        title={applet.displayName}
        text={getDictionaryText(applet.description || '')}
        keywords={keywords}
        activitiesQuantity={applet.activityCount}
        appletLink={libraryUrl}
        img={applet.image || ''}
      />
    </Modal>
  );
};

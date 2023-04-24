import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { Modal, EnterAppletPassword } from 'shared/components';
import { StyledModalWrapper, StyledBodyLarge } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { useSetupEnterAppletPassword } from 'shared/hooks';

import { page } from 'resources';
import { ViewDataPopupProps } from './ViewDataPopup.types';
import { AppletsSmallTable } from '../../AppletsSmallTable';

export const ViewDataPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: ViewDataPopupProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();

  const showSecondScreen = !!chosenAppletData;

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };

  const handleSubmitCallback = () => {
    if (chosenAppletData) {
      const { appletId, userId } = chosenAppletData;
      navigate(generatePath(page.appletRespondentDataSummary, { appletId, respondentId: userId }));
    }

    handlePopupClose();
  };

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={submitForm}
      title={showSecondScreen ? t('enterAppletPassword') : t('viewData')}
      buttonText={showSecondScreen ? t('submit') : ''}
    >
      <StyledModalWrapper>
        {showSecondScreen ? (
          <EnterAppletPassword
            ref={appletPasswordRef}
            appletId={chosenAppletData?.appletId}
            submitCallback={handleSubmitCallback}
            noEncryption
          />
        ) : (
          <>
            <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
              {t('viewDataDescription')}
            </StyledBodyLarge>
            <AppletsSmallTable tableRows={tableRows} />
          </>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};

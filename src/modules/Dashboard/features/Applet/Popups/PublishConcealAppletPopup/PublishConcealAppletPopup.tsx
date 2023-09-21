import { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { publishAppletApi, concealAppletApi } from 'api';
import { applet, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Modal } from 'shared/components';
import {
  StyledModalWrapper,
  StyledLinearProgress,
  StyledBodyLarge,
  variables,
} from 'shared/styles';
import { useAsync } from 'shared/hooks/useAsync';

export const PublishConcealAppletPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const { result: appletData } = applet.useAppletData() ?? {};
  const { publishConcealPopupVisible, popupProps } = popups.useData();

  const [isProcessPopupVisible, setProcessPopupVisible] = useState(true);
  const [isSuccessPopupVisible, setSuccessPopupVisible] = useState(false);
  const [isErrorPopupVisible, setErrorPopupVisible] = useState(false);

  const isPublishPopupRef = useRef(false);

  useEffect(() => {
    isPublishPopupRef.current = !!appletData?.isPublished;
  }, [appletData?.isPublished]);

  const isPublishPopup = isPublishPopupRef.current;

  const handleCloseProcessPopup = () => setProcessPopupVisible(false);
  const handlePostSuccess = () => {
    handleCloseProcessPopup();
    setSuccessPopupVisible(true);
    popupProps?.onSuccess?.();
  };
  const handlePostError = () => {
    handleCloseProcessPopup();
    setErrorPopupVisible(true);
  };

  const { execute: publishApplet, isLoading: isPublishing } = useAsync(
    publishAppletApi,
    handlePostSuccess,
    handlePostError,
  );
  const { execute: concealApplet, isLoading: isConcealing } = useAsync(
    concealAppletApi,
    handlePostSuccess,
    handlePostError,
  );
  const isLoading = isConcealing || isPublishing;

  const handleClose = () => {
    !isLoading &&
      dispatch(
        popups.actions.setPopupVisible({
          applet: appletData,
          key: 'publishConcealPopupVisible',
          value: false,
          popupProps: undefined,
        }),
      );
  };
  const handleSubmit = () =>
    (isPublishPopup ? concealApplet : publishApplet)({ appletId: appletData?.id as string });
  const handleRetry = () => {
    setErrorPopupVisible(false);
    setProcessPopupVisible(true);

    handleSubmit();
  };

  return (
    <>
      {publishConcealPopupVisible && isProcessPopupVisible && (
        <Modal
          open={publishConcealPopupVisible && isProcessPopupVisible}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onSecondBtnSubmit={handleClose}
          title={t(isPublishPopup ? 'concealAppletPopupTitle' : 'publishAppletPopupTitle')}
          buttonText={!isLoading ? t('yes') : ''}
          secondBtnText={t('cancel')}
          hasSecondBtn={!isLoading}
          data-testid="dashboard-applets-publish-conceal-popup"
        >
          <StyledModalWrapper>
            {isLoading ? (
              <StyledLinearProgress />
            ) : (
              <StyledBodyLarge>
                {t(
                  isPublishing ? 'concealAppletPopupDescription' : 'publishAppletPopupDescription',
                )}
              </StyledBodyLarge>
            )}
          </StyledModalWrapper>
        </Modal>
      )}
      {isSuccessPopupVisible && (
        <Modal
          open={isSuccessPopupVisible}
          onClose={handleClose}
          onSubmit={handleClose}
          title={t(isPublishPopup ? 'concealAppletPopupTitle' : 'publishAppletPopupTitle')}
          buttonText={t('ok')}
          data-testid="dashboard-applets-publish-conceal-popup-success-popup"
        >
          <StyledModalWrapper>
            <StyledBodyLarge>
              <Trans i18nKey="publishAppletPopupSuccessDescription">
                The Applet
                <strong>
                  {' '}
                  <>{{ name: appletData?.displayName }}</>{' '}
                </strong>
                has been
                <> {{ status: t(isPublishPopup ? 'concealed' : 'published') }}</> successfully.
              </Trans>
            </StyledBodyLarge>
          </StyledModalWrapper>
        </Modal>
      )}
      {isErrorPopupVisible && (
        <Modal
          open={isErrorPopupVisible}
          onClose={handleClose}
          onSubmit={handleRetry}
          onSecondBtnSubmit={handleClose}
          title={t(isPublishPopup ? 'concealAppletPopupTitle' : 'publishAppletPopupTitle')}
          buttonText={t('retry')}
          secondBtnText={t('cancel')}
          hasSecondBtn
          data-testid="dashboard-applets-publish-conceal-popup-error-popup"
        >
          <StyledModalWrapper>
            <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
              <Trans i18nKey="publishAppletPopupErrorDescription">
                The Applet
                <strong>
                  {' '}
                  <>{{ name: appletData?.displayName }}</>{' '}
                </strong>
                has not been
                <> {{ status: isPublishPopup ? 'concealed' : 'published' }}</>. Please try again.
              </Trans>
            </StyledBodyLarge>
          </StyledModalWrapper>
        </Modal>
      )}
    </>
  );
};

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, EnterAppletPassword } from 'shared/components';
import {
  StyledModalWrapper,
  StyledErrorText,
  StyledBodyLarge,
  StyledLinearProgress,
  theme,
} from 'shared/styles';
import { getExportDataApi } from 'api';
import {
  getErrorMessage,
  prepareData,
  exportTemplate,
  falseReturnFunc,
  getMediaReportName,
  exportMediaZip,
} from 'shared/utils';
import { useSetupEnterAppletPassword, useAsync } from 'shared/hooks';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { GENERAL_REPORT_NAME, JOURNEY_REPORT_NAME } from 'shared/consts';

import { DataExportPopupProps } from './DataExportPopup.types';
import { AppletsSmallTable } from '../../AppletsSmallTable';

export const DataExportPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: DataExportPopupProps) => {
  const { t } = useTranslation('app');
  const [dataIsExporting, setDataIsExporting] = useState(false);
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();
  const showEnterPwdScreen = !!chosenAppletData && !dataIsExporting;
  const getDecryptedAnswers = useDecryptedActivityData(
    chosenAppletData?.appletId,
    chosenAppletData?.encryption,
  );

  const { execute, error } = useAsync(
    getExportDataApi,
    (res) => {
      if (!res?.data?.result) return;

      const { reportData, activityJourneyData, mediaData } = prepareData(
        res.data.result,
        getDecryptedAnswers,
      );

      exportTemplate(reportData, GENERAL_REPORT_NAME);

      exportTemplate(activityJourneyData, JOURNEY_REPORT_NAME);
      (async () => {
        await exportMediaZip(mediaData, getMediaReportName());
        setDataIsExporting(false);
        handlePopupClose();
      })();
    },
    falseReturnFunc,
    falseReturnFunc,
    [getDecryptedAnswers],
  );

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };

  const handleDataExportSubmit = async () => {
    const { appletId, respondentId } = chosenAppletData || {};

    if (appletId && respondentId) {
      setDataIsExporting(true);

      await execute({ appletId, respondentId });
    }
  };

  const renderModalContent = () => {
    if (showEnterPwdScreen) {
      return (
        <EnterAppletPassword
          ref={appletPasswordRef}
          appletId={chosenAppletData.appletId}
          encryption={chosenAppletData.encryption}
          submitCallback={handleDataExportSubmit}
        />
      );
    }
    if (dataIsExporting) {
      return (
        <>
          <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
            {t('waitForRespondentDataDownload')}
          </StyledBodyLarge>
          <StyledLinearProgress />
        </>
      );
    }

    return (
      <>
        <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
          {t('selectAppletToExportRespondentsData')}
        </StyledBodyLarge>
        <AppletsSmallTable tableRows={tableRows} />
      </>
    );
  };

  useEffect(() => {
    if (error) {
      setDataIsExporting(false);
    }
  }, [error]);

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={submitForm}
      title={showEnterPwdScreen ? t('enterAppletPassword') : t('dataExport')}
      buttonText={showEnterPwdScreen ? t('submit') : ''}
    >
      <StyledModalWrapper>
        {renderModalContent()}
        {error && (
          <StyledErrorText sx={{ marginTop: theme.spacing(1) }}>
            {getErrorMessage(error)}
          </StyledErrorText>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper, StyledBodyLarge } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { page } from 'resources';

import { AppletsSmallTable } from '../../AppletsSmallTable';
import { ScheduleSetupPopupProps } from './ScheduleSetupPopup.types';

export const ScheduleSetupPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: ScheduleSetupPopupProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const showSecondScreen = chosenAppletData && !chosenAppletData.hasIndividualSchedule;
  const appletName = chosenAppletData?.appletName || '';
  const secretUserId = chosenAppletData?.secretUserId || '';

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };
  const handleBackClick = () => setChosenAppletData(null);

  const handlePopupSubmit = () => {
    setPopupVisible(false);
    navigate(
      generatePath(page.appletSchedule, {
        appletId: chosenAppletData?.appletId,
      }),
    );
  };

  useEffect(() => {
    if (chosenAppletData?.hasIndividualSchedule) {
      handlePopupSubmit();
    }
  }, [chosenAppletData]);

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={handlePopupSubmit}
      title={t('individualScheduleSetup')}
      buttonText={showSecondScreen ? t('yes') : ''}
      hasSecondBtn={Boolean(showSecondScreen)}
      secondBtnText={t('back')}
      onSecondBtnSubmit={handleBackClick}
    >
      <StyledModalWrapper>
        {showSecondScreen ? (
          <StyledBodyLarge sx={{ marginTop: theme.spacing(-1) }}>
            <Trans i18nKey="respondentIsAMemberOfTheDefaultSchedule">
              Respondent
              <strong>
                <>{{ secretUserId }}</>
              </strong>
              is a member of the Default Schedule within the
              <strong>
                <>{{ appletName }}</>
              </strong>
              Applet. Do you want to set an Individual schedule for this Respondent?
            </Trans>
          </StyledBodyLarge>
        ) : (
          <>
            <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
              {t('selectAppletToSchedule')}
            </StyledBodyLarge>
            <AppletsSmallTable tableRows={tableRows} />
          </>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};

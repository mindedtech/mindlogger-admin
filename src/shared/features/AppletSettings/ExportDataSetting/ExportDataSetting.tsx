import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { AppletPasswordPopup } from 'modules/Dashboard/features/Applet';
import { Svg } from 'shared/components';
import { applet } from 'shared/state';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
  StyledHeadline,
} from '../AppletSettings.styles';

export const ExportDataSetting = () => {
  const { t } = useTranslation('app');
  const { appletId: id } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption;

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  return (
    <>
      <StyledHeadline>{t('exportData')}</StyledHeadline>
      <StyledAppletSettingsDescription>{t('exportDescription')}</StyledAppletSettingsDescription>
      <Box sx={{ width: 'fit-content' }}>
        <StyledAppletSettingsButton
          onClick={() => setPasswordModalVisible(true)}
          variant="outlined"
          startIcon={<Svg width="18" height="18" id="export" />}
        >
          {t('download')}
        </StyledAppletSettingsButton>
      </Box>
      {passwordModalVisible && (
        <AppletPasswordPopup
          popupVisible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
          appletId={id ?? ''}
          encryption={encryption}
        />
      )}
    </>
  );
};

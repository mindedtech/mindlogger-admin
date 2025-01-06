import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { applet } from 'shared/state/Applet';
import {
  StyledFlexAllCenter,
  StyledLabelLarge,
  StyledTitleBoldLargish,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';

import { ConfigurationPopup } from './ConfigurationPopup/ConfigurationPopup';
import {
  StyledLinkConfiguration,
  StyledProlificIntegration,
  StyledStatusChip,
} from './ProlificIntegration.styles';
import { getProlificApiToken } from './ProlificIntegration.utils';

export const ProlificIntegration = () => {
  const [apiTokenExists, setApiTokenExists] = useState(false);

  const [isConfigurationPopupVisible, setIsConfigurationPopupVisible] = useState(false);

  const handleConnect = () => {
    setIsConfigurationPopupVisible(true);
  };

  const { result: appletData } = applet.useAppletData() ?? {};

  useEffect(() => {
    const checkProlificApiToken = async () => {
      if (!appletData?.id) return;
      const integrationExists = await getProlificApiToken(appletData.id);
      setApiTokenExists(integrationExists);
    };

    checkProlificApiToken();
  }, [appletData?.id]);

  const { t } = useTranslation('app');

  return (
    <StyledProlificIntegration data-testid="prolific-integration">
      <Box>
        <Svg width={130} height={100} id="prolific-integration" />
      </Box>
      <Box>
        <StyledTitleBoldLargish>Prolific</StyledTitleBoldLargish>
        {apiTokenExists && (
          <StyledStatusChip
            sx={{
              backgroundColor: variables.palette.green_light,
            }}
          >
            <Svg width={18} height={18} id="server-connect" />
            <StyledLabelLarge
              sx={{ ml: theme.spacing(0.8), color: variables.palette.on_surface }}
              data-testid="prolific-connected"
            >
              {t('prolific.prolificConnectionStatus')}
            </StyledLabelLarge>
          </StyledStatusChip>
        )}
        <StyledTitleMedium
          sx={{
            color: variables.palette.on_surface,
            mb: theme.spacing(1.2),
          }}
          data-testid="prolific-description"
        >
          {t('prolific.description')}
        </StyledTitleMedium>
        {apiTokenExists && (
          <div>
            <StyledLinkConfiguration onClick={() => {}} data-testid="prolific-view-dashboard">
              {t('prolific.viewDashboard')}
            </StyledLinkConfiguration>
            <StyledLinkConfiguration onClick={() => {}} data-testid="prolific-add-study">
              {t('prolific.addStudy')}
            </StyledLinkConfiguration>
            <StyledLinkConfiguration onClick={() => {}} data-testid="prolific-disconnect">
              {t('prolific.disconnect')}
            </StyledLinkConfiguration>
          </div>
        )}
      </Box>
      <StyledFlexAllCenter>
        {!apiTokenExists && (
          <Button
            variant="contained"
            sx={{ minWidth: '13rem' }}
            onClick={handleConnect}
            data-testid="prolific-connect"
          >
            {t('prolific.connect')}
          </Button>
        )}
      </StyledFlexAllCenter>
      {isConfigurationPopupVisible && (
        <ConfigurationPopup
          appletId={appletData?.id}
          open={isConfigurationPopupVisible}
          onClose={() => setIsConfigurationPopupVisible(false)}
          onApiTokenSubmitted={setApiTokenExists}
          data-testid="prolific-configuration-popup"
        />
      )}
    </StyledProlificIntegration>
  );
};

import { Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, Svg } from 'shared/components';
import { IntegrationTypes } from 'shared/consts';
import { StyledBodyMedium, StyledModalWrapper, theme, variables } from 'shared/styles';

import { deleteProlificIntegration } from '../ProlificIntegration.utils';
import { DisconnectionPopup as DisconnectionPopupProps } from './DisconnectionPopup.types';

export const DisconnectionPopup = ({
  open,
  onClose,
  applet,
  updateAppletData,
}: DisconnectionPopupProps) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | undefined>();
  const [deleting, setDeleting] = useState(false);
  const [apiTokenExists, setApiTokenExists] = useState(true);

  const deleteProlificApiToken = async () => {
    if (!applet.id) return;

    setDeleting(true);
    try {
      await deleteProlificIntegration(applet.id);
      const newApplet = {
        ...applet,
        integrations:
          applet.integrations?.filter(
            (integration) => integration.integrationType !== IntegrationTypes.Prolific,
          ) ?? [],
      };
      updateAppletData(newApplet);
      setApiTokenExists(false);
      onClose();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      open={open && apiTokenExists}
      onClose={onClose}
      title={
        <>
          <Box sx={{ mr: theme.spacing(1.2) }}>
            <Svg width={90} height={90} id="prolific-integration" />
          </Box>
          {t('prolific.disconnect')}
        </>
      }
      disabledSubmit={!deleting && !apiTokenExists}
      submitBtnColor="error"
      onSubmit={deleteProlificApiToken}
      buttonText={deleting ? t('prolific.deleting') : t('prolific.delete')}
      hasLeftBtn
      onLeftBtnSubmit={onClose}
      leftBtnText={t('cancel')}
      data-testid="prolific-disconnect-popup"
      height="60rem"
    >
      <StyledModalWrapper>
        <StyledBodyMedium sx={{ color: variables.palette.on_surface, mb: theme.spacing(1.2) }}>
          {t('prolific.deletionWarning')}
        </StyledBodyMedium>
        {error && (
          <StyledBodyMedium
            sx={{ color: variables.palette.semantic.error, mt: theme.spacing(1.8) }}
            data-testid="upload-data-popup-error"
          >
            {error}
          </StyledBodyMedium>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};

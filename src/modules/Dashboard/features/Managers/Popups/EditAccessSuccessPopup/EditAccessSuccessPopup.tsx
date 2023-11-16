import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import { EditAccessSuccessPopupProps } from './EditAccessSuccessPopup.types';

export const EditAccessSuccessPopup = ({
  onClose,
  open,
  email,
  firstName,
  lastName,
}: EditAccessSuccessPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      title={t('editAccess')}
      open={open}
      onClose={onClose}
      onSubmit={onClose}
      buttonText={t('ok')}
      data-testid="dashboard-managers-edit-access-popup-success-popup"
    >
      <StyledModalWrapper sx={{ marginTop: theme.spacing(-1) }}>
        <Trans i18nKey="confirmEditAccessSuccess">
          Access for the
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
          has been updated successfully.
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};

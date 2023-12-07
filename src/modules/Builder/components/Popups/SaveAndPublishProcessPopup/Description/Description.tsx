import { Trans, useTranslation } from 'react-i18next';

import { StyledBodyLarge, variables } from 'shared/styles';
import { useAppletDataFromForm } from 'modules/Builder/features/SaveAndPublish/SaveAndPublish.hooks';
import { applet } from 'shared/state';
import { AppletThunkTypePrefix } from 'shared/state/Applet/Applet.thunk';

import { SaveAndPublishSteps } from '../SaveAndPublishProcessPopup.types';
import { DescriptionProps } from './Description.types';

export const Description = ({ step }: DescriptionProps) => {
  const { t } = useTranslation('app');
  const getAppletData = useAppletDataFromForm();
  const name = getAppletData()?.displayName;
  const typePrefix = applet.useResponseTypePrefix();

  const hasNotBeenSaved = (
    <Trans i18nKey="appletNotSavedAndPublished">
      <StyledBodyLarge sx={{ color: variables.palette.red }}>
        Applet
        <strong>
          <>{{ name }}</>
        </strong>
        has not been saved and published. Please try again.
      </StyledBodyLarge>
    </Trans>
  );

  switch (step) {
    case SaveAndPublishSteps.AtLeastOneActivity:
      return <StyledBodyLarge>{t('appletIsRequiredOneActivity')}</StyledBodyLarge>;
    case SaveAndPublishSteps.AtLeastOneItem:
      return <StyledBodyLarge>{t('appletIsRequiredOneItem')}</StyledBodyLarge>;
    case SaveAndPublishSteps.EmptyRequiredFields:
      return (
        <>
          {hasNotBeenSaved}
          <StyledBodyLarge sx={{ color: variables.palette.red }}>
            {t('appletHasEmptyRequiredFields')}
          </StyledBodyLarge>
        </>
      );
    case SaveAndPublishSteps.ErrorsInFields:
      return (
        <>
          {hasNotBeenSaved}
          <StyledBodyLarge sx={{ color: variables.palette.red }}>
            {t('appletHasErrorsInFields')}
          </StyledBodyLarge>
        </>
      );
    case SaveAndPublishSteps.BeingCreated: {
      const text =
        typePrefix === AppletThunkTypePrefix.Update
          ? t('appletIsBeingUpdated')
          : t('appletIsBeingCreated');

      return <StyledBodyLarge>{text}</StyledBodyLarge>;
    }
    case SaveAndPublishSteps.Success:
      return (
        <Trans i18nKey="appletSavedAndPublished">
          <StyledBodyLarge>
            Applet
            <strong>
              <>{{ name }}</>
            </strong>
            has been successfully saved and published.
          </StyledBodyLarge>
        </Trans>
      );
    case SaveAndPublishSteps.Failed:
      return hasNotBeenSaved;
    case SaveAndPublishSteps.ReportConfigSave:
      return <StyledBodyLarge>{t('reportConfigNotSaved')}</StyledBodyLarge>;
  }
};

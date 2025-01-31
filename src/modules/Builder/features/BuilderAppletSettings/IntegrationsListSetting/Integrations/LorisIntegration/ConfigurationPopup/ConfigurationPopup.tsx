/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';

import { applet, banners } from 'shared/state';
import { Modal } from 'shared/components/Modal';
import { Svg } from 'shared/components';
import {
  StyledBodyMedium,
  StyledModalWrapper,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { useAppDispatch } from 'redux/store';
import { IntegrationTypes } from 'shared/consts';

import {
  ConfigurationForm,
  ConfigurationPopupProps,
  ConfigurationsSteps,
} from './ConfigurationPopup.types';
import { configurationFormSchema } from './ConfigurationPopup.schema';
import { getScreens } from './ConfigurationPopup.utils';
import { fetchLorisProjects, saveLorisProject } from '../LorisIntegration.utils';

export const ConfigurationPopup = ({ open, onClose }: ConfigurationPopupProps) => {
  const { t } = useTranslation();
  const methods = useForm<ConfigurationForm>({
    resolver: yupResolver(configurationFormSchema()),
    defaultValues: {
      hostname: '',
      username: '',
      password: '',
      project: '',
    },
  });

  const { control, handleSubmit, getValues } = methods;

  const [step, setStep] = useState(ConfigurationsSteps.LorisConfigurations);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { updateAppletData } = applet.actions;

  const saveConfiguration = async () => {
    try {
      const { hostname, username, password } = getValues();
      const projects = await fetchLorisProjects(hostname, username, password);
      setProjects(projects);
      setStep(ConfigurationsSteps.SelectProject);
      setError(undefined);
    } catch (error) {
      console.error(error);
      setError(t('loris.errors.fetchProjectsFailed'));
      setProjects([]);
    }
  };

  const saveProject = async ({ project }: { project?: string }) => {
    try {
      const { hostname, username, password } = getValues();
      if (!appletData?.id) {
        setError(t('loris.errors.appletDataMissing'));

        return;
      }

      if (!project) {
        setError(t('loris.errors.projectMissing'));

        return;
      }

      const data = await saveLorisProject(appletData.id, hostname, username, password, project);

      if (data.result && data.result[0].message.includes('has previously been tied to applet')) {
        setError(t('loris.errors.appletAlreadyTied'));

        return;
      }

      dispatch(
        banners.actions.addBanner({
          key: 'SaveSuccessBanner',
          bannerProps: {
            children: t('loris.connectionSuccessful'),
            'data-testid': 'loris-connection-successful-banner',
          },
        }),
      );

      const appletUpdatedData = {
        ...appletData,
        integrations: [
          ...(appletData?.integrations ?? []),
          {
            integrationType: IntegrationTypes.Loris,
            configuration: {
              hostname,
              username,
              project,
            },
          },
        ],
      };

      dispatch(updateAppletData(appletUpdatedData));
      onClose();
    } catch (error) {
      setError(t('loris.errors.saveProjectFailed'));
      console.error(error);
    }
  };

  const onNext = useCallback(() => {
    handleSubmit(saveConfiguration)();
  }, [handleSubmit]);

  const onSave = useCallback(() => {
    handleSubmit(saveProject)();
  }, [handleSubmit]);

  const screens = useMemo(
    () =>
      getScreens({
        control: control as unknown as Control<FieldValues>,
        setStep,
        onClose,
        onNext,
        projects,
        onSave,
      }),
    [control, setStep, onClose, onNext, projects, onSave],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <>
          <Box sx={{ mr: theme.spacing(1.2) }}>
            <Svg width={94} height={94} id="loris-integration" />
          </Box>
          {t('loris.configurationPopupTitle')}
        </>
      }
      disabledSubmit={screens[step].disabledRightButton}
      onSubmit={screens[step].rightButtonClick}
      buttonText={screens[step].rightButtonText}
      hasLeftBtn
      onLeftBtnSubmit={screens[step].leftButtonClick}
      leftBtnText={screens[step].leftButtonText}
      data-testid="loris-configuration-popup"
      height="60rem"
    >
      <StyledModalWrapper>
        <StyledTitleMedium sx={{ color: variables.palette.on_surface, mb: theme.spacing(1.2) }}>
          {screens[step].description}
        </StyledTitleMedium>
        <FormProvider {...methods}>
          <form noValidate>{screens[step].content}</form>
        </FormProvider>
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

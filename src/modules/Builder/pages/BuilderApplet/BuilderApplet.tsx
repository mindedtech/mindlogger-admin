import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'redux/store';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SaveAndPublish } from 'modules/Builder/features';
import { LinkedTabs, Svg } from 'shared/components';
import {
  useBreadcrumbs,
  useBuilderSessionStorageFormValues,
  useBuilderSessionStorageFormChange,
  useCheckIfNewApplet,
} from 'shared/hooks';
import { StyledBody } from 'shared/styles/styledComponents';
import { applet } from 'shared/state';

import { newAppletTabs } from './BuilderApplet.const';
import { AppletSchema } from './BuilderApplet.schema';
import { getDefaultValues } from './BuilderApplet.utils';
import { AppletFormValues } from './BuilderApplet.types';

export const BuilderApplet = () => {
  const { t } = useTranslation();
  const params = useParams();
  const hiddenHeader = !!params.activityId || !!params.activityFlowId;
  const dispatch = useAppDispatch();
  const { appletId } = useParams();
  const isNewApplet = useCheckIfNewApplet();
  const { result: appletData } = applet.useAppletData() ?? {};
  const appletLabel = (isNewApplet ? t('newApplet') : appletData?.displayName) ?? '';

  const { getFormValues } = useBuilderSessionStorageFormValues<AppletFormValues>(
    getDefaultValues(appletData),
  );

  const methods = useForm<AppletFormValues>({
    defaultValues: getFormValues(),
    resolver: yupResolver(AppletSchema()),
    mode: 'onChange',
  });

  const { handleFormChange } = useBuilderSessionStorageFormChange<AppletFormValues>(
    methods.getValues,
  );

  methods.watch(handleFormChange);

  useBreadcrumbs([
    {
      icon: <Svg id="applet-outlined" width="18" height="18" />,
      label: appletLabel,
      disabledLink: true,
    },
  ]);

  useEffect(() => {
    if (!appletId || isNewApplet) return;

    const { getApplet } = applet.thunk;
    dispatch(getApplet({ appletId }));
  }, [appletId]);

  return (
    <FormProvider {...methods}>
      <StyledBody sx={{ position: 'relative' }}>
        <LinkedTabs hiddenHeader={hiddenHeader} tabs={newAppletTabs} />
        <SaveAndPublish hasPrompt={methods.formState.isDirty} />
      </StyledBody>
    </FormProvider>
  );
};

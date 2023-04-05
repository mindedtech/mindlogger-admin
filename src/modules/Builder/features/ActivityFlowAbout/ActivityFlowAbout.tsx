import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg } from 'shared/components';
import { CheckboxController, InputController } from 'shared/components/FormComponents';
import {
  StyledBodyLarge,
  StyledFlexColumn,
  StyledTitleMedium,
} from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import {
  useBreadcrumbs,
  useBuilderSessionStorageFormChange,
  useBuilderSessionStorageFormValues,
} from 'shared/hooks';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from 'shared/consts';
import { BuilderContainer } from 'shared/features';

import { StyledForm, StyledSvg } from './ActivityFlowAbout.styles';
import { defaultValues } from './ActivityFlowAbout.const';
import { ActivityFlowAboutFormValues } from './ActivityFlowAbout.types';

export const ActivityFlowAbout = () => {
  const { t } = useTranslation();
  const { getFormValues } =
    useBuilderSessionStorageFormValues<ActivityFlowAboutFormValues>(defaultValues);
  const { control, getValues } = useForm<ActivityFlowAboutFormValues>({
    defaultValues: getFormValues(),
    mode: 'onChange',
  });

  const { handleFormChange } =
    useBuilderSessionStorageFormChange<ActivityFlowAboutFormValues>(getValues);

  useBreadcrumbs([
    {
      icon: <Svg id="more-info-outlined" width="18" height="18" />,
      label: t('aboutActivityFlow'),
    },
  ]);

  const commonProps = {
    fullWidth: true,
    control,
  };

  return (
    <BuilderContainer title={t('aboutActivityFlow')}>
      <StyledForm noValidate onChange={handleFormChange}>
        <Box sx={{ mb: theme.spacing(4.4) }}>
          <InputController
            {...commonProps}
            name="activityFlowName"
            label={t('activityFlowName')}
            maxLength={MAX_NAME_LENGTH}
          />
        </Box>
        <Box sx={{ mb: theme.spacing(4.4) }}>
          <InputController
            {...commonProps}
            name="activityFlowDescription"
            label={t('activityFlowDescription')}
            maxLength={MAX_DESCRIPTION_LENGTH}
            multiline
            rows={4}
          />
        </Box>
        <StyledTitleMedium
          color={variables.palette.on_surface_variant}
          sx={{ marginBottom: theme.spacing(1.4) }}
        >
          {t('additionalSettings')}
        </StyledTitleMedium>
        <StyledFlexColumn>
          <CheckboxController
            control={control}
            name="combineReports"
            label={<StyledBodyLarge>{t('combineReportsIntoSingleFile')}</StyledBodyLarge>}
          />
          <CheckboxController
            control={control}
            name="hideBadge"
            label={
              <StyledBodyLarge sx={{ position: 'relative' }}>
                {t('hideBadge')}
                <StyledSvg id="more-info-outlined" />
              </StyledBodyLarge>
            }
          />
        </StyledFlexColumn>
      </StyledForm>
    </BuilderContainer>
  );
};

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';

import { CheckboxController, InputController } from 'shared/components/FormComponents';
import {
  StyledHeadlineLarge,
  StyledBuilderWrapper,
  StyledBodyLarge,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { useBreadcrumbs } from 'shared/hooks';
import { Svg, Tooltip, Uploader } from 'shared/components';
import { MAX_DESCRIPTION_LENGTH_LONG, MAX_FILE_SIZE_1GB, MAX_NAME_LENGTH } from 'shared/consts';
import { byteFormatter } from 'shared/utils';

import { Uploads } from '../../components';
import { StyledForm, StyledContainer, StyledSvg, StyledSettings } from './ActivityAbout.styles';
import { defaultValues } from './ActivityAbout.const';
import { ActivityAboutSchema } from './ActivityAbout.schema';
import { FormValues } from './ActivityAbout.types';

export const ActivityAbout = () => {
  const { t } = useTranslation();

  useBreadcrumbs([
    {
      icon: <Svg id="more-info-outlined" width="18" height="18" />,
      label: t('aboutActivity'),
    },
  ]);

  const { control, setValue, watch } = useForm<FormValues>({
    resolver: yupResolver(ActivityAboutSchema()),
    defaultValues,
    mode: 'onChange',
  });

  const commonProps = {
    control,
    fullWidth: true,
  };

  const commonUploaderProps = {
    width: 20,
    height: 20,
    maxFileSize: MAX_FILE_SIZE_1GB,
  };

  const uploads = [
    {
      title: t('activityImg'),
      tooltipTitle: t('activityImageDescription'),
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue('activityImg', val)}
          getValue={() => watch('activityImg')}
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_1GB) })}
        />
      ),
    },
    {
      title: t('activityWatermark'),
      tooltipTitle: t('activitySplashScreenDescription'),
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue('activityWatermark', val)}
          getValue={() => watch('activityWatermark')}
          description={t('uploadTransfluent', { size: byteFormatter(MAX_FILE_SIZE_1GB) })}
        />
      ),
    },
  ];

  const checkboxes = [
    {
      name: 'showAllQuestionsAtOnce',
      label: (
        <StyledBodyLarge sx={{ position: 'relative' }}>
          {t('showAllQuestionsAtOnce')}
          <Tooltip tooltipTitle={t('webAppOnlyFeature')}>
            <span>
              <StyledSvg id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledBodyLarge>
      ),
    },
    {
      name: 'allowToSkipAllItems',
      label: <StyledBodyLarge>{t('allowToSkipAllItems')}</StyledBodyLarge>,
    },
    {
      name: 'disableAbilityToChangeResponse',
      label: <StyledBodyLarge>{t('disableAbilityToChangeResponse')}</StyledBodyLarge>,
    },
    {
      name: 'onlyAdminPanelActivity',
      label: (
        <StyledBodyLarge>
          {t('onlyAdminPanelActivity')}
          <Tooltip tooltipTitle={t('webAppOnlyFeatureTooltip')}>
            <span>
              <StyledSvg id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledBodyLarge>
      ),
    },
  ];

  return (
    <StyledBuilderWrapper>
      <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(4) }}>
        {t('aboutActivity')}
      </StyledHeadlineLarge>
      <StyledForm noValidate>
        <Box sx={{ display: 'flex' }}>
          <StyledContainer>
            <Box sx={{ marginBottom: theme.spacing(4.4) }}>
              <InputController
                {...commonProps}
                name="activityName"
                maxLength={MAX_NAME_LENGTH}
                label={t('activityName')}
              />
            </Box>
            <InputController
              {...commonProps}
              name="activityDescription"
              maxLength={MAX_DESCRIPTION_LENGTH_LONG}
              label={t('activityDescription')}
              multiline
              rows={4}
            />
          </StyledContainer>
          <Uploads uploads={uploads} />
        </Box>
        <StyledTitleMedium color={variables.palette.on_surface_variant} sx={{ marginBottom: 1.6 }}>
          {t('itemLevelSettings')}
        </StyledTitleMedium>
        <StyledSettings>
          {checkboxes.map(({ name, label }) => (
            <CheckboxController
              key={name}
              control={control}
              name={name as keyof FormValues}
              label={label}
            />
          ))}
        </StyledSettings>
      </StyledForm>
    </StyledBuilderWrapper>
  );
};

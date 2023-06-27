import { useTranslation } from 'react-i18next';

import { StyledHeadlineLarge, StyledTitleLarge, theme } from 'shared/styles';
import { useBreadcrumbs } from 'shared/hooks';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { PerformanceTaskHeader } from '../PerformanceTaskHeader';
import { NameDescription } from '../NameDescription';
import { Instruction } from '../Instruction';
import { GeneralSettings } from './GeneralSettings';
import { StyledPerformanceTaskBody } from '../PerformanceTasks.styles';
import { GyroscopeAndTouchProps } from './GyroscopeAndTouch.types';
import { PerformanceTasks } from '../../Activities/Activities.types';

export const GyroscopeAndTouch = ({ type }: GyroscopeAndTouchProps) => {
  const { t } = useTranslation();
  const { fieldName } = useCurrentActivity();
  useBreadcrumbs();

  return (
    <>
      <PerformanceTaskHeader />
      <StyledPerformanceTaskBody sx={{ p: theme.spacing(2.4, 6.4) }}>
        <StyledHeadlineLarge sx={{ mb: theme.spacing(3) }}>
          {t(type === PerformanceTasks.Gyroscope ? 'gyroscope' : 'touch')}
        </StyledHeadlineLarge>
        <NameDescription />
        <GeneralSettings />
        <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>{t('instructions')}</StyledTitleLarge>
        <Instruction
          name={`${fieldName}.items.0.question`}
          title={t('gyroscopeAndTouchInstructions.overview.title')}
          description={t('gyroscopeAndTouchDesc.overview')}
        />
        <Instruction
          name={`${fieldName}.items.1.question`}
          title={t('gyroscopeAndTouchInstructions.practice.title')}
          description={t('gyroscopeAndTouchDesc.practice')}
        />
        <Instruction
          name={`${fieldName}.items.3.question`}
          title={t('gyroscopeAndTouchInstructions.test.title')}
          description={t('gyroscopeAndTouchDesc.test')}
        />
      </StyledPerformanceTaskBody>
    </>
  );
};

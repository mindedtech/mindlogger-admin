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
  const { perfTaskItemField } = useCurrentActivity();
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
          title={t('gyroscopeAndTouchInstructions.overview.title')}
          description={t('gyroscopeAndTouchDesc.overview')}
        />
        <Instruction
          name={`${perfTaskItemField}.practice.instruction`}
          title={t('gyroscopeAndTouchInstructions.practice.title')}
          description={t('gyroscopeAndTouchDesc.practice')}
        />
        <Instruction
          name={`${perfTaskItemField}.test.instruction`}
          title={t('gyroscopeAndTouchInstructions.test.title')}
          description={t('gyroscopeAndTouchDesc.test')}
        />
      </StyledPerformanceTaskBody>
    </>
  );
};

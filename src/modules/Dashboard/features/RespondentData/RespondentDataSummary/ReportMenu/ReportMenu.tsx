import { useContext } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  theme,
  StyledHeadlineLarge,
  StyledLabelLarge,
  StyledBodyLarge,
  variables,
} from 'shared/styles';
import { useRespondentLabel } from 'modules/Dashboard/hooks';
import { RespondentDataContext } from 'modules/Dashboard/pages/RespondentData/RespondentData.context';

import { StyledMenu } from '../../RespondentData.styles';
import { StyledActivity } from './ReportMenu.styles';
import { ReportMenuProps } from './ReportMenu.types';

export const ReportMenu = ({ activities }: ReportMenuProps) => {
  const { t } = useTranslation();
  const respondentLabel = useRespondentLabel();
  const { selectedActivity, setSelectedActivity } = useContext(RespondentDataContext);

  return (
    <StyledMenu>
      <Box sx={{ margin: theme.spacing(0, 2.4, 3.2) }}>
        <StyledHeadlineLarge>{t('activities')}</StyledHeadlineLarge>
        <StyledLabelLarge>{respondentLabel}</StyledLabelLarge>
      </Box>
      {activities?.map((activity) => (
        <StyledActivity
          key={String(activity.id)}
          isSelected={selectedActivity?.id === activity.id}
          onClick={() => setSelectedActivity(activity)}
        >
          <StyledBodyLarge color={variables.palette.on_surface}>{activity.name}</StyledBodyLarge>
        </StyledActivity>
      ))}
    </StyledMenu>
  );
};

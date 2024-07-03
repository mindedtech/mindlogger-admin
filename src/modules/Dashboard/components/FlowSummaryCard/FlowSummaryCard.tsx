import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ActionsMenu, Chip, ChipShape, Svg } from 'shared/components';
import { StyledEllipsisText, StyledFlexColumn, variables } from 'shared/styles';
import { getDictionaryText } from 'shared/utils';

import { FlowSummaryCardProps } from './FlowSummaryCard.types';
import { StyledRoot } from './FlowSummaryCard.styles';
import { FlowSummaryThumbnail } from './FlowSummaryThumbnail';

export const FlowSummaryCard = <T,>({
  flow: { activities, description, name },
  menuItems,
  ...otherProps
}: FlowSummaryCardProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <StyledRoot {...otherProps}>
      <FlowSummaryThumbnail activities={activities} />

      <StyledFlexColumn sx={{ gap: 0.8, flexGrow: 1, overflow: 'hidden' }}>
        <StyledEllipsisText sx={{ fontSize: variables.font.size.xxl }}>{name}</StyledEllipsisText>

        <StyledEllipsisText
          sx={{ color: variables.palette.on_surface_variant, fontSize: variables.font.size.lg }}
        >
          {getDictionaryText(description)}
        </StyledEllipsisText>
      </StyledFlexColumn>

      <Box sx={{ display: 'flex', gap: 0.8 }}>
        <Chip
          color="primary"
          icon={<Svg aria-hidden id="multiple-activities" height={18} width={18} />}
          shape={ChipShape.Rectangular}
          title={t('flow')}
        />

        <Chip
          icon={<Svg aria-hidden id="checklist-filled" height={18} width={18} />}
          shape={ChipShape.Rectangular}
          title={t('activityCount', { count: activities?.length ?? 0 })}
        />
      </Box>

      {menuItems && <ActionsMenu buttonColor="secondary" menuItems={menuItems} />}
    </StyledRoot>
  );
};

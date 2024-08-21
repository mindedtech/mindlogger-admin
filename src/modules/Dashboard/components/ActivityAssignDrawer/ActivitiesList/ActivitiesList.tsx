import { useTranslation } from 'react-i18next';
import { ListItemIcon, ListItemText } from '@mui/material';

import { Chip, ChipShape, Svg } from 'shared/components';
import { ActivityFlowThumbnail } from 'modules/Dashboard/components';
import { StyledActivityThumbnailContainer, StyledActivityThumbnailImg } from 'shared/styles';

import {
  StyledList,
  StyledListItem,
  StyledListItemButton,
  StyledListItemTextPrimary,
  StyledReadOnlyButton,
} from './ActivitiesList.styles';
import { ActivitiesListProps } from './ActivitiesList.types';
import { ActivityCheckbox } from '../ActivityCheckbox';

export const ActivitiesList = ({
  activities,
  flows,
  activityIds,
  flowIds,
  onChangeActivityIds,
  onChangeFlowIds,
  isReadOnly,
  'data-testid': dataTestId,
}: ActivitiesListProps) => {
  const { t } = useTranslation('app');

  const handleActivityClick = (id: string) => {
    if (!activityIds || !onChangeActivityIds) return;

    if (activityIds?.includes(id)) {
      onChangeActivityIds(activityIds.filter((activityId) => activityId !== id));
    } else {
      onChangeActivityIds([...activityIds, id]);
    }
  };

  const handleFlowClick = (id: string) => {
    if (!flowIds || !onChangeFlowIds) return;

    if (flowIds?.includes(id)) {
      onChangeFlowIds(flowIds.filter((flowId) => flowId !== id));
    } else {
      onChangeFlowIds([...flowIds, id]);
    }
  };

  const ButtonComponent = isReadOnly ? StyledReadOnlyButton : StyledListItemButton;

  return (
    <StyledList data-testid={dataTestId} sx={isReadOnly ? { height: 'auto', py: 0.5 } : undefined}>
      {flows.map(({ id = '', activities, name }) => (
        <StyledListItem
          key={id}
          secondaryAction={
            isReadOnly ? undefined : (
              <ActivityCheckbox
                checked={flowIds?.includes(id)}
                onChange={() => handleFlowClick(id)}
                data-testid={`${dataTestId}-flow-checkbox-${id}`}
              />
            )
          }
          data-testid={`${dataTestId}-flow-item`}
        >
          <ButtonComponent onClick={isReadOnly ? undefined : () => handleFlowClick(id)}>
            <ListItemIcon>
              <StyledActivityThumbnailContainer sx={{ width: '4.8rem', height: '4.8rem' }}>
                <ActivityFlowThumbnail activities={activities} />
              </StyledActivityThumbnailContainer>
            </ListItemIcon>
            <ListItemText
              primary={
                <StyledListItemTextPrimary>
                  {name}
                  <Chip
                    color="secondary"
                    size="medium"
                    icon={<Svg aria-hidden id="multiple-activities" height={18} width={18} />}
                    shape={ChipShape.Rectangular}
                    title={t('flow')}
                  />
                </StyledListItemTextPrimary>
              }
            />
          </ButtonComponent>
        </StyledListItem>
      ))}

      {activities.map(({ id = '', name, image }) => (
        <StyledListItem
          key={id}
          secondaryAction={
            isReadOnly ? undefined : (
              <ActivityCheckbox
                checked={activityIds?.includes(id)}
                onChange={() => handleActivityClick(id)}
                data-testid={`${dataTestId}-activity-checkbox-${id}`}
              />
            )
          }
          data-testid={`${dataTestId}-activity-item`}
        >
          <ButtonComponent onClick={isReadOnly ? undefined : () => handleActivityClick(id)}>
            <ListItemIcon>
              <StyledActivityThumbnailContainer sx={{ width: '4.8rem', height: '4.8rem' }}>
                {!!image && <StyledActivityThumbnailImg src={image} alt={name} />}
              </StyledActivityThumbnailContainer>
            </ListItemIcon>
            <ListItemText primary={<StyledListItemTextPrimary>{name}</StyledListItemTextPrimary>} />
          </ButtonComponent>
        </StyledListItem>
      ))}
    </StyledList>
  );
};

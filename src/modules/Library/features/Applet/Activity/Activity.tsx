import { Fragment, SyntheticEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledSvgArrowContainer } from 'shared/styles';

import { ActivityProps } from './Activity.types';
import {
  StyledActivityContainer,
  StyledActivityHeader,
  StyledActivityName,
  StyledItemsList,
} from './Activity.styles';
import { Item } from '../Item';
import { AppletForm } from '../Applet.types';

export const Activity = ({ appletId, activity: { id, name, items } }: ActivityProps) => {
  const { watch, setValue } = useFormContext<AppletForm>();
  const watchApplet = watch(appletId);
  const [activityVisible, setActivityVisible] = useState(false);
  const [activityIndeterminate, setActivityIndeterminate] = useState(false);
  const [activityChecked, setActivityChecked] = useState(false);

  const handleActivityChecked = (event: SyntheticEvent<Element, Event>, checked: boolean) => {
    setActivityChecked(checked);
    setValue(appletId, checked ? items.map((item) => ({ id: item.id, activityId: id })) : []);
  };

  useEffect(() => {
    const currentActivityItems = watchApplet.filter((item) => item.activityId === id);
    const isAllItemsSelected = currentActivityItems.length === items.length;
    const isIndeterminate = currentActivityItems.length > 0 && !isAllItemsSelected;
    setActivityIndeterminate(isIndeterminate);
    setActivityChecked(isAllItemsSelected);
  }, [watchApplet]);

  return (
    <StyledActivityContainer>
      <Checkbox
        sx={{ width: '4rem', height: '4rem' }}
        checked={activityChecked}
        indeterminate={activityIndeterminate}
        onChange={handleActivityChecked}
      />
      <StyledActivityHeader onClick={() => setActivityVisible((prevState) => !prevState)}>
        <StyledSvgArrowContainer>
          <Svg id={activityVisible ? 'navigate-up' : 'navigate-down'} />
        </StyledSvgArrowContainer>
        <StyledActivityName>{name}</StyledActivityName>
      </StyledActivityHeader>
      {activityVisible && !!items?.length && (
        <StyledItemsList>
          {items?.map((item) => (
            <Fragment key={item.id}>
              <Item appletId={appletId} activityId={id} item={item} />
            </Fragment>
          ))}
        </StyledItemsList>
      )}
    </StyledActivityContainer>
  );
};

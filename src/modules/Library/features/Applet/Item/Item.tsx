import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import 'md-editor-rt/lib/style.css';
import { Checkbox } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledSvgArrowContainer } from 'shared/styles';

import {
  StyledItemContainer,
  StyledItemHeader,
  StyledMdEditor,
  StyledItemContent,
} from './Item.styles';
import { ItemProps } from './Item.types';
import { renderItemContent } from './Item.utils';
import { AppletForm } from '../Applet.types';

export const Item = ({ item, appletId, activityId }: ItemProps) => {
  const { control, getValues, setValue } = useFormContext<AppletForm>();
  const [itemVisible, setItemVisible] = useState(false);

  const handleSelect = () => {
    const selectedItems = getValues()[appletId];
    const checked = !!selectedItems?.find(({ id }) => id === item.id);
    const updatedSelectedItems = checked
      ? selectedItems?.filter(({ id }) => id !== item.id)
      : [
          ...selectedItems,
          {
            id: item.id,
            activityId,
          },
        ];
    setValue(appletId, updatedSelectedItems);
  };

  return (
    <StyledItemContainer>
      <Controller
        name={appletId}
        control={control}
        render={() => (
          <Checkbox
            sx={{ width: '4rem', height: '4rem' }}
            checked={!!getValues()[appletId].find(({ id }) => id === item.id)}
            onChange={handleSelect}
          />
        )}
      />
      <StyledItemHeader onClick={() => setItemVisible((prevState) => !prevState)}>
        <StyledSvgArrowContainer>
          <Svg id={itemVisible ? 'navigate-up' : 'navigate-right'} />
        </StyledSvgArrowContainer>
        <StyledMdEditor modelValue={item.question} previewOnly />
      </StyledItemHeader>
      {itemVisible && <StyledItemContent>{renderItemContent(item)}</StyledItemContent>}
    </StyledItemContainer>
  );
};

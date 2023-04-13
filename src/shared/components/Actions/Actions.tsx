import { MouseEvent, useState } from 'react';

import { Tooltip } from 'shared/components/Tooltip';
import { Svg } from 'shared/components/Svg';

import {
  StyledActions,
  StyledActionButton,
  StyledActionsWrapper,
  StyledDotsSvg,
} from './Actions.styles';
import { Action, ActionsProps } from './Actions.types';

export const Actions = ({
  items,
  context,
  visibleByDefault = false,
  hasStaticActions,
  sxProps,
  dragHandleProps,
  isDragging,
}: ActionsProps) => {
  const [visibleActions, setVisibleActions] = useState(false);

  const onClick = (action: Action['action']) => (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    action(context, event);
  };

  const isVisible = visibleByDefault || visibleActions || Boolean(isDragging);

  return (
    <StyledActionsWrapper
      sx={sxProps}
      onMouseEnter={() => setVisibleActions(true)}
      onMouseLeave={() => setVisibleActions(false)}
    >
      <StyledActions isVisible={isVisible}>
        {items.map(
          ({
            icon,
            disabled = false,
            action,
            tooltipTitle,
            isDisplayed = true,
            active = false,
            isStatic,
          }) => {
            if (!isDisplayed) return null;

            return (
              <Tooltip key={icon.props.id} tooltipTitle={tooltipTitle}>
                <span>
                  <StyledActionButton
                    isActive={active}
                    disabled={disabled}
                    onClick={onClick(action)}
                    isVisible={isVisible || (hasStaticActions && !isVisible && isStatic)}
                  >
                    {icon}
                  </StyledActionButton>
                </span>
              </Tooltip>
            );
          },
        )}
        {dragHandleProps && (
          <StyledActionButton
            isVisible={isVisible}
            isActive={false}
            disabled={false}
            {...dragHandleProps}
          >
            <Svg id="drag" />
          </StyledActionButton>
        )}
      </StyledActions>
      <StyledDotsSvg isVisible={!isVisible} id="dots" width={18} height={4} />
    </StyledActionsWrapper>
  );
};

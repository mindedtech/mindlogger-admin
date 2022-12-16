import { useState } from 'react';

import { ToolTip } from 'components/ToolTip';

import {
  StyledActions,
  StyledActionButton,
  StyledSvg,
  StyledActionsWrapper,
} from './Actions.styles';
import { ActionsProps } from './Actions.types';

export const Actions = ({ items, context }: ActionsProps) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <StyledActionsWrapper
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showActions ? (
        <StyledActions>
          {items.map(({ icon, disabled = false, action, toolTipTitle }, i) => (
            <ToolTip key={i} toolTipTitle={toolTipTitle}>
              <span>
                <StyledActionButton disabled={disabled} onClick={() => action(context)}>
                  {icon}
                </StyledActionButton>
              </span>
            </ToolTip>
          ))}
        </StyledActions>
      ) : (
        <StyledSvg id="dots" width={18} height={4} />
      )}
    </StyledActionsWrapper>
  );
};

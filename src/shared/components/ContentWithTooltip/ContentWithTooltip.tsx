import { useRef } from 'react';

import { useIsTextNodeEllipsed, useWindowSize } from 'shared/hooks';
import { Tooltip, TooltipUiType } from 'shared/components/Tooltip';

import { StyledCellText } from './ContentWithTooltip.styles';
import { ContentWithTooltipProps } from './ContentWithTooltip.types';

export const ContentWithTooltip = ({ value, styles = {} }: ContentWithTooltipProps) => {
  const { width } = useWindowSize();
  const elementRef = useRef<HTMLDivElement>(null);
  const hasTooltip = useIsTextNodeEllipsed(elementRef, [elementRef.current, width, value]);

  return (
    <Tooltip
      placement={'top'}
      uiType={TooltipUiType.Secondary}
      tooltipTitle={hasTooltip ? value : undefined}
    >
      <StyledCellText sx={styles} ref={elementRef}>
        {value}
      </StyledCellText>
    </Tooltip>
  );
};

import { useRef } from 'react';

import { useHeaderSticky } from 'shared/hooks';
import { StyledBuilderWrapper, StyledFlexColumn, StyledHeadlineLarge, theme } from 'shared/styles';

import { BuilderContainerProps } from './BuilderContainer.types';
import { StyledHeader } from './BuilderContainer.styles';

export const BuilderContainer = ({
  title,
  Header,
  children,
  headerProps,
}: BuilderContainerProps) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);

  const HeaderComponent = Header || StyledHeader;

  return (
    <StyledBuilderWrapper ref={containerRef} sx={{ position: 'relative' }}>
      <HeaderComponent isSticky={isHeaderSticky} headerProps={headerProps}>
        <StyledHeadlineLarge>{title}</StyledHeadlineLarge>
      </HeaderComponent>
      <StyledFlexColumn sx={{ padding: theme.spacing(1.6, 6.4, 2.4) }}>{children}</StyledFlexColumn>
    </StyledBuilderWrapper>
  );
};

import { Box, styled } from '@mui/material';

import {
  theme,
  variables,
  commonStickyStyles,
  StyledHeadlineLarge,
  StyledFlexColumn,
  StyledTitleSmall,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledBar = styled(Box, shouldForwardProp)`
  width: ${({ hasItem }: { hasItem: boolean }) => (hasItem ? '38.7rem' : '100%')};
  flex-shrink: 0;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  height: 100%;
  overflow-y: auto;
  transition: ${variables.transitions.width};
`;

export const StyledHeader = styled(StyledHeadlineLarge, shouldForwardProp)`
  ${commonStickyStyles};
  padding: ${theme.spacing(4.8, 1.6, 2.4, 0)};
  box-shadow: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.boxShadow.light0 : 'none'};
`;

export const StyledContent = styled(Box, shouldForwardProp)`
  padding-bottom: ${theme.spacing(2.8)};

  ${({ isCompact }: { isCompact: boolean }) =>
    !isCompact &&
    `
    padding-right: ${theme.spacing(13.6)};
  `}
`;

export const StyledSettingsGroup = styled(Box, shouldForwardProp)`
  padding: ${theme.spacing(0.8, 0)};
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  ${({ isCompact }: { isCompact: boolean }) =>
    isCompact &&
    `
    padding: ${theme.spacing(1.2, 0)};
    border-top: unset;
  `};
`;

export const StyledSettings = styled(Box, shouldForwardProp)`
  display: flex;
  margin-left: ${theme.spacing(12)};
  ${({ isCompact }: { isCompact: boolean }) =>
    isCompact &&
    `
    margin: ${theme.spacing(1.6)};
    border-left: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
    flex-direction: column;
  `};
`;

export const StyledSetting = styled(StyledFlexColumn, shouldForwardProp)`
  flex-basis: 12rem;
  align-items: center;
  width: 12rem;
  height: 12rem;
  padding: ${theme.spacing(3.2, 1.4, 1.6)};
  text-align: center;
  cursor: pointer;
  border-radius: ${variables.borderRadius.lg};
  :hover {
    background-color: ${variables.palette.on_surface_alfa12};
  }
  svg {
    fill: ${variables.palette.on_surface_variant};
  }
  ${({ isCompact }: { isSelected: boolean; isCompact: boolean; disabled?: boolean }) =>
    isCompact &&
    `
    flex-basis: unset;
    flex-direction: row;
    justify-content: flex-start;
    width: 27.4rem;
    height: 4.8rem;
    padding: ${theme.spacing(0, 1.8)};
    margin: ${theme.spacing(0.2, 0, 0, 1.6)};
    border-radius: ${variables.borderRadius.xxxl};
    svg {
      margin-right: ${theme.spacing(1.6)};
    }
    p {
      margin-top: 0;
    }
    :hover {
      background-color: ${variables.palette.on_surface_alfa12};
    }
    
`};
  ${({ disabled }) =>
    disabled &&
    `
      pointer-events: none;
      opacity: ${variables.opacity.disabled};
  `}
  ${({ isSelected }) =>
    isSelected &&
    `
    background-color: ${variables.palette.secondary_container};
    p {
      font-weight: ${variables.font.weight.bold};
      color: ${variables.palette.on_secondary_container};
    }
    :hover {
      background-color: ${variables.palette.secondary_container};
      svg {
        fill: ${variables.palette.primary};
      }
    };
  `};
`;

export const StyledTitle = styled(StyledTitleSmall)`
  margin-top: ${theme.spacing(1)};
`;

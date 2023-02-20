import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import {
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelMedium,
  StyledBodyMedium,
  StyledTitleMedium,
  StyledFlexWrap,
} from 'styles/styledComponents';
import { shouldForwardProp } from 'utils/shouldForwardProp';

const commonImgStyles = `
  width: 4rem;
  height: 4rem;
  border-radius: 100%;
`;

export const StyledNotification = styled(StyledFlexWrap, shouldForwardProp)`
  padding: ${theme.spacing(1.6)};
  position: relative;
  cursor: pointer;
  border-bottom: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  transition: ${variables.transitions.bgColor};
  background-color: ${({ active }: { active: boolean }) =>
    active ? variables.palette.secondary_container : 'transparent'};

  &:hover {
    background-color: ${variables.palette.on_surface_alfa8};
  }
`;

export const StyledTopSection = styled(Box)`
  display: flex;
`;

export const StyledTitle = styled(StyledTitleMedium)`
  margin-top: ${theme.spacing(0.4)};
`;

export const StyledMessage = styled(StyledBodyMedium, shouldForwardProp)`
  margin-top: ${theme.spacing(0.4)};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${({ isActive }: { isActive: boolean }) => (isActive ? '4' : '2')};
  -webkit-box-orient: vertical;
`;

export const StyledLeftSection = styled(StyledFlexTopCenter)`
  margin-right: ${theme.spacing(2.1)};
`;

export const StyledImageWrapper = styled(Box)`
  ${commonImgStyles};
  background-color: ${variables.palette.primary_container};
  position: relative;
`;

export const StyledImage = styled('img')`
  ${commonImgStyles};
`;

export const StyledLogo = styled('img')`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 100%;
  border: ${variables.borderWidth.lg} solid ${variables.palette.surface1};
  background-color: ${variables.palette.surface1};
  position: absolute;
  bottom: -0.75rem;
  right: -0.75rem;
`;

export const StyledInfo = styled(StyledFlexColumn)`
  width: 27rem;
  margin-right: ${theme.spacing(2.1)};
`;

export const StyledRightSection = styled(StyledFlexColumn)`
  justify-content: space-between;
`;

export const StyledInfoCircle = styled(Box)`
  width: 1rem;
  height: 1rem;
  border-radius: 100%;
  background-color: ${variables.palette.semantic.error};
  align-self: flex-end;
`;

export const StyledBottomSection = styled(StyledFlexColumn)`
  flex: 0 0 100%;
  padding-left: ${theme.spacing(3.8)};
`;

export const StyledBtn = styled(Button)`
  margin-top: ${theme.spacing(1.2)};
`;

export const StyledTimeAgo = styled(StyledLabelMedium)`
  padding-left: ${theme.spacing(2.4)};
  margin-top: ${theme.spacing(0.8)};
`;

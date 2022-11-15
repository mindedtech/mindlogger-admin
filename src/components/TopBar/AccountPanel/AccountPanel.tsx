import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { Icon } from 'components/Icon';
import { StyledTitleSmall } from 'styles/styledComponents/Typography';
import avatarSrc from 'assets/images/avatar.png';
import { variables } from 'styles/variables';

import {
  StyledAccountDrawer,
  StyledHeader,
  StyledHideBtn,
  StyledHeaderInfo,
  StyledImage,
  StyledAvatarWrapper,
  StyledHeaderRight,
  StyledFooter,
  StyledLogOutBtn,
} from './AccountPanel.styles';
import { AccountPanelProps } from './AccountPanel.types';

export const AccountPanel = ({ setShowDrawer, showDrawer }: AccountPanelProps): JSX.Element => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const userData = auth.useUserData();

  const handleLogout = () => {
    dispatch(auth.actions.resetAuthorization());
  };

  return (
    <StyledAccountDrawer anchor="right" open={showDrawer}>
      <StyledHeader>
        <StyledHideBtn onClick={() => setShowDrawer(false)}>
          <Icon.NavigateNext color={variables.palette.on_surface_variant} />
        </StyledHideBtn>
        <StyledHeaderRight>
          <StyledHeaderInfo>
            <StyledTitleSmall color={variables.palette.on_surface_variant}>
              {t('myAccount')}
            </StyledTitleSmall>
            <StyledTitleSmall color={variables.palette.on_surface_variant}>
              {userData.email}
            </StyledTitleSmall>
          </StyledHeaderInfo>
          <StyledAvatarWrapper>
            <StyledImage src={avatarSrc} alt="Avatar" />
          </StyledAvatarWrapper>
        </StyledHeaderRight>
      </StyledHeader>
      <StyledFooter>
        <StyledLogOutBtn variant="text" startIcon={<Icon.LogOut />} onClick={handleLogout}>
          {t('logOut')}
        </StyledLogOutBtn>
      </StyledFooter>
    </StyledAccountDrawer>
  );
};

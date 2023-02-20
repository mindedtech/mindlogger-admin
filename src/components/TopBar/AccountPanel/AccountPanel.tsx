import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg } from 'components';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import avatarSrc from 'assets/images/avatar.png';
import { variables } from 'styles/variables';
import {
  StyledLabelBoldSmall,
  StyledLabelSmall,
  StyledTitleSmall,
  StyledFlexTopCenter,
  StyledClearedButton,
} from 'styles/styledComponents';

import { Notifications } from '../Notifications';
import {
  StyledAccountDrawer,
  StyledHeader,
  StyledHeaderInfo,
  StyledImage,
  StyledAvatarWrapper,
  StyledFooter,
  StyledLogOutBtn,
  StyledQuantity,
  StyledCloseWrapper,
} from './AccountPanel.styles';
import { AccountPanelProps } from './AccountPanel.types';

export const AccountPanel = ({ alertsQuantity, setShowDrawer, showDrawer }: AccountPanelProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const authData = auth.useData();

  const handleLogout = () => dispatch(auth.actions.resetAuthorization());

  return (
    <StyledAccountDrawer anchor="right" open={showDrawer} hideBackdrop>
      <Box>
        <StyledHeader>
          <StyledFlexTopCenter>
            <StyledAvatarWrapper>
              <StyledImage src={avatarSrc} alt="Avatar" />
              {alertsQuantity > 0 && (
                <StyledQuantity>
                  <StyledLabelBoldSmall color={variables.palette.white}>
                    {alertsQuantity}
                  </StyledLabelBoldSmall>
                </StyledQuantity>
              )}
            </StyledAvatarWrapper>
            <StyledHeaderInfo>
              <StyledTitleSmall>{t('myAccount')}</StyledTitleSmall>
              {authData?.user && (
                <StyledLabelSmall color={variables.palette.on_surface_variant}>
                  {authData.user.email}
                </StyledLabelSmall>
              )}
            </StyledHeaderInfo>
          </StyledFlexTopCenter>
          <StyledCloseWrapper>
            <StyledClearedButton onClick={() => setShowDrawer(false)}>
              <Svg id="close" />
            </StyledClearedButton>
          </StyledCloseWrapper>
        </StyledHeader>
        <Notifications alertsQuantity={alertsQuantity} />
      </Box>
      <StyledFooter>
        <StyledLogOutBtn
          variant="text"
          startIcon={<Svg id="logout" width="16" height="20" />}
          onClick={handleLogout}
        >
          {t('logOut')}
        </StyledLogOutBtn>
      </StyledFooter>
    </StyledAccountDrawer>
  );
};

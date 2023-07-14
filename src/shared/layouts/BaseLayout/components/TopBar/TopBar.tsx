import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { useAppDispatch } from 'redux/store';
import { variables } from 'shared/styles/variables';
import { StyledFlexTopCenter, StyledLabelBoldMedium } from 'shared/styles/styledComponents';
import avatarSrc from 'assets/images/avatar.png';
import { page } from 'resources';
import { auth } from 'modules/Auth/state';
import { account } from 'modules/Dashboard/state';

import { AccountPanel } from './AccountPanel';
import { Breadcrumbs } from './Breadcrumbs';
import {
  StyledTopBar,
  StyledAvatarBtn,
  StyledImage,
  StyledQuantity,
  StyledLoginButton,
} from './TopBar.styles';

export const TopBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const authData = auth.useData();
  const isAuthorized = auth.useAuthorized();
  const accData = account.useData();
  const [visibleAccountDrawer, setVisibleAccountDrawer] = useState(false);
  const [alertsQuantity, setAlertsQuantity] = useState(0);

  const handleLoginClick = () => navigate(page.login);

  // TODO: remove next use effects and switchAccount thunk, because it's a part of a legacy API
  useEffect(() => {
    if (authData?.account?.accountId) {
      const { accountId } = authData.account;
      (async () => await dispatch(account.thunk.switchAccount({ accountId })))();
    }
  }, [authData, dispatch]);

  useEffect(() => {
    if (accData) {
      const quantity = accData.account.alerts.list.filter((alert) => !alert.viewed).length;
      setAlertsQuantity(quantity);
    }
  }, [accData]);

  return (
    <>
      <StyledTopBar>
        <StyledFlexTopCenter>
          <Breadcrumbs />
        </StyledFlexTopCenter>
        {isAuthorized ? (
          <StyledAvatarBtn
            onClick={() => setVisibleAccountDrawer((prevState) => !prevState)}
            variant="text"
          >
            <StyledImage src={avatarSrc} alt="Avatar" />
            {alertsQuantity > 0 && (
              <StyledQuantity>
                <StyledLabelBoldMedium color={variables.palette.white}>
                  {alertsQuantity}
                </StyledLabelBoldMedium>
              </StyledQuantity>
            )}
          </StyledAvatarBtn>
        ) : (
          <StyledLoginButton
            startIcon={<Svg width="18" height="18" id="profile" />}
            onClick={handleLoginClick}
          >
            {t('loginLink')}
          </StyledLoginButton>
        )}
      </StyledTopBar>
      {visibleAccountDrawer && (
        <AccountPanel
          alertsQuantity={alertsQuantity}
          setVisibleDrawer={setVisibleAccountDrawer}
          visibleDrawer={visibleAccountDrawer}
        />
      )}
    </>
  );
};

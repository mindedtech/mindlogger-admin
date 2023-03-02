import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'hooks';
import { EmptyTable, Svg } from 'components';
import { Header, RightButtonType } from 'features/Library/Header';
import { Applet, AppletUiType } from 'features/Library/Applet';
import {
  StyledBody,
  StyledHeadlineLarge,
  ContentContainer,
  StyledAppletContainer,
  StyledAppletList,
} from 'styles/styledComponents';
import theme from 'styles/theme';
import { page } from 'resources';
import { PublishedApplet } from 'redux/modules';

import { StyledLink } from './Cart.styles';

export const Cart = () => {
  const { t } = useTranslation('app');
  const [searchValue, setSearchValue] = useState('');

  // TODO: replace with real data
  const applets: PublishedApplet[] = [];

  useBreadcrumbs([
    {
      icon: <Svg id="cart-outlined" width="18" height="18" />,
      label: t('cart'),
    },
  ]);

  const renderEmptyState = () =>
    searchValue ? (
      <EmptyTable>{t('notFound')}</EmptyTable>
    ) : (
      <EmptyTable icon="empty-cart">
        <>
          {t('emptyCart')} <StyledLink to={page.library}>{t('appletsCatalog')}</StyledLink>.
        </>
      </EmptyTable>
    );

  return (
    <StyledBody>
      <Header
        isBackButtonVisible
        handleSearch={(value) => setSearchValue(value)}
        rightButtonType={RightButtonType.Builder}
        rightButtonCallback={() => console.log('add to builder')}
      />
      <ContentContainer>
        <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(3.6) }}>
          {t('cart')}
        </StyledHeadlineLarge>
        <StyledAppletList>
          {applets?.length
            ? applets.map((applet) => (
                <StyledAppletContainer key={applet.id}>
                  <Applet uiType={AppletUiType.Cart} applet={applet} />
                </StyledAppletContainer>
              ))
            : renderEmptyState()}
        </StyledAppletList>
      </ContentContainer>
    </StyledBody>
  );
};

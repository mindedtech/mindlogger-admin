import { MouseEvent, useState } from 'react';

import { Svg } from 'shared/components/Svg';
import { Menu, MenuUiType } from 'shared/components/Menu';

import { StyledButton } from './ActionsMenu.styles';
import { ActionsMenuProps } from './ActionsMenu.types';

export const ActionsMenu = <T = unknown,>({
  menuItems,
  'data-testid': dataTestid,
  buttonColor,
  anchorOrigin,
  transformOrigin,
}: ActionsMenuProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const openMenu = Boolean(anchorEl);

  return (
    <>
      <StyledButton
        onClick={handleMenuOpen}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        data-testid={`${dataTestid}-dots`}
        color={buttonColor}
      >
        <Svg id="dots" width={18} height={4} />
      </StyledButton>
      {openMenu && (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          onClose={handleMenuClose}
          menuItems={menuItems}
          uiType={MenuUiType.Secondary}
          data-testid={`${dataTestid}-menu`}
        />
      )}
    </>
  );
};

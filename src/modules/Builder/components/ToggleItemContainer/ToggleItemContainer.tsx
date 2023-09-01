import { useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledTitleTooltipIcon,
  theme,
  variables,
} from 'shared/styles';
import { Svg, Tooltip } from 'shared/components';

import {
  StyledItemOption,
  StylesTitleWrapper,
  StyledBadge,
  StyledTitleContainer,
} from './ToggleItemContainer.styles';
import { ToggleItemProps } from './ToggleItemContainer.types';

export const ToggleItemContainer = ({
  title,
  HeaderContent,
  Content,
  headerContentProps,
  contentProps,
  uiType,
  isOpenByDefault,
  isOpenDisabled,
  tooltip,
  error,
  'data-testid': dataTestid,
}: ToggleItemProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(isOpenByDefault ?? true);
  const handleToggle = () => setOpen((prevState) => !prevState);

  const titleErrorVisible = !open && !!error;

  return (
    <StyledItemOption uiType={uiType} data-testid={dataTestid}>
      <StylesTitleWrapper open={open} uiType={uiType} isError={titleErrorVisible}>
        <StyledFlexTopCenter
          sx={{ flexGrow: 1, overflow: titleErrorVisible ? 'visible' : 'hidden' }}
        >
          <StyledFlexTopCenter>
            <StyledClearedButton
              onClick={handleToggle}
              sx={{ p: theme.spacing(0.8) }}
              disabled={isOpenDisabled}
              data-testid={`${dataTestid}-collapse`}
            >
              <Svg id={open ? 'navigate-up' : 'navigate-down'} />
            </StyledClearedButton>
            {title && (
              <StyledFlexColumn>
                <StyledTitleContainer hasError={!!titleErrorVisible}>
                  {titleErrorVisible && <StyledBadge variant="dot" color="error" />}
                  <StyledFlexTopCenter>
                    <StyledLabelBoldLarge>{title}</StyledLabelBoldLarge>
                  </StyledFlexTopCenter>
                </StyledTitleContainer>
                {titleErrorVisible && (
                  <StyledBodyMedium
                    sx={{ p: theme.spacing(0.5, 0, 0, 1.5) }}
                    color={variables.palette.semantic.error}
                  >
                    {t(error)}
                  </StyledBodyMedium>
                )}
              </StyledFlexColumn>
            )}
          </StyledFlexTopCenter>
          {HeaderContent && (
            <HeaderContent open={open} onToggle={handleToggle} {...headerContentProps} />
          )}
        </StyledFlexTopCenter>
        {tooltip && (
          <Tooltip tooltipTitle={tooltip}>
            <Box component="span" sx={{ height: '2rem' }}>
              <StyledTitleTooltipIcon width="2rem" height="2rem" id="more-info-outlined" />
            </Box>
          </Tooltip>
        )}
      </StylesTitleWrapper>
      {open && <Content {...contentProps} />}
    </StyledItemOption>
  );
};

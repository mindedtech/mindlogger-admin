import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { FolderApplet, folders } from 'redux/modules';
import { Svg, Tooltip } from 'components';
import { ShareApplet } from 'features/Applet/ShareApplet';
import { SuccessSharePopup } from 'features/Applet/Popups';

import { StyledButton, StyledContainer } from './ShareAppletSetting.styles';
import { StyledHeadline } from '../AppletSettings.styles';

export const ShareAppletSetting = ({ isDisabled: isDisabledSetting = false }) => {
  const { t } = useTranslation('app');
  const { id } = useParams();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [sharePopupVisible, setSharePopupVisible] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [libraryUrl, setLibraryUrl] = useState('');
  const [applet, setApplet] = useState<FolderApplet | null>(null);

  useEffect(() => {
    if (id) {
      setApplet(folders.useApplet(id));
    }
  }, [id]);

  const handleSharedApplet = ({
    keywords,
    libraryUrl,
  }: {
    keywords: string[];
    libraryUrl: string;
  }) => {
    setKeywords(keywords);
    setLibraryUrl(libraryUrl);
    setSharePopupVisible(true);
  };

  return (
    <>
      <StyledHeadline>{t('shareToLibrary')}</StyledHeadline>
      <StyledContainer>
        <ShareApplet
          applet={applet}
          onAppletShared={handleSharedApplet}
          onDisableSubmit={(isDisabled) => setIsDisabled(isDisabled)}
          isSubmitted={isSubmitted}
          showSuccess={false}
        />
        {applet && (
          <SuccessSharePopup
            applet={applet}
            keywords={keywords}
            libraryUrl={libraryUrl}
            sharePopupVisible={sharePopupVisible}
            setSharePopupVisible={setSharePopupVisible}
          />
        )}
        <Tooltip tooltipTitle={isDisabled ? t('needToCreateApplet') : undefined}>
          <Box sx={{ width: 'fit-content' }}>
            <StyledButton
              variant="outlined"
              startIcon={<Svg width={18} height={18} id="share" />}
              disabled={isDisabled || isDisabledSetting}
              onClick={() => setIsSubmitted(true)}
            >
              {t('share')}
            </StyledButton>
          </Box>
        </Tooltip>
      </StyledContainer>
    </>
  );
};

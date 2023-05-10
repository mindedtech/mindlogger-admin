import MdEditor, { InsertContentGenerator } from 'md-editor-rt';
import { Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledFlexColumn, StyledTitleSmall } from 'shared/styles';
import { ALLOWED_AUDIO_FILE_TYPES } from 'shared/consts';

import { StyledIconCenter, StyledMenuItem, StyledMenuList } from '../Extensions.styles';
import { SourceLinkModal } from '../../SourceLinkModal';
import { useUploadMethods } from '../Extensions.hooks';
import { InsertContentExtensionProps, InsertHandlerProps } from '../Extensions.types';

const DropdownToolbar = MdEditor.DropdownToolbar;

export const AudioUploadExtension = ({ onInsert }: InsertContentExtensionProps) => {
  const { t } = useTranslation('app');
  const insertHandler = ({ values }: InsertHandlerProps) => {
    const generator: InsertContentGenerator = () => ({
      targetValue: `<figure><figcaption>${values?.label || ''}:</figcaption><audio controls src="${
        values?.address || ''
      }"></audio></figure>`,
      select: false,
      deviationStart: 0,
      deviationEnd: 0,
    });

    onInsert(generator);
  };
  const {
    isVisible,
    setIsVisible,
    isPopupVisible,
    handlePopupSubmit,
    handlePopupClose,
    onAddLinkClick,
    onUploadClick,
    onInputChange,
    inputRef,
  } = useUploadMethods({
    insertHandler,
  });

  return (
    <>
      <DropdownToolbar
        visible={isVisible}
        onChange={setIsVisible}
        overlay={
          <StyledFlexColumn>
            <Paper>
              <StyledMenuList>
                <StyledMenuItem onClick={onAddLinkClick}>
                  <StyledTitleSmall>{t('audioLink')} </StyledTitleSmall>
                </StyledMenuItem>
                <StyledMenuItem>
                  <StyledTitleSmall onClick={onUploadClick}>
                    {t('uploadAudio')}
                    <input
                      ref={inputRef}
                      hidden
                      accept={ALLOWED_AUDIO_FILE_TYPES}
                      type="file"
                      onChange={onInputChange}
                    />
                  </StyledTitleSmall>
                </StyledMenuItem>
              </StyledMenuList>
            </Paper>
          </StyledFlexColumn>
        }
        trigger={
          <StyledIconCenter>
            <Svg id="md-editor-audio" />
          </StyledIconCenter>
        }
      />
      {isPopupVisible && (
        <SourceLinkModal
          title={t('audioLink')}
          handleClose={handlePopupClose}
          handleSubmit={handlePopupSubmit}
        />
      )}
    </>
  );
};

import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from 'react';
import { Button } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

import { CropPopup } from 'shared/components/CropPopup';
import { Svg } from 'shared/components/Svg';
import { StyledBodyMedium } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { byteFormatter } from 'shared/utils';
import { MAX_FILE_SIZE_2MB } from 'shared/consts';

import {
  StyledButtonGroup,
  StyledContainer,
  StyledDeleteBtn,
  StyledImgContainer,
  StyledName,
  StyledNameWrapper,
  StyledUploadImg,
  UploadedImgContainer,
} from './Uploader.styles';
import { UploaderProps, UploaderUiType } from './Uploader.types';
import { RemoveImagePopup } from './RemoveImagePopup';

export const Uploader = ({
  uiType = UploaderUiType.Primary,
  width,
  height,
  setValue,
  getValue,
  description,
  maxFileSize = MAX_FILE_SIZE_2MB,
  wrapperStyles = {},
  cropRatio,
  hasError,
}: UploaderProps) => {
  const { t } = useTranslation('app');
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [cropPopupVisible, setCropPopupVisible] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [error, setError] = useState(false);
  const [isRemovePopupOpen, setRemovePopupOpen] = useState(false);
  const isPrimaryUiType = uiType === UploaderUiType.Primary;

  const stopDefaults = (e: DragEvent | MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSetImage = (files: FileList | null) => {
    const imageFile = files?.[0];
    if (!imageFile) return;

    const isAllowableSize = imageFile.size < maxFileSize;
    setError(!isAllowableSize);

    if (!isAllowableSize || !imageFile.type.includes('image')) return;

    setImage(imageFile);
    setCropPopupVisible(true);
  };

  const dragEvents = {
    onMouseEnter: () => setIsMouseOver(true),
    onMouseLeave: () => setIsMouseOver(false),
    onDragEnter: stopDefaults,
    onDragLeave: stopDefaults,
    onDragOver: stopDefaults,
    onDrop: (e: DragEvent<HTMLElement>) => {
      stopDefaults(e);
      const { files } = e.dataTransfer;

      handleSetImage(files);
    },
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    handleSetImage(files);
  };

  const onEditImg = (e: MouseEvent) => {
    stopDefaults(e);
    uploadInputRef?.current?.click();
  };

  const handleCloseRemovePopup = () => {
    setRemovePopupOpen(false);
  };

  const handleRemoveImg = () => {
    setImage(null);
    setValue('');
    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
    }
  };

  const handleDeleteClick = (e: MouseEvent) => {
    stopDefaults(e);
    setRemovePopupOpen(true);
  };

  const handleConfirmRemoval = () => {
    handleRemoveImg();
    handleCloseRemovePopup();
  };

  const imageField = getValue();

  const placeholderImgId = isPrimaryUiType ? 'img-filled' : 'img-outlined';
  const placeholderImgSize = isPrimaryUiType ? 32 : 24;
  const deleteSvgSize = isPrimaryUiType ? '18' : '24';

  return (
    <>
      <StyledContainer
        hasError={hasError}
        width={width}
        height={height}
        isImgUploaded={!!imageField}
        isPrimaryUiType={isPrimaryUiType}
        onClick={() => uploadInputRef?.current?.click()}
        sx={{ ...wrapperStyles }}
        {...dragEvents}
      >
        {imageField ? (
          <UploadedImgContainer isPrimaryUiType={isPrimaryUiType} width={width} height={height}>
            <StyledUploadImg alt="file upload" src={imageField} isPrimaryUiType={isPrimaryUiType} />
            {isMouseOver && (
              <StyledButtonGroup
                isPrimaryUiType={isPrimaryUiType}
                variant="outlined"
                aria-label="button group"
              >
                {isPrimaryUiType && (
                  <Button
                    startIcon={<Svg width="18" height="18" id="edit" />}
                    onClick={onEditImg}
                  />
                )}
                <StyledDeleteBtn isPrimaryUiType={isPrimaryUiType} onClick={handleDeleteClick}>
                  <Svg width={deleteSvgSize} height={deleteSvgSize} id="trash" />
                </StyledDeleteBtn>
              </StyledButtonGroup>
            )}
          </UploadedImgContainer>
        ) : (
          <StyledImgContainer
            className="image-container"
            isPrimaryUiType={isPrimaryUiType}
            hasError={hasError}
          >
            <Svg id={placeholderImgId} width={placeholderImgSize} height={placeholderImgSize} />
            {isPrimaryUiType && error && (
              <StyledBodyMedium
                sx={{ marginBottom: theme.spacing(1), px: theme.spacing(3) }}
                color={variables.palette.semantic.error}
              >
                {t('dropError', { size: byteFormatter(maxFileSize) })}
              </StyledBodyMedium>
            )}
            {isPrimaryUiType && (
              <StyledBodyMedium>
                <Trans i18nKey="dropImg">
                  Drop Image here <br /> or <span>click to browse</span>.
                </Trans>
              </StyledBodyMedium>
            )}
          </StyledImgContainer>
        )}
      </StyledContainer>
      <input
        ref={uploadInputRef}
        onChange={handleChange}
        accept="image/*"
        type="file"
        name="uploadFile"
        hidden
      />
      {isPrimaryUiType && (
        <StyledNameWrapper>
          {image?.name ? (
            <>
              <StyledName sx={{ marginRight: theme.spacing(0.4) }}>{image.name}</StyledName>{' '}
              <Svg id="check" width={18} height={18} />
            </>
          ) : (
            description
          )}
        </StyledNameWrapper>
      )}
      {cropPopupVisible && image && (
        <CropPopup
          open={cropPopupVisible}
          setCropPopupVisible={setCropPopupVisible}
          setValue={setValue}
          image={image}
          ratio={cropRatio}
        />
      )}
      <RemoveImagePopup
        open={isRemovePopupOpen}
        onClose={handleCloseRemovePopup}
        onSubmit={handleConfirmRemoval}
      />
    </>
  );
};

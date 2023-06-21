import { useState, useMemo, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Modal } from 'shared/components/Modal';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import { postFileUploadApi } from 'api';
import { useAsync } from 'shared/hooks';
import { getUploadFormData } from 'shared/utils';

import { cropImage, initPercentCrop } from './CropPopup.utils';
import { SIZE_TO_SET_IMG_SMALL } from './CropPopup.const';
import { StyledCropWrapper } from './CropPopup.styles';
import { CropPopupProps } from './CropPopup.types';

export const CropPopup = ({
  open,
  setCropPopupVisible,
  setValue,
  image,
  setImage,
  ratio = 1,
}: CropPopupProps) => {
  const { t } = useTranslation('app');

  const [crop, setCrop] = useState<Crop>();
  const [isSmallImg, setIsSmallImg] = useState(false);
  const imgSrc = useMemo(() => URL.createObjectURL(image), [image]);
  const { execute: executeImgUpload } = useAsync(
    postFileUploadApi,
    (response) => response?.data?.result && setValue(response?.data?.result.url),
  );

  const { type, name } = image;

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
    setIsSmallImg(width < SIZE_TO_SET_IMG_SMALL || height < SIZE_TO_SET_IMG_SMALL);

    const crop = initPercentCrop({ width, height, ratio });

    setCrop(crop);
  };

  const handleCropImage = () => {
    cropImage({
      image: imgSrc,
      type,
      crop,
      onReady: (blob) => {
        const imageFile = new File([blob], name, { type });
        const body = getUploadFormData(imageFile);
        executeImgUpload(body);
      },
    });
  };

  const onClose = () => {
    setImage(null);
    setCropPopupVisible(false);
  };

  const handleSave = () => {
    handleCropImage();
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={t('pleaseSelectArea')}
        onSubmit={handleSave}
        buttonText={t('save')}
      >
        <StyledModalWrapper sx={{ margin: '0 auto' }}>
          <StyledCropWrapper isSmallImg={isSmallImg}>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              aspect={ratio}
              keepSelection={true}
              style={{ maxHeight: '60vh' }}
            >
              <img src={imgSrc} onLoad={handleImageLoad} alt={name} />
            </ReactCrop>
          </StyledCropWrapper>
        </StyledModalWrapper>
      </Modal>
    </>
  );
};

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'md-editor-rt/lib/style.css';

import { getOptionTextApi } from 'api';
import { useAsync } from 'shared/hooks';
import { StyledHeadline, theme } from 'shared/styles';
import { AdditionalInformation as AdditionalInformationProps } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Subscales/Subscales.types';

import { LINK_PATTERN } from '../../Charts/Charts.const';
import { StyledHeader, StyledContent, StyledMdEditor } from './AdditionalInformation.styles';

export const AdditionalInformation = ({ optionText }: AdditionalInformationProps) => {
  const { t } = useTranslation();
  const { execute: getOptionText } = useAsync(getOptionTextApi);

  const [additionalInformation, setAdditionalInformation] = useState('');

  useEffect(() => {
    (async () => {
      if (!optionText.match(LINK_PATTERN)) {
        return setAdditionalInformation(optionText);
      }

      const markdownText = (await getOptionText(optionText)).data;
      setAdditionalInformation(markdownText);
    })();
  }, [optionText]);

  return (
    <>
      <StyledHeader>
        <StyledHeadline sx={{ mr: theme.spacing(1.6) }}>
          {t('additionalInformation')}
        </StyledHeadline>
      </StyledHeader>
      <StyledContent>
        <StyledMdEditor modelValue={additionalInformation} previewOnly />
      </StyledContent>
    </>
  );
};

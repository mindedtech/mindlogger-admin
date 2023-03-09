import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash.uniqueid';

import { Svg } from 'components';
import { StyledBodyMedium } from 'styles/styledComponents';

import { getSelectionPerRowSvgId } from './TooltipComponents.utils';
import {
  StyledPresentation,
  StyledTooltipText,
  StyledMatrixLine,
  StyledMatrixLineElement,
} from './TooltipComponents.styles';
import { SelectionProps, SelectionUiType } from './TooltipComponents.types';

const commonProps = {
  width: '17',
  height: '17',
};

const selectionContent = [
  ['', '1', '2', '3'],
  ['A', 1, 2, 3],
  ['B', 1, 2, 3],
  ['C', 1, 2, 3],
];

export const SelectionPerRow = ({ uiType }: SelectionProps) => {
  const { t } = useTranslation();
  const isSingleSelection = uiType === SelectionUiType.Single;
  const getTooltipText = (text: string) =>
    text ? <StyledTooltipText>{text}</StyledTooltipText> : '';

  return (
    <>
      <StyledPresentation>
        {selectionContent.map((row, rowIndex) => (
          <StyledMatrixLine key={uniqueId()}>
            {row.map((col, colIndex) => (
              <StyledMatrixLineElement key={uniqueId()}>
                {typeof col === 'string' ? (
                  getTooltipText(col)
                ) : (
                  <Svg
                    id={getSelectionPerRowSvgId(rowIndex, colIndex, isSingleSelection)}
                    {...commonProps}
                  />
                )}
              </StyledMatrixLineElement>
            ))}
          </StyledMatrixLine>
        ))}
      </StyledPresentation>
      <StyledBodyMedium>
        {isSingleSelection ? t('setupMatrixRadio') : t('setupMatrixCheckboxes')}
      </StyledBodyMedium>
      <StyledBodyMedium>
        {isSingleSelection ? t('respondentSelectSingle') : t('respondentSelectMultiple')}
      </StyledBodyMedium>
    </>
  );
};

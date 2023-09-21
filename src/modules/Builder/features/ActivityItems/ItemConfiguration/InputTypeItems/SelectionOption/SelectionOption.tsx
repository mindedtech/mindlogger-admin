import { useState, useRef, ChangeEvent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ColorResult } from 'react-color';
import get from 'lodash.get';

import { Actions, Svg, Uploader, UploaderUiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import {
  theme,
  StyledBodyLarge,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledIconButton,
} from 'shared/styles';
import { ItemResponseType } from 'shared/consts';
import { falseReturnFunc, getEntityKey, getObjectFromList } from 'shared/utils';
import { SingleAndMultiSelectOption, ConditionalLogic, ItemAlert } from 'shared/state';
import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';

import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { SELECTION_OPTION_TEXT_MAX_LENGTH } from '../../ItemConfiguration.const';
import { getPaletteColor } from '../../ItemConfiguration.utils';
import { ColorPicker } from './ColorPicker';
import {
  StyledCollapsedWrapper,
  StyledImg,
  StyledItemOption,
  StyledScoreWrapper,
  StyledSvgWrapper,
  StyledTextInputWrapper,
  StyledTooltipWrapper,
} from './SelectionOption.styles';
import { SelectionOptionProps } from './SelectionOption.types';
import { getActions, getDependentConditions } from './SelectionOption.utils';
import { useSetSelectionOptionValue } from './SelectionOption.hooks';
import { RemoveOptionPopup } from './RemoveOptionPopup';

export const SelectionOption = ({
  name,
  onRemoveOption,
  onUpdateOption,
  index,
  optionsLength,
  optionsOpen,
  setOptionsOpen,
}: SelectionOptionProps) => {
  const optionName = `${name}.responseValues.options.${index}`;
  const { t } = useTranslation('app');
  const [indexToRemove, setIndexToRemove] = useState(-1);
  const [visibleActions, setVisibleActions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { setValue, watch, control, getValues } = useFormContext();
  const { fieldName, activity } = useCurrentActivity();
  const [settings, responseType, option] = useWatch({
    control,
    name: [`${name}.config`, `${name}.responseType`, `${optionName}`],
  });
  const palette = watch(`${name}.responseValues.paletteName`);
  const imageSrc = watch(`${optionName}.image`);
  const hasTooltipsChecked = get(settings, ItemConfigurationSettings.HasTooltips);
  const hasColorPicker = get(settings, ItemConfigurationSettings.HasColorPalette);
  const hasAlerts = get(settings, ItemConfigurationSettings.HasAlerts);
  const { text = '', isHidden = false, score, color } = option || {};
  const scoreString = score?.toString();
  const hasColor = color !== undefined;
  const hasPalette = !!palette;
  const isColorSet = color?.hex !== '';
  const actionsRef = useRef(null);
  const isSingleSelection = responseType === ItemResponseType.SingleSelection;
  const dependentConditions = getDependentConditions(
    getEntityKey(option),
    activity?.conditionalLogic,
  );
  const groupedConditions = getObjectFromList(dependentConditions);

  const handleOptionToggle = () =>
    setOptionsOpen((prevState) =>
      prevState.map((optionOpen, optionIndex) => {
        if (optionIndex === index) return !optionOpen;

        return optionOpen;
      }),
    );

  const optionOpen = optionsOpen[index];

  const handlePopoverClose = () => setAnchorEl(null);
  const handleRemoveModalClose = () => setIndexToRemove(-1);
  const handleColorChange = () => {
    const settings = getValues(`${name}.config`);

    if (get(settings, ItemConfigurationSettings.HasColorPalette)) {
      setValue(`${name}.responseValues.paletteName`, undefined);
    }
  };

  const scoreName = `${optionName}.score`;

  const handleScoreChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') return setValue(scoreName, 0);

    setValue(scoreName, +event.target.value);
  };
  const handleRemoveOption = (index: number) => {
    if (hasAlerts) {
      const option = getValues(`${name}.responseValues.options.${index}`);
      const alerts = getValues(`${name}.alerts`);

      alerts?.forEach((alert: ItemAlert, index: number) => {
        if (alert.value === option?.id) setValue(`${name}.alerts.${index}.value`, '');
      });
    }

    onRemoveOption(index);

    if (hasColorPicker && hasPalette) {
      const options = getValues(`${name}.responseValues.options`);
      options?.forEach((option: SingleAndMultiSelectOption, index: number) => {
        onUpdateOption(index, {
          ...option,
          color: {
            hex: getPaletteColor(palette, index),
          } as ColorResult,
        });
      });
    }
  };
  const handleRemoveConditions = () => {
    const conditionalLogic = getValues(`${fieldName}.conditionalLogic`);

    setValue(
      `${fieldName}.conditionalLogic`,
      conditionalLogic?.filter(({ key }: ConditionalLogic) => !groupedConditions[key ?? '']),
    );
  };
  const handleSubmitRemove = () => {
    handleRemoveConditions();
    handleRemoveOption(indexToRemove);
    handleRemoveModalClose();
  };

  const actions = {
    optionHide: () => setValue(`${optionName}.isHidden`, !isHidden),
    paletteClick: () => actionsRef.current && setAnchorEl(actionsRef.current),
    optionRemove: () => {
      dependentConditions?.length ? setIndexToRemove(index) : handleRemoveOption(index);
    },
  };

  const commonInputProps = {
    control,
    fullWidth: true,
  };

  useSetSelectionOptionValue({
    name: optionName,
    onUpdateOption,
    index,
    hasColorPicker,
    hasColor,
  });

  const dataTestid = `builder-activity-items-item-configuration-options-${index}`;

  return (
    <>
      <StyledItemOption
        onMouseEnter={optionOpen ? falseReturnFunc : () => setVisibleActions(true)}
        onMouseLeave={optionOpen ? falseReturnFunc : () => setVisibleActions(false)}
        optionOpen={optionOpen}
        leftBorderColor={color?.hex}
        data-testid={`${dataTestid}-option`}
      >
        <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
          <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
            <StyledIconButton
              onClick={handleOptionToggle}
              sx={{ ml: theme.spacing(-0.8) }}
              data-testid={`${dataTestid}-collapse`}
            >
              <Svg id={optionOpen ? 'navigate-up' : 'navigate-down'} />
            </StyledIconButton>
            <StyledLabelBoldLarge sx={{ ml: theme.spacing(2) }}>{`${t('option')} ${
              index + 1
            }`}</StyledLabelBoldLarge>
            {!optionOpen && (
              <StyledCollapsedWrapper>
                <StyledSvgWrapper sx={{ m: theme.spacing(0, 2, 0, 6) }}>
                  <Svg
                    id={isSingleSelection ? 'radio-button-outline' : 'checkbox-multiple-filled'}
                  />
                </StyledSvgWrapper>
                {imageSrc && <StyledImg src={imageSrc} alt="option-image" />}
                {text && (
                  <StyledBodyLarge sx={{ ml: imageSrc ? theme.spacing(1) : 0 }}>
                    {text}
                  </StyledBodyLarge>
                )}
              </StyledCollapsedWrapper>
            )}
          </StyledFlexTopCenter>
          <StyledFlexTopCenter ref={actionsRef}>
            <Actions
              items={getActions({
                actions,
                isHidden,
                hasColorPicker,
                isColorSet,
                optionsLength,
                'data-testid': dataTestid,
              })}
              context={option}
              visibleByDefault={optionOpen || visibleActions}
              data-testid={dataTestid}
            />
          </StyledFlexTopCenter>
        </StyledFlexTopCenter>
        {optionOpen && (
          <StyledFlexColumn>
            <StyledFlexTopCenter sx={{ m: theme.spacing(1.5, 0, hasTooltipsChecked ? 4 : 2.4) }}>
              <StyledSvgWrapper sx={{ mr: theme.spacing(2) }}>
                <Svg id={isSingleSelection ? 'radio-button-outline' : 'checkbox-multiple-filled'} />
              </StyledSvgWrapper>
              <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
                <Uploader
                  uiType={UploaderUiType.Secondary}
                  width={5.6}
                  height={5.6}
                  setValue={(val: string) => setValue(`${optionName}.image`, val || undefined)}
                  getValue={() => imageSrc || ''}
                  data-testid={`${dataTestid}-image`}
                />
              </StyledFlexTopCenter>
              <StyledTextInputWrapper hasScores={!!scoreString}>
                <InputController
                  {...commonInputProps}
                  name={`${optionName}.text`}
                  label={t('optionText')}
                  maxLength={SELECTION_OPTION_TEXT_MAX_LENGTH}
                  data-testid={`${dataTestid}-text`}
                />
              </StyledTextInputWrapper>
              {scoreString && (
                <StyledScoreWrapper>
                  <InputController
                    {...commonInputProps}
                    name={scoreName}
                    type="number"
                    label={t('score')}
                    minNumberValue={Number.MIN_SAFE_INTEGER}
                    onChange={handleScoreChange}
                    data-testid={`${dataTestid}-score`}
                  />
                </StyledScoreWrapper>
              )}
            </StyledFlexTopCenter>
            {hasTooltipsChecked && (
              <StyledTooltipWrapper>
                <InputController
                  {...commonInputProps}
                  label={t('tooltip')}
                  name={`${optionName}.tooltip`}
                  data-testid={`${dataTestid}-tooltip`}
                />
              </StyledTooltipWrapper>
            )}
          </StyledFlexColumn>
        )}
      </StyledItemOption>
      {anchorEl && (
        <ColorPicker
          anchorEl={anchorEl}
          handleColorChange={handleColorChange}
          handlePopoverClose={handlePopoverClose}
          name={`${optionName}.color`}
          data-testid={`${dataTestid}-color`}
        />
      )}
      {indexToRemove !== -1 && (
        <RemoveOptionPopup
          name={optionName}
          conditions={dependentConditions}
          onClose={handleRemoveModalClose}
          onSubmit={handleSubmitRemove}
          data-testid={`${dataTestid}-remove-popup`}
        />
      )}
    </>
  );
};

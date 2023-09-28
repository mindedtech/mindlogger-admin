import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { EditorUiType, Switch, TransferListController } from 'shared/components/FormComponents';
import { StyledBodyMedium, theme, variables } from 'shared/styles';
import { Item } from 'shared/state';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { DataTableItem } from 'shared/components';

import { CommonFieldsProps } from './SectionScoreCommonFields.types';
import { StyledEditor } from './SectionScoreCommonFields.styles';
import { ItemTypesToPrint } from './SectionScoreCommonFields.const';
import { getColumns } from './SectionScoreCommonFields.utils';

export const SectionScoreCommonFields = ({
  name,
  sectionId,
  tableHeadBackground,
  'data-testid': dataTestid,
}: CommonFieldsProps) => {
  const { t } = useTranslation();

  const { control, getFieldState, watch, register, unregister, setValue } = useFormContext();
  const { activity } = useCurrentActivity();

  const showMessageName = `${name}.showMessage`;
  const printItemsName = `${name}.printItems`;
  const itemsPrintName = `${name}.itemsPrint`;
  const messageName = `${name}.message`;
  const showMessage: boolean = watch(showMessageName);
  const printItems: boolean = watch(printItemsName);
  const message = watch(messageName);
  const itemsPrint = watch(itemsPrintName);
  const printItemsError = getFieldState(printItemsName).error;

  const commonProps = { control };

  const items = activity?.items.reduce(
    (items: Pick<Item, 'id' | 'name' | 'question'>[], item: Item) => {
      if (!ItemTypesToPrint.includes(item.responseType)) return items;
      const { id, name, question } = item;

      return [...items, { id, name, question }];
    },
    [],
  );

  useEffect(() => {
    if (!activity) return;

    printItems ?? setValue(printItemsName, !!itemsPrint.length);
    showMessage ?? setValue(showMessageName, !!message.length);
  }, []);

  useEffect(() => {
    if (showMessage) {
      register(messageName);

      return;
    }

    unregister(messageName, { keepDefaultValue: true });
  }, [showMessage]);

  useEffect(() => {
    if (printItems) {
      register(itemsPrintName);

      return;
    }

    unregister(itemsPrintName, { keepDefaultValue: true });
  }, [printItems]);

  return (
    <>
      {!!printItemsError && (
        <StyledBodyMedium sx={{ mb: theme.spacing(2.4) }} color={variables.palette.semantic.error}>
          {printItemsError.message}
        </StyledBodyMedium>
      )}
      <Box sx={{ mb: theme.spacing(1) }}>
        <Switch
          name={`${name}.showMessage`}
          label={t('showMessage')}
          tooltipText={t('showMessageTooltip')}
          {...commonProps}
          data-testid={`${dataTestid}-show-message`}
        />
      </Box>
      {showMessage && (
        <StyledEditor
          uiType={EditorUiType.Secondary}
          name={messageName}
          key={messageName}
          control={control}
          editorId={`editor-${sectionId}`}
          data-testid={`${dataTestid}-show-message-text`}
        />
      )}
      <Box sx={{ m: theme.spacing(0.5, 0, 1) }}>
        <Switch
          name={`${name}.printItems`}
          label={t('printItems')}
          tooltipText={t('printItemsTooltip')}
          {...commonProps}
          data-testid={`${dataTestid}-print-items`}
        />
      </Box>
      {printItems && (
        <TransferListController
          name={itemsPrintName}
          items={items as unknown as DataTableItem[]}
          columns={getColumns()}
          hasSearch={false}
          hasSelectedSection={false}
          isValueName
          tableHeadBackground={tableHeadBackground}
          data-testid={`${dataTestid}-print-items-list`}
        />
      )}
    </>
  );
};

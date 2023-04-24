import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SelectController } from 'shared/components/FormComponents';
import { Svg } from 'shared/components';
import { SelectEvent } from 'shared/types';
import { exportToCsv } from 'shared/utils';

import { ExportSchedulePopup } from '../ExportSchedulePopup';
import { ImportSchedulePopup } from '../ImportSchedulePopup';
import { ClearScheduledEventsPopup } from '../ClearScheduledEventsPopup';
import { RemoveIndividualSchedulePopup } from '../RemoveIndividualSchedulePopup';
import { CreateEventPopup } from '../CreateEventPopup';
import { ExpandedList } from './ExpandedList';
import { SearchPopup } from './SearchPopup';
import { Search } from './Search';
import { ScheduleOptions, scheduleOptions } from './Legend.const';
import {
  StyledBtn,
  StyledLegend,
  StyledBtnsRow,
  StyledSelect,
  StyledSearchContainer,
  StyledSelectRow,
  StyledIconBtn,
} from './Legend.styles';
import { LegendProps, SelectedRespondent } from './Legend.types';
import { useExpandedLists } from './Legend.hooks';

export const Legend = ({ legendEvents, appletName, appletId }: LegendProps) => {
  const { t } = useTranslation('app');

  const [schedule, setSchedule] = useState<string>(scheduleOptions[0].value);
  const [searchPopupVisible, setSearchPopupVisible] = useState(false);
  const [selectedRespondent, setSelectedRespondent] = useState<SelectedRespondent>(null);
  const [exportDefaultSchedulePopupVisible, setExportDefaultSchedulePopupVisible] = useState(false);
  const [exportIndividualSchedulePopupVisible, setExportIndividualSchedulePopupVisible] =
    useState(false);
  const [importSchedulePopupVisible, setImportSchedulePopupVisible] = useState(false);
  const [clearScheduledEventsPopupVisible, setClearScheduledEventsPopupVisible] = useState(false);
  const [removeIndividualSchedulePopupVisible, setRemoveIndividualSchedulePopupVisible] =
    useState(false);
  const [createEventPopupVisible, setCreateEventPopupVisible] = useState(false);

  const searchContainerRef = useRef<HTMLElement>(null);

  const { scheduleExportTableData = [], scheduleExportCsv = [] } = legendEvents ?? {};
  const boundingBox = searchContainerRef?.current?.getBoundingClientRect();
  const isIndividual = schedule === ScheduleOptions.IndividualSchedule;

  const scheduleChangeHandler = async (e: SelectEvent) => {
    const { value } = e.target;
    await setSchedule(value);
    if (value === ScheduleOptions.IndividualSchedule) {
      setSearchPopupVisible(true);
    }
  };

  const clearAllScheduledEventsAction = () => {
    setClearScheduledEventsPopupVisible(true);
  };

  const onCreateActivitySchedule = () => {
    setCreateEventPopupVisible(true);
  };

  const expandedLists = useExpandedLists(
    legendEvents,
    clearAllScheduledEventsAction,
    onCreateActivitySchedule,
  );

  const exportScheduleHandler = () => {
    if (isIndividual) {
      setExportIndividualSchedulePopupVisible(true);
    } else {
      setExportDefaultSchedulePopupVisible(true);
    }
  };

  const handleExportScheduleSubmit = async () => {
    await exportToCsv(scheduleExportCsv, `${appletName}_schedule`);
    setExportDefaultSchedulePopupVisible(false);
  };

  return (
    <StyledLegend>
      <StyledSelectRow>
        <StyledSelect>
          <SelectController
            name="schedule"
            value={schedule}
            customChange={scheduleChangeHandler}
            options={scheduleOptions}
            withChecked
            SelectProps={{
              autoWidth: true,
              IconComponent: (props) => <Svg className={props.className} id="navigate-down" />,
            }}
          />
        </StyledSelect>
        {isIndividual && (
          <StyledIconBtn onClick={() => setRemoveIndividualSchedulePopupVisible(true)}>
            <Svg id="trash" />
          </StyledIconBtn>
        )}
      </StyledSelectRow>
      {isIndividual && (
        <>
          <StyledSearchContainer
            ref={searchContainerRef}
            onClick={() => setSearchPopupVisible(true)}
          >
            <Search selectedRespondent={selectedRespondent} placeholder={t('selectRespondent')} />
          </StyledSearchContainer>
          <SearchPopup
            top={boundingBox?.top}
            left={boundingBox?.left}
            open={searchPopupVisible}
            onClose={() => setSearchPopupVisible(false)}
            setSelectedRespondent={setSelectedRespondent}
            selectedRespondent={selectedRespondent}
          />
        </>
      )}
      <StyledBtnsRow>
        <StyledBtn onClick={() => setImportSchedulePopupVisible(true)}>
          <Svg width={18} height={18} id="export" />
          {t('import')}
        </StyledBtn>
        <StyledBtn onClick={exportScheduleHandler}>
          <Svg width={18} height={18} id="export2" />
          {t('export')}
        </StyledBtn>
      </StyledBtnsRow>
      {expandedLists?.map(({ buttons, items, title, allAvailableScheduled, isHiddenInLegend }) => (
        <ExpandedList
          key={title}
          buttons={buttons}
          items={items}
          title={title}
          isHiddenInLegend={isHiddenInLegend}
          allAvailableScheduled={allAvailableScheduled}
        />
      ))}
      {exportDefaultSchedulePopupVisible && (
        <ExportSchedulePopup
          open={exportDefaultSchedulePopupVisible}
          onClose={() => setExportDefaultSchedulePopupVisible(false)}
          onSubmit={handleExportScheduleSubmit}
          scheduleTableRows={scheduleExportTableData}
        />
      )}
      {exportIndividualSchedulePopupVisible && (
        <ExportSchedulePopup
          open={exportIndividualSchedulePopupVisible}
          onClose={() => setExportIndividualSchedulePopupVisible(false)}
          onSubmit={() => setExportIndividualSchedulePopupVisible(false)}
          // TODO: replace with individual respondent export data
          secretUserId="012-435"
          nickName="John Doe"
          scheduleTableRows={scheduleExportTableData}
        />
      )}
      {importSchedulePopupVisible && (
        <ImportSchedulePopup
          open={importSchedulePopupVisible}
          isIndividual={isIndividual}
          appletName={appletName}
          // TODO: replace with individual respondent export data
          secretUserId="012-435"
          nickName="John Doe"
          onClose={() => setImportSchedulePopupVisible(false)}
        />
      )}
      {clearScheduledEventsPopupVisible && (
        <ClearScheduledEventsPopup
          open={clearScheduledEventsPopupVisible}
          appletName={appletName}
          appletId={appletId}
          isDefault={!isIndividual}
          name="John Doe"
          onClose={() => setClearScheduledEventsPopupVisible(false)}
        />
      )}
      {removeIndividualSchedulePopupVisible && (
        <RemoveIndividualSchedulePopup
          open={removeIndividualSchedulePopupVisible}
          name="14456 (Name)"
          isEmpty={false}
          onClose={() => setRemoveIndividualSchedulePopupVisible(false)}
        />
      )}
      <CreateEventPopup
        open={createEventPopupVisible}
        setCreateEventPopupVisible={setCreateEventPopupVisible}
        defaultStartDate={new Date()}
      />
    </StyledLegend>
  );
};

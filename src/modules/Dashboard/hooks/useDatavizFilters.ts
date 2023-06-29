import { useMemo } from 'react';
import { UseFormWatch } from 'react-hook-form';
import { isAfter, isBefore } from 'date-fns';

import { FilterFormValues } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.types';
import { getDateTime } from 'shared/utils';
import { Version } from 'api';

export const useDatavizFilters = (watch: UseFormWatch<FilterFormValues>, versions: Version[]) => {
  const {
    startDateEndDate: [startDate, endDate],
    startTime,
    endTime,
  } = watch();

  const { minDate, maxDate, filteredVersions } = useMemo(() => {
    const minDate = getDateTime(startDate, startTime);
    const maxDate = getDateTime(endDate, endTime);
    const filteredVersions = versions.filter(
      (version) =>
        isBefore(new Date(version.createdAt), maxDate) &&
        isAfter(new Date(version.createdAt), minDate),
    );

    return { minDate, maxDate, filteredVersions };
  }, [startDate, endDate, startTime, endTime]);

  return { minDate, maxDate, filteredVersions };
};

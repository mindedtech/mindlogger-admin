import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { ActivityFormValues } from 'modules/Builder/types';
import { getEntityKey } from 'shared/utils';

export const useCurrentActivity = () => {
  const { activityId } = useParams();

  const { watch } = useFormContext() ?? {};

  if (!activityId) return {};

  const activities = watch?.('activities');
  const currentActivityIndex = activities?.findIndex(
    (activity: ActivityFormValues) => getEntityKey(activity) === activityId,
  );

  if (!~currentActivityIndex) return {};

  return {
    activity: activities[currentActivityIndex],
    fieldName: `activities.${currentActivityIndex}`,
    activityObjField: `activities[${currentActivityIndex}]`,
  };
};

import { useState, useEffect } from 'react';

import { useAsync } from 'shared/hooks/useAsync';
import { getReviewActivitiesApi, getReviewFlowsApi, ReviewEntity } from 'modules/Dashboard/api';
import {
  getConcatenatedEntities,
  getEntityWithLatestAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentData.utils';

import { sortAnswerDates } from '../../utils/sortAnswerDates';
import { ReviewActivitiesAndFlowsProps } from './useReviewActivitiesAndFlows.types';

export const useReviewActivitiesAndFlows = ({
  answerId,
  submitId,
  appletId,
  activityId,
  handleSelectAnswer,
  subjectId,
}: ReviewActivitiesAndFlowsProps) => {
  const [activities, setActivities] = useState<ReviewEntity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ReviewEntity | null>(null);
  const [flows, setFlows] = useState<ReviewEntity[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<ReviewEntity | null>(null);

  const { execute: getReviewActivities, isLoading: getActivitiesLoading } = useAsync(
    getReviewActivitiesApi,
    ({ data }) => {
      const activities = data?.result;

      if (!activities?.length) return;
      let selectedActivityByDefault;
      if (activityId) {
        selectedActivityByDefault = activities.filter((e) => e.id === activityId)[0];
        setActivities([selectedActivityByDefault]);
      } else {
        setActivities(activities);
      }
    },
  );

  const { execute: getReviewFlows, isLoading: getFlowsLoading } = useAsync(
    getReviewFlowsApi,
    ({ data }) => {
      const flows = data?.result;

      if (!flows?.length) return;
      setFlows(flows);
    },
  );

  const handleGetActivitiesAndFlows = (createdDate: string) => {
    if (!appletId || !subjectId) {
      return;
    }

    const requestBody = {
      appletId,
      targetSubjectId: subjectId,
      createdDate,
    };

    getReviewFlows(requestBody);
    getReviewActivities(requestBody);
  };

  useEffect(() => {
    if (
      answerId ||
      submitId ||
      selectedActivity ||
      selectedFlow ||
      !activities.length ||
      !flows.length ||
      !handleSelectAnswer
    ) {
      return;
    }

    let selectedEntityByDefault;
    if (activityId) {
      selectedEntityByDefault = activities.filter((e) => e.id === activityId)[0];
      setSelectedActivity(selectedEntityByDefault);
    } else {
      const reviewEntities = getConcatenatedEntities({ activities, flows });
      selectedEntityByDefault = getEntityWithLatestAnswer(reviewEntities) || reviewEntities[0];

      selectedEntityByDefault.isFlow
        ? setSelectedFlow(selectedEntityByDefault)
        : setSelectedActivity(selectedEntityByDefault);
    }

    const { answerDates } = selectedEntityByDefault;

    if (!answerDates.length) return;

    const sortedAnswerDates = sortAnswerDates(answerDates);
    handleSelectAnswer({
      answer: { ...sortedAnswerDates[answerDates.length - 1] },
    });
  }, [
    answerId,
    activityId,
    submitId,
    activities,
    flows,
    handleSelectAnswer,
    selectedFlow,
    selectedActivity,
  ]);

  return {
    activities,
    setActivities,
    flows,
    setFlows,
    handleGetActivitiesAndFlows,
    selectedActivity,
    selectedFlow,
    setSelectedActivity,
    setSelectedFlow,
    isActivitiesFlowsLoading: getActivitiesLoading || getFlowsLoading,
  };
};

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';

import { getActivityAnswerApi } from 'api';
import { useAsync } from 'shared/hooks';
import { getDictionaryText } from 'shared/utils';
import { Spinner } from 'shared/components';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { CollapsedMdText } from '../../CollapsedMdText';
import { isItemUnsupported } from '../../RespondentData.utils';
import { UnsupportedItemResponse } from '../../UnsupportedItemResponse';
import { StyledReview } from './Review.styles';
import { ReviewProps } from './Review.types';
import { ActivityItemAnswer } from '../RespondentDataReview.types';
import { getResponseItem } from './Review.const';

export const Review = ({ answerId, activityId }: ReviewProps) => {
  const { appletId } = useParams();
  const [activityItemAnswers, setActivityItemAnswers] = useState<ActivityItemAnswer[] | null>(null);
  const getDecryptedActivityData = useDecryptedActivityData();

  const { execute: getActivityAnswer, isLoading } = useAsync(getActivityAnswerApi, (res) => {
    if (!res?.data?.result) return;

    const decryptedActivityData = getDecryptedActivityData(res.data.result);
    setActivityItemAnswers(decryptedActivityData.decryptedAnswers);
  });

  useEffect(() => {
    if (appletId && answerId) {
      getActivityAnswer({ appletId, answerId, activityId });
    }
  }, [appletId, answerId]);

  return (
    <>
      {isLoading && <Spinner />}
      {answerId && activityItemAnswers && (
        <StyledReview>
          {activityItemAnswers.map(({ activityItem, answer }) => (
            <Box sx={{ mb: 4.8 }} key={activityItem.id}>
              <CollapsedMdText text={getDictionaryText(activityItem.question)} maxHeight={120} />
              {isItemUnsupported(activityItem.responseType) ? (
                <UnsupportedItemResponse itemType={activityItem.responseType} />
              ) : (
                <>{getResponseItem({ activityItem, answer })}</>
              )}
            </Box>
          ))}
        </StyledReview>
      )}
    </>
  );
};

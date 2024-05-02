import { Box } from '@mui/material';

import { getDictionaryText } from 'shared/utils';
import { SHOW_MORE_HEIGHT } from 'modules/Dashboard/features/RespondentData/RespondentData.const';

import { CollapsedMdText } from '../../CollapsedMdText';
import { UnsupportedItemResponse } from '../../UnsupportedItemResponse';
import { UNSUPPORTED_ITEMS } from '../../RespondentData.const';
import { StyledEmptyReview, StyledReview, StyledWrapper } from './Review.styles';
import { ReviewProps } from './Review.types';
import { renderEmptyState, getResponseItem } from './Review.utils';

export const Review = ({
  activityItemAnswers,
  isLoading,
  selectedAnswer,
  isActivitySelected,
  'data-testid': dataTestid,
}: ReviewProps) => {
  if (isLoading) return null;

  if (!selectedAnswer || !activityItemAnswers) {
    return (
      <StyledWrapper>
        <StyledEmptyReview>
          {renderEmptyState(selectedAnswer, isActivitySelected)}
        </StyledEmptyReview>
      </StyledWrapper>
    );
  }

  return (
    <StyledReview data-testid={dataTestid}>
      {activityItemAnswers?.map((activityItemAnswer, index) => {
        const testId = `${dataTestid}-${index}`;
        const {
          activityItem: { id, question, responseType },
        } = activityItemAnswer;

        return (
          <Box sx={{ mb: 4.8 }} key={id} data-testid={testId}>
            <CollapsedMdText
              text={getDictionaryText(question)}
              maxHeight={SHOW_MORE_HEIGHT}
              data-testid={`${testId}-question`}
            />
            {UNSUPPORTED_ITEMS.includes(responseType) ? (
              <UnsupportedItemResponse itemType={responseType} data-testid={`${testId}-response`} />
            ) : (
              <>
                {getResponseItem({
                  ...activityItemAnswer,
                  'data-testid': `${testId}-response`,
                })}
              </>
            )}
          </Box>
        );
      })}
    </StyledReview>
  );
};

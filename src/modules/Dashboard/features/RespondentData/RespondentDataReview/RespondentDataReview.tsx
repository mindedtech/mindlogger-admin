import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ReviewActivity, getAssessmentApi } from 'api';
import { Svg } from 'shared/components';
import { useAsync, useBreadcrumbs, useHeaderSticky } from 'shared/hooks';
import {
  StyledContainer,
  StyledHeadlineLarge,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import { ActivityItemAnswer } from 'shared/types';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { Assessment } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackAssessment/FeedbackAssessment.types';

import { StyledTextBtn } from '../RespondentData.styles';
import {
  StyledEmptyReview,
  StyledHeader,
  StyledReviewContainer,
  StyledWrapper,
} from './RespondentDataReview.styles';
import { Answer } from './RespondentDataReview.types';
import { Feedback } from './Feedback';
import { Review } from './Review';
import { ReviewMenu } from './ReviewMenu';
import { RespondentDataReviewContext } from './RespondentDataReview.context';

export const RespondentDataReview = () => {
  const { t } = useTranslation();
  const { appletId } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ReviewActivity | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [assessment, setAssessment] = useState<ActivityItemAnswer[]>([]);
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDecryptedActivityData = useDecryptedActivityData();
  const { execute: getAssessment } = useAsync(getAssessmentApi);

  useBreadcrumbs([
    {
      icon: 'checkbox-outlined',
      label: t('review'),
    },
  ]);

  const renderEmptyState = () => {
    if (!selectedAnswer) {
      return (
        <>
          <Svg id="data" width="80" height="80" />
          <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
            {t('emptyReview')}
          </StyledTitleLarge>
        </>
      );
    }

    return (
      <>
        <Svg id="chart" width="67" height="67" />
        <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
          {t('noDataForActivity')}
        </StyledTitleLarge>
      </>
    );
  };

  useEffect(() => {
    setIsFeedbackOpen(false);
    if (!appletId || !answerId) return;
    (async () => {
      try {
        setIsLoading(true);
        const result = await getAssessment({ appletId, answerId });
        const { reviewerPublicKey, ...assessmentData } = result.data.result;
        const encryptedData = {
          ...assessmentData,
          userPublicKey: reviewerPublicKey,
        } as Assessment;
        const decryptedAssessment = getDecryptedActivityData(encryptedData);
        setItemIds(result.data.result.itemIds || []);
        setAssessment(decryptedAssessment.decryptedAnswers);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [appletId, answerId]);

  return (
    <StyledContainer sx={{ position: 'relative' }}>
      <ReviewMenu
        selectedActivity={selectedActivity}
        selectedAnswer={selectedAnswer}
        setSelectedActivity={setSelectedActivity}
        setSelectedAnswer={setSelectedAnswer}
      />
      <RespondentDataReviewContext.Provider value={{ assessment, itemIds, setItemIds }}>
        <StyledReviewContainer ref={containerRef}>
          <StyledHeader
            isSticky={isHeaderSticky}
            sx={{ justifyContent: selectedAnswer ? 'space-between' : 'flex-end' }}
          >
            {selectedAnswer && <StyledHeadlineLarge>{selectedActivity?.name}</StyledHeadlineLarge>}
            <StyledTextBtn
              variant="text"
              onClick={() => setIsFeedbackOpen(true)}
              disabled={!selectedAnswer}
              startIcon={<Svg id="item-outlined" width="18" height="18" />}
            >
              {t('feedback')}
            </StyledTextBtn>
          </StyledHeader>
          {selectedActivity && selectedAnswer ? (
            <Review answerId={selectedAnswer.answerId} activityId={selectedActivity.id} />
          ) : (
            <StyledWrapper>
              <StyledEmptyReview>{renderEmptyState()}</StyledEmptyReview>
            </StyledWrapper>
          )}
        </StyledReviewContainer>
        {selectedActivity && selectedAnswer && !isLoading && (
          <Feedback
            isFeedbackOpen={isFeedbackOpen}
            selectedActivity={selectedActivity}
            onClose={() => setIsFeedbackOpen(false)}
          />
        )}
      </RespondentDataReviewContext.Provider>
    </StyledContainer>
  );
};

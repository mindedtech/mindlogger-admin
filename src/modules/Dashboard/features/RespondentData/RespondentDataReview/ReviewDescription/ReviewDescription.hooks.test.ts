import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';

import { useReviewDescription } from './ReviewDescription.hooks';

describe('useReviewDescription', () => {
  const createdAt = '2024-04-10T10:00:00';
  const identifier = 'test-identifier';
  const version = '1.0';

  test('should return a correct array with review description objects', () => {
    const { result } = renderHookWithProviders(() =>
      useReviewDescription({ createdAt, identifier, version }),
    );

    expect(result.current).toEqual([
      {
        id: 'review-desc-1',
        title: 'Viewing responses submitted on:',
        content: 'Apr 10, 2024 10:00:00',
      },
      {
        id: 'review-desc-2',
        title: 'Response Identifier:',
        content: identifier,
      },
      {
        id: 'review-desc-3',
        title: 'Version:',
        content: version,
      },
    ]);
  });
});

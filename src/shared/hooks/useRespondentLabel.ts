import { useTranslation } from 'react-i18next';

import { users } from 'redux/modules';
import { getRespondentName } from 'shared/utils';

type Parameters = {
  isSubject?: boolean;
  hideNickname?: boolean;
  variant?: 'default' | 'comma';
};

export const useRespondentLabel = (
  parameters: Parameters = {
    isSubject: false,
    hideNickname: false,
    variant: 'default',
  },
) => {
  const { t } = useTranslation('app');
  const { useRespondent, useSubject } = users;
  const subjectResult = useSubject();
  const respondentResult = useRespondent();

  const result = parameters.isSubject ? subjectResult?.result : respondentResult?.result;

  const { secretUserId, nickname } = result || {};

  if (!secretUserId) return '';
  if (parameters.hideNickname) return secretUserId;

  const label = `${t(
    parameters.isSubject ? 'subjectIdentifierWithColon' : 'respondentIdentifierWithColon',
  )}${' '}`;

  return `${label}${getRespondentName(secretUserId, nickname, parameters.variant)}`;
};

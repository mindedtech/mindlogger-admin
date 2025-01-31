import * as yup from 'yup';

import i18n from 'i18n';
import { EMAIL_REGEXP, USER_SELECTABLE_PARTICIPANT_TAGS } from 'shared/consts';
import { ApiLanguages } from 'api';
import { AccountType } from 'modules/Dashboard/types/Dashboard.types';

export const AddParticipantPopupSchema = () => {
  const { t } = i18n;

  return yup
    .object({
      accountType: yup.string().required().oneOf(Object.values(AccountType)),
      email: yup
        .string()
        .test('isFullAccount', t('emailRequired'), function (value) {
          const accountType = this.parent?.accountType;
          if (accountType === AccountType.Full) {
            return !!value;
          }

          return true;
        })
        .test('isValidEmail', t('incorrectEmail'), function (value) {
          const accountType = this.parent?.accountType;
          if (value !== undefined && (accountType === AccountType.Full || value !== '')) {
            return EMAIL_REGEXP.test(value);
          }

          return true;
        }),
      firstName: yup.string().required(t('firstNameRequired')),
      lastName: yup.string().required(t('lastNameRequired')),
      nickname: yup.string(),
      secretUserId: yup.string().required(t('secretUserIdRequired')),
      tag: yup.string().oneOf(USER_SELECTABLE_PARTICIPANT_TAGS),
      language: yup.string().required().oneOf(Object.values(ApiLanguages)),
    })
    .required();
};

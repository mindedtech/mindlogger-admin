import { ChangeEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';

import { users, auth, account } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { InputController, SelectController, TagsInputController } from 'components/FormComponents';
import { StyledErrorText } from 'styles/styledComponents/ErrorText';
import { getAppletInvitationApi } from 'api';
import { getErrorMessage } from 'utils/errors';
import { prepareUsersData } from 'utils/prepareUsersData';
import { setAccountName } from 'redux/modules/Auth/Auth.thunk';
import { Roles } from 'consts';

import { StyledButton, StyledRow, StyledResetButton, StyledTitle } from './AddUserForm.styles';
import { Fields, fields, defaultValues, langs, roles } from './AddUserForm.const';
import { AddUserSchema } from './AddUserForm.schema';
import { AddUserFormProps, FormValues } from './AddUserForm.types';

export const AddUserForm = ({ getInvitationsHandler }: AddUserFormProps) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const [errorMessage, setErrorMessage] = useState('');
  const accountData = account.useData();
  const usersData = users.useUserData();
  const authData = auth.useData();
  const currentApplet = accountData?.account?.applets?.find((el) => el.id === id);
  const accountNameShowed =
    authData?.user?.displayName === authData?.account?.accountName &&
    currentApplet?.roles?.includes('owner');
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isDirty, isValid },
    register,
    unregister,
  } = useForm<FormValues>({
    resolver: yupResolver(AddUserSchema(accountNameShowed)),
    defaultValues,
    mode: 'onChange',
  });
  const role = watch(Fields.role);

  const commonProps = {
    fullWidth: true,
    control,
  };

  const resetForm = () => reset();

  const onSubmit = async (values: FormValues) => {
    try {
      if (id) {
        const options = {
          ...values,
          accountName: values.accountName || authData?.account?.accountName || '',
        };

        await getAppletInvitationApi({ appletId: id, options });
        await getInvitationsHandler();

        if (options.accountName && options.role !== Roles.user) {
          dispatch(setAccountName({ accountName: options.accountName }));
        }
        setErrorMessage('');
        resetForm();
      }
    } catch (e) {
      setErrorMessage(getErrorMessage(e));
    }
  };

  const updateFields = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const { nickName, MRN, accountName, users } = Fields;

    if (value === Roles.user) {
      register(nickName, { value: '' });
      register(MRN, { value: '' });
      unregister(accountName);
      unregister(users);
    } else {
      unregister(nickName);
      unregister(MRN);
      if (value === Roles.reviewer) {
        register(users, { value: [] });
      } else {
        unregister(users);
      }
      if (accountNameShowed) {
        register(accountName, { value: '' });
      }
    }
  };

  return (
    <>
      <StyledTitle>{t('addUser')}</StyledTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2.4} alignItems="flex-start">
          <Grid container item xs={8} spacing={2.4}>
            {fields.map(({ name }) => (
              <Grid item xs={6} key={name}>
                <InputController {...commonProps} name={name} label={t(name)} />
              </Grid>
            ))}
            <Grid item xs={6}>
              <SelectController
                {...commonProps}
                name={Fields.role}
                options={roles}
                label={t('role')}
                customChange={updateFields}
              />
            </Grid>
            {role === Roles.reviewer && (
              <Grid item xs={12}>
                <TagsInputController
                  {...commonProps}
                  name={Fields.users}
                  // TODO: fix types
                  options={prepareUsersData(usersData?.items)?.map((el: any) => el?.MRN)}
                  label={t('userList')}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <SelectController
                {...commonProps}
                name={Fields.lang}
                options={langs}
                label={t('language')}
              />
            </Grid>
          </Grid>
          <Grid container item xs={4} rowSpacing={2.4}>
            {role === Roles.user && (
              <>
                <Grid item xs={12}>
                  <InputController {...commonProps} name={Fields.nickName} label={t('nickname')} />
                </Grid>
                <Grid item xs={12}>
                  <InputController {...commonProps} name={Fields.MRN} label={t('secretUserId')} />
                </Grid>
              </>
            )}
            {accountNameShowed && role !== Roles.user && (
              <Grid item xs={12}>
                <InputController
                  {...commonProps}
                  name={Fields.accountName}
                  label={t('accountName')}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        {errorMessage && <StyledErrorText>{errorMessage}</StyledErrorText>}
        <StyledRow>
          <StyledButton variant="contained" type="submit" disabled={!isDirty || !isValid}>
            {t('submit')}
          </StyledButton>
          <StyledResetButton variant="outlined" onClick={resetForm}>
            {t('resetForm')}
          </StyledResetButton>
        </StyledRow>
      </form>
    </>
  );
};

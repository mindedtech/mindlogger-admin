import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SignIn } from 'api';
import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { InputController } from 'components/FormComponents';
import { StyledErrorText } from 'styles/styledComponents/ErrorText';
import { StyledHeadline } from 'styles/styledComponents/Typography';
import { getErrorMessage } from 'utils/errors';

import {
  StyledWelcome,
  StyledLoginSubheader,
  StyledForm,
  StyledController,
  StyledButton,
  StyledForgotPasswordLink,
} from './LoginForm.styles';
import { loginFormSchema } from './LoginForm.schema';

export const LoginForm = ({ onSubmitForTest }: { onSubmitForTest?: () => void }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<SignIn>({
    resolver: yupResolver(loginFormSchema()),
    defaultValues: { email: '', password: '' },
  });

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data: SignIn) => {
    if (onSubmitForTest) {
      onSubmitForTest();
    }

    const { signIn } = auth.thunk;
    const result = await dispatch(signIn(data));

    if (signIn.fulfilled.match(result)) {
      setErrorMessage('');
    } else if (signIn.rejected.match(result)) {
      setErrorMessage(getErrorMessage(result.payload));
    }
  };

  return (
    <>
      <StyledWelcome>{t('welcome')}</StyledWelcome>
      <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <StyledHeadline>{t('login')}</StyledHeadline>
        <StyledLoginSubheader>{t('logIntoAccount')}</StyledLoginSubheader>
        <StyledController>
          <InputController fullWidth name="email" control={control} label={t('email')} />
        </StyledController>
        <StyledController>
          <InputController
            fullWidth
            name="password"
            control={control}
            label={t('password')}
            type="password"
          />
        </StyledController>
        {errorMessage && <StyledErrorText>{errorMessage}</StyledErrorText>}
        <StyledForgotPasswordLink onClick={() => navigate(page.passwordReset)}>
          {t('forgotPassword')}
        </StyledForgotPasswordLink>
        <StyledButton variant="contained" type="submit" data-testid="submit-btn">
          {t('login')}
        </StyledButton>
        <StyledButton variant="outlined" onClick={() => navigate(page.signUp)}>
          {t('createAccount')}
        </StyledButton>
      </StyledForm>
    </>
  );
};

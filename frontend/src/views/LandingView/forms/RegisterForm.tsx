import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { FormProps, UserData } from '../../../types/types';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import viewsRoutes from '../../viewsRoutes';
import { updateDetails } from '../userDetailsSlice';
import { ChangeFormComponent } from './components/ChangeFormComponent/ChangeFormComponent';
import {
  handleTextFieldChange,
  handleTextFieldLeave,
  handleTextFieldLeaveTwin,
  initalState,
  TextFieldState,
  validateEmail,
  validateEmailsMatch,
  validateField,
  validateMatch,
  validatePasswordRegister,
  validatePasswordsMatch,
  validateUsernameRegister,
} from './utils';

type RegisterData = {
  message: string;
};

export const AUTH_URL = '/api/auth';

/**
 * Component responsible for displaying register form, registering user
 * and logging them in if registration is successful
 * @param props
 * @returns
 */
export const RegisterForm: React.FC<FormProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [username, setUsername] = useState<TextFieldState>(initalState);
  const [email, setEmail] = useState<TextFieldState>(initalState);
  const [emailRepeat, setEmailRepeat] = useState<TextFieldState>(initalState);
  const [password, setPassword] = useState<TextFieldState>(initalState);
  const [passwordRepeat, setPasswordRepeat] = useState<TextFieldState>(initalState);

  // handles login query after successful registration query
  const {
    isLoading: isLoadingLogin,
    data: dataLogin,
    status: statusLogin,
    runQuery: runQueryLogin,
  } = useQuery<UserData>(`${AUTH_URL}/login`, requestMethods.POST);

  const handleRunQueryLogin = useCallback(() => {
    if (!isLoadingLogin && dataLogin && statusLogin) {
      if (statusLogin === 200) {
        dispatch(
          updateDetails({
            username: dataLogin.username,
            email: dataLogin.email,
            avatar: dataLogin.image,
          })
        );
        history.push(viewsRoutes.START);
      } else history.push(viewsRoutes.ERROR);
    }
  }, [dataLogin, dispatch, history, isLoadingLogin, statusLogin]);

  useEffect(() => {
    handleRunQueryLogin();
  }, [handleRunQueryLogin]);

  // handles registration query
  const {
    isLoading: isLoadingRegister,
    data: dataRegister,
    status: statusRegister,
    runQuery: runQueryRegister,
    resetQuery: resetQueryRegister,
  } = useQuery<RegisterData>(`${AUTH_URL}/register`, requestMethods.POST);

  const handleUseQueryRegister = useCallback(() => {
    if (!isLoadingRegister && statusRegister === 200) {
      if (dataRegister?.message) {
        const message = dataRegister.message;
        if (message === 'User with given username already exists') {
          setUsername({
            value: username.value,
            helperText: 'Sorry, this username is already used',
          });
        } else if (message === 'User with given email already exists') {
          setEmail({
            value: email.value,
            helperText: 'Sorry, this email is already used',
          });
          setEmailRepeat({
            value: email.value,
            helperText: 'Sorry, this email is already used',
          });
        }
        resetQueryRegister();
      } else {
        runQueryLogin({
          username: username.value,
          password: password.value,
        });
      }
    }
  }, [
    dataRegister,
    email.value,
    isLoadingRegister,
    password.value,
    resetQueryRegister,
    runQueryLogin,
    statusRegister,
    username.value,
  ]);

  useEffect(() => {
    handleUseQueryRegister();
  }, [handleUseQueryRegister]);

  const handleRegisterButton = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const isUsernameValid = validateField(username.value, validateUsernameRegister, setUsername);
    const isEmailValid = validateField(email.value, validateEmail, setEmail);
    const isEmailRepeatValid = validateMatch(
      email.value,
      emailRepeat.value,
      validateEmailsMatch,
      setEmailRepeat
    );
    const isPasswordValid = validateField(password.value, validatePasswordRegister, setPassword);
    const isPasswordRepeatValid = validateMatch(
      password.value,
      passwordRepeat.value,
      validatePasswordsMatch,
      setPasswordRepeat
    );

    if (
      isUsernameValid &&
      isEmailValid &&
      isEmailRepeatValid &&
      isPasswordValid &&
      isPasswordRepeatValid
    ) {
      runQueryRegister({
        username: username.value,
        email: email.value,
        repeatedEmail: emailRepeat.value,
        password: password.value,
        repeatedPassword: passwordRepeat.value,
      });
    }
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      sx={{ marginLeft: '20px', marginRight: '20px', marginBottom: '10px' }}
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={0.5}
        component="form"
        sx={{ width: '100%' }}
        onSubmit={handleRegisterButton}
      >
        <LabeledTextInput
          text="Username"
          placeholder="Pick unique one"
          helperText={username.helperText}
          defaultHelperText="Must be between 7 and 32 characters"
          onChange={event => handleTextFieldChange(event, setUsername)}
          onBlur={event => handleTextFieldLeave(event, setUsername, validateUsernameRegister)}
        />
        <LabeledTextInput
          text="Email"
          placeholder="So your password won't be forgotten"
          helperText={email.helperText}
          defaultHelperText="Must be real email"
          onChange={event => handleTextFieldChange(event, setEmail)}
          onBlur={event => handleTextFieldLeave(event, setEmail, validateEmail)}
        />
        <LabeledTextInput
          text="Repeat email"
          placeholder="Make sure it's right"
          helperText={emailRepeat.helperText}
          defaultHelperText="Must be same as email above"
          onChange={event => handleTextFieldChange(event, setEmailRepeat)}
          onBlur={event =>
            handleTextFieldLeaveTwin(event, email.value, setEmailRepeat, validateEmailsMatch)
          }
        />
        <LabeledTextInput
          text="Password"
          placeholder="Mellon"
          helperText={password.helperText}
          defaultHelperText="Must contain one big letter and symbol"
          isPassword={true}
          onChange={event => handleTextFieldChange(event, setPassword)}
          onBlur={event => handleTextFieldLeave(event, setPassword, validatePasswordRegister)}
        />
        <LabeledTextInput
          text="Repeat password"
          placeholder="Repeat every letter"
          helperText={passwordRepeat.helperText}
          defaultHelperText="Must be same as password above"
          isPassword={true}
          onChange={event => handleTextFieldChange(event, setPasswordRepeat)}
          onBlur={event =>
            handleTextFieldLeaveTwin(
              event,
              password.value,
              setPasswordRepeat,
              validatePasswordsMatch
            )
          }
        />
        <CustomButton content="Register" />
      </Stack>
      <ChangeFormComponent
        onSubmit={props.onChangeForm}
        firstLineText="Isn't your drunk face familiar?"
        secondLineText="Come here and..."
        buttonText="Login"
      />
    </Stack>
  );
};

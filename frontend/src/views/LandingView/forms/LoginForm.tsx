import { Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import protectedApiClient from '../../../axios/axios';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { FormProps, UserData } from '../../../types/types';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import viewsRoutes from '../../viewsRoutes';
import { updateDetails } from '../userDetailsSlice';
import { ChangeFormComponent } from './components/ChangeFormComponent/ChangeFormComponent';
import { AUTH_URL } from './RegisterForm';
import {
  handleTextFieldChange,
  handleTextFieldLeave,
  initalState,
  TextFieldState,
  validateField,
  validatePasswordLogin,
  validateUsernameLogin,
} from './utils';

/**
 * Function responsible for logging user via API
 * @param username
 * @param password
 * @returns
 */
export const login = (username: string, password: string): Promise<AxiosResponse> =>
  protectedApiClient.post(`${AUTH_URL}/login`, {
    username: username,
    password: password,
  });

/**
 * Component responsible for displaying login form and logging user
 * @param props
 * @returns
 */
export const LoginForm: React.FC<FormProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [username, setUsername] = useState<TextFieldState>(initalState);
  const [password, setPassword] = useState<TextFieldState>(initalState);

  // handles login query
  const { isLoading, data, status, runQuery, resetQuery } = useQuery<UserData>(
    `${AUTH_URL}/login`,
    requestMethods.POST
  );

  const handleRunQuery = useCallback(() => {
    if (!isLoading && data && status) {
      if (status === 200) {
        dispatch(updateDetails({ username: data.username, email: data.email, avatar: data.image }));
        history.push(viewsRoutes.START);
      } else if (status === 401) {
        setUsername({
          value: username.value,
          helperText: 'Invalid username/email or password',
        });
        setPassword({
          value: password.value,
          helperText: 'Invalid username/email or password',
        });
      }
      resetQuery();
    }
  }, [data, dispatch, history, isLoading, password.value, resetQuery, status, username.value]);

  useEffect(() => {
    handleRunQuery();
  }, [handleRunQuery]);

  const handleLoginButton = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const isUsernameValid = validateField(username.value, validateUsernameLogin, setUsername);
    const isPasswordValid = validateField(password.value, validatePasswordLogin, setPassword);

    if (isUsernameValid && isPasswordValid) {
      runQuery({
        username: username.value,
        password: password.value,
      });
    }
  };

  return (
    <Stack
      direction="column"
      spacing={1}
      justifyContent="flex-start"
      alignItems="flex-start"
      sx={{ marginLeft: '20px', marginRight: '20px', marginBottom: '10px' }}
    >
      <Stack
        direction="column"
        spacing={0.5}
        component="form"
        justifyContent="flex-start"
        alignItems="flex-start"
        onSubmit={handleLoginButton}
        sx={{ width: '100%' }}
      >
        <LabeledTextInput
          text="Email or username"
          placeholder="Thou name, brave hero"
          helperText={username.helperText}
          defaultHelperText=""
          onChange={event => handleTextFieldChange(event, setUsername)}
          onBlur={event => handleTextFieldLeave(event, setUsername, validateUsernameLogin)}
        />
        <LabeledTextInput
          text="Password"
          placeholder="Phrase that must not be spoken"
          helperText={password.helperText}
          defaultHelperText=""
          isPassword={true}
          onChange={event => handleTextFieldChange(event, setPassword)}
          onBlur={event => handleTextFieldLeave(event, setPassword, validatePasswordLogin)}
        />
        <CustomButton content="Login" />
      </Stack>
      <ChangeFormComponent
        onSubmit={props.onChangeForm}
        firstLineText="Are you new here, adventurer?"
        secondLineText="Rest here and..."
        buttonText="Register"
      />
    </Stack>
  );
};

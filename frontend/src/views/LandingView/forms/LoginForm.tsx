import { Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { protectedApiClient } from '../../../axios/axios';
import {
  ChangeFormComponent,
  FormHeader,
  LabeledPasswordInput,
  LabeledTextInput,
  StandardButton,
} from './elements';
import { AUTH_URL } from './RegisterForm';

type TextFieldState = {
  value: string;
  helperText: null | string;
};

type FormProps = {
  onChangeForm: (event: React.FormEvent<HTMLFormElement>) => void;
};

const login = (username: string, password: string): Promise<AxiosResponse> =>
  protectedApiClient.post(`${AUTH_URL}/login`, {
    username: username,
    password: password,
  });

export const LoginForm: React.FC<FormProps> = props => {
  const history = useHistory();
  const [username, setUsername] = useState<TextFieldState>({
    value: '',
    helperText: null,
  });
  const [password, setPassword] = useState<TextFieldState>({
    value: '',
    helperText: null,
  });

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    validationFn: () => boolean,
    setStateFn: (newState: TextFieldState) => void,
    helperText: string
  ): void => {
    setStateFn({
      value: event.target.value,
      helperText: validationFn() ? null : helperText,
    });
  };

  const validateUsername = () =>
    username.value.includes('@') || (username.value.length > 7 && username.value.length < 13);

  const validatePassword = () => password.value.length > 7 && password.value.length < 256;

  const handleLoginButton = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (username.helperText === null && password.helperText === null) {
      const response = await login(username.value, password.value);
      if (response.status === 200) {
        history.push('/welcome');
      } else if (response.status === 401) {
        setUsername({
          value: username.value,
          helperText: 'Invalid username/email or password',
        });
        setPassword({
          value: password.value,
          helperText: 'Invalid username/email or password',
        });
      } else {
        window.alert('Unexpected behaviour');
      }
    }
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      sx={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}
    >
      <FormHeader text="LOGIN" />
      <Stack
        direction="column"
        alignItems="stretch"
        spacing={1}
        component="form"
        sx={{ width: '100%' }}
        onSubmit={handleLoginButton}
      >
        <LabeledTextInput
          text="Username"
          id="login-username"
          placeholder="Thou name, brave hero"
          helperText={username.helperText}
          onChange={event =>
            handleTextFieldChange(
              event,
              validateUsername,
              setUsername,
              'Username is 8-12 characters long'
            )
          }
        />
        <LabeledPasswordInput
          text="Password"
          id="login-password"
          placeholder="Phrase that must not be spoken"
          helperText={password.helperText}
          onChange={event =>
            handleTextFieldChange(
              event,
              validatePassword,
              setPassword,
              'Password is 8-255 characters long'
            )
          }
        />
        <StandardButton text="Login" />
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

import { Stack } from '@mui/material';
import { useState } from 'react';
import {
  ChangeFormComponent,
  FormHeader,
  LabeledPasswordInput,
  LabeledTextInput,
  StandardButton,
} from './elements';

type FormProps = {
  onChangeForm: () => void;
};

export const LoginForm: React.FC<FormProps> = props => {
  const [username, setUsername] = useState({
    value: '',
    error: false,
    helperText: '',
  });
  const [password, setPassword] = useState({
    value: '',
    error: false,
    helperText: '',
  });

  const [buttonState, setButtonState] = useState(true);

  const handleChange = (): void => {
    const anyFieldInvalid = username.error && password.error;
    setButtonState(!anyFieldInvalid);
  };

  const handleUsernameTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername({
      value: event.currentTarget.value,
      error: username.error,
      helperText: username.helperText,
    });
  };

  const handlePasswordTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword({
      value: event.currentTarget.value,
      error: password.error,
      helperText: password.helperText,
    });
  };

  const handleLoginButton = (): void => {
    if (buttonState) {
      window.alert('Login');
      // here should be sending request to login and handling response
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
        onChange={handleChange}
        onSubmit={handleLoginButton}
      >
        <LabeledTextInput
          text="Username"
          id="login-username"
          placeholder=""
          onChange={event => handleUsernameTextFieldChange(event)}
          helperText={username.helperText}
          error={username.error}
        />
        <LabeledPasswordInput
          text="Password"
          id="login-password"
          placeholder=""
          onChange={event => handlePasswordTextFieldChange(event)}
          helperText={password.helperText}
          error={password.error}
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

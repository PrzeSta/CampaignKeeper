import axios from 'axios';
import { store } from '../store';
import { updateError } from '../views/ErrorView/errorSlice';

const protectedApiClient = axios.create({
  validateStatus: status => status < 500,
  timeout: 30000,
});

protectedApiClient.interceptors.response.use(
  response => response,
  error => {
    store.dispatch(updateError({ isError: true, message: 'Internal server error' }));
    return error;
  }
);

export default protectedApiClient;

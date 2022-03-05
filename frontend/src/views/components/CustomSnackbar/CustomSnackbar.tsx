import { Close } from '@mui/icons-material';
import { Snackbar } from '@mui/material';
import { CustomSnackbarType } from '../../../types/types';

type CustomSnackbarProps = {
  message: string;
  type: CustomSnackbarType;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

// TO-DO add sx to Snackbar with switch depending on type (@Michał)
export const CustomSnackbar: React.FC<CustomSnackbarProps> = props => (
  <Snackbar
    open={props.isOpen}
    onClose={() => props.setIsOpen(false)}
    message={props.message}
    action={<Close onClick={() => props.setIsOpen(false)} />}
    autoHideDuration={2000}
  />
);

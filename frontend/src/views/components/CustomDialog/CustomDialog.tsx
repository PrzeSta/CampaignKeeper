import { Dialog, DialogContent, Stack } from '@mui/material';
import { CustomButtonBehavior, CustomButtonType } from '../../../types/types';
import { CustomButton } from '../CustomButton/CustomButton';
import { CustomDialogTitle } from './components/CustomDialogTitle/CustomDialogTitle';
import { ReturnBar } from './components/ReturnBar/ReturnBar';

//TO-DO: add type of dialog (no/two/three buttons), info about buttons and their functions (if needed)
type CustomDialogProps = {
  title: string;
  isTitleRed?: boolean;
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  onOk?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
};

export const CustomDialog: React.FC<CustomDialogProps> = ({
  isTitleRed = false,
  ...otherProps
}) => {
  //TO-DO: add option without Delete button
  const renderButtons = () => {
    if (otherProps.onOk && otherProps.onCancel && otherProps.onDelete)
      return (
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          sx={{ width: '100%', paddingTop: 1 }}
        >
          <CustomButton
            text="DELETE"
            behavior={CustomButtonBehavior.Func}
            type={CustomButtonType.Delete}
            onClick={otherProps.onCancel}
          />
          <CustomButton
            text="CANCEL"
            behavior={CustomButtonBehavior.Func}
            type={CustomButtonType.Primary}
            onClick={otherProps.onCancel}
          />
          <CustomButton text="OK" behavior={CustomButtonBehavior.Func} onClick={otherProps.onOk} />
        </Stack>
      );
    if (otherProps.onOk && otherProps.onCancel)
      return (
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          sx={{ width: '100%', paddingTop: 1 }}
        >
          <CustomButton
            text="CANCEL"
            behavior={CustomButtonBehavior.Func}
            type={CustomButtonType.Primary}
            onClick={otherProps.onCancel}
          />
          <CustomButton text="OK" behavior={CustomButtonBehavior.Func} onClick={otherProps.onOk} />
        </Stack>
      );
    return null;
  };

  return (
    <Dialog
      open={otherProps.isOpen}
      onClose={otherProps.onClose ? otherProps.onClose : () => otherProps.setIsOpen(false)}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'customPalette.surface',
          borderRadius: 3,
        },
      }}
    >
      <DialogContent
        sx={{
          minWidth: '20vw',
          maxHeight: '90wh',
          paddingTop: 1.6,
          paddingBottom: 1.9,
          paddingLeft: 2.4,
          paddingRight: 2.4,
        }}
      >
        <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={1}>
          <ReturnBar setOpen={otherProps.setIsOpen} />
          <CustomDialogTitle title={otherProps.title} isTitleRed={isTitleRed} />
          {otherProps.children}
          {renderButtons()}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

import { Button } from '@mui/material';
import { CustomButtonBehavior, CustomButtonType } from '../../../types/types';

//TO-DO add type for color (gold/standard/red)
type CustomButtonProps = {
  text: string;
  behavior?: CustomButtonBehavior;
  type?: CustomButtonType;
  onClick?: () => void;
};

//TO-DO add setting color and background color in standardButtonSx
export const CustomButton: React.FC<CustomButtonProps> = ({
  behavior = CustomButtonBehavior.Submit,
  type = CustomButtonType.Accent,
  ...otherProps
}) => {
  let backgroundColor: string;
  let color: string;
  if (type === CustomButtonType.Accent) {
    backgroundColor = 'customPalette.accent';
    color = 'customPalette.onAccent';
  } else if (type === CustomButtonType.Primary) {
    backgroundColor = 'customPalette.primary';
    color = 'customPalette.onPrimary';
  } else {
    backgroundColor = 'customPalette.red';
    color = 'customPalette.onRed';
  }

  const standardButtonSx = {
    color: color,
    paddingLeft: 1.2,
    paddingRight: 1.2,
    paddingTop: 0.5,
    paddingBottom: 0.3,
    fontWeight: 'bold',
    backgroundColor: backgroundColor,
    '&.MuiButtonBase-root:hover': {
      bgcolor: backgroundColor,
    },
  };
  switch (behavior) {
    case CustomButtonBehavior.Upload:
      return (
        <Button variant="contained" component="span" sx={standardButtonSx}>
          {otherProps.text}
        </Button>
      );
    case CustomButtonBehavior.Func:
      return (
        <Button variant="contained" onClick={otherProps.onClick} sx={standardButtonSx}>
          {otherProps.text}
        </Button>
      );
    case CustomButtonBehavior.Submit:
      return (
        <Button variant="contained" type="submit" sx={standardButtonSx}>
          {otherProps.text}
        </Button>
      );
  }
};

import { ArrowBack } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

type ReturnBarProps = {
  setOpen: (newState: boolean) => void;
};

/**
 * Component allowing user to close all dialogs in application
 * without resetting their state
 * @param props
 * @returns
 */
export const ReturnBar: React.FC<ReturnBarProps> = props => (
  <Stack
    direction="row"
    justifyContent="flex-start"
    alignItems="center"
    spacing={1.8}
    onClick={() => props.setOpen(false)}
    sx={{ cursor: 'pointer', paddingLeft: 2.4, paddingRight: 2.4 }}
  >
    <ArrowBack sx={{ color: 'customPalette.onSurface', opacity: 0.8 }} />
    <Typography
      variant="h6"
      sx={{
        paddingTop: 0.2,
        fontSize: 18,
        fontWeight: 'regular',
        color: 'customPalette.onSurface',
        opacity: 0.8,
      }}
    >
      {'BACK'}
    </Typography>
  </Stack>
);

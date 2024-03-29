import { Box, Paper, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { NavBarViewDialog } from '../../../types/types';
import { CustomSnackbar } from '../CustomSnackbar/CustomSnackbar';
import { useSnackbar } from '../CustomSnackbar/useSnackbar';
import { PrimaryCustomDialogWrapper } from './components/CustomDialogWrapper/PrimaryCustomDialogWrapper';
import { CustomFab } from './components/CustomFab/CustomFab';
import { NavBar } from './components/NavBar/NavBar';
import { SecondaryDialogWrapper } from './components/SecondaryCustomDialogWrapper/SecondaryCustomDialogWrapper';

type ViewWithNavBarWrapperProps = {
  isPrimaryOpen: boolean;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  primaryDialogType: NavBarViewDialog;
  setPrimaryDialogType: (newType: NavBarViewDialog) => void;
  isSecondaryOpen?: boolean;
  setIsSecondaryOpen?: (newIsOpen: boolean) => void;
  handleFab?: () => void;
};

/**
 * Component serving as wrapper for all views using NavBar (that is: all views
 * shown to logged user). It provides it's children (views) with wrapper
 * for primary (various form which create/edit object, e.g. sessions and event)
 * and secondary dialog (mostly confirmation of e.g. deleting Codex entry),
 * Floating Action Button wrapper (used to open primary dialog in all views)
 * and Snackbar for displaying feedback and tools to use it
 * @param props
 * @returns
 */
export const ViewWithNavBarWrapper: React.FC<ViewWithNavBarWrapperProps> = props => {
  const currentView = useLocation().pathname;

  const { snackbarProperties, setSnackbarInfo, setSnackbarSuccess, setSnackbarError } =
    useSnackbar();

  return (
    <Paper
      square
      elevation={0}
      sx={{
        height: '100vh',
        maxHeight: '100%',
        width: '100%',
        maxWidth: '100%',
        position: 'absolute',
        backgroundColor: 'customPalette.background',
        zIndex: '-2',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
        spacing={0}
        sx={{
          height: '100%',
          maxHeight: '100%',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <NavBar
          currentView={currentView}
          setSnackbarInfo={setSnackbarInfo}
          setSnackbarSuccess={setSnackbarSuccess}
          setSnackbarError={setSnackbarError}
        />
        <Box
          sx={{
            height: '100%',
            maxHeight: '100%',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {props.children}
        </Box>
      </Stack>
      <CustomFab currentView={currentView} handleClick={props.handleFab} />
      <PrimaryCustomDialogWrapper
        currentView={currentView}
        isOpen={props.isPrimaryOpen}
        dialogType={props.primaryDialogType}
        setIsOpen={props.setIsPrimaryOpen}
        setIsSecondaryOpen={props.setIsSecondaryOpen}
        setSnackbarInfo={setSnackbarInfo}
        setSnackbarSuccess={setSnackbarSuccess}
        setSnackbarError={setSnackbarError}
      />
      {props.isSecondaryOpen && props.setIsSecondaryOpen ? (
        <SecondaryDialogWrapper
          currentView={currentView}
          isOpen={props.isSecondaryOpen}
          setIsOpen={props.setIsSecondaryOpen}
          setIsPrimaryOpen={props.setIsPrimaryOpen}
          setSnackbarInfo={setSnackbarInfo}
          setSnackbarSuccess={setSnackbarSuccess}
          setSnackbarError={setSnackbarError}
        />
      ) : null}
      <CustomSnackbar
        message={snackbarProperties.message}
        type={snackbarProperties.type}
        isOpen={snackbarProperties.isOpen}
        setIsOpen={snackbarProperties.setIsOpen}
      />
    </Paper>
  );
};

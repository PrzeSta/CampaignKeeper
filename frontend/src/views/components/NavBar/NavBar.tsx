import { Paper, Stack } from '@mui/material';
import { useHistory, useLocation } from 'react-router';
import viewsRoutes from '../../viewsRoutes';
import { Logo, LogoutPanel, PrimaryNavBarButton, SecondaryNavBarButton } from './elements';

export const NavBar: React.FC = () => {
  const history = useHistory();
  const currentView = useLocation().pathname;
  // eslint-disable-next-line no-console
  console.log(currentView);
  const areSecondaryButtonsDisplayed =
    currentView === viewsRoutes.CAMPAIGN ||
    currentView === viewsRoutes.MAP ||
    currentView === viewsRoutes.SESSIONS ||
    currentView === viewsRoutes.CODEX;

  return (
    <Paper
      elevation={6}
      sx={{ backgroundColor: 'customBackgrounds.gray', height: 50, overflow: 'visible' }}
      square
    >
      <Stack direction="row" spacing={0} justifyContent="flex-start" alignItems="flex-start">
        <Logo />
        <PrimaryNavBarButton
          text="START"
          isChosen={currentView === viewsRoutes.START}
          onClick={() => {
            history.push(viewsRoutes.START);
          }}
        />
        <PrimaryNavBarButton
          text="CAMPAIGN"
          isChosen={areSecondaryButtonsDisplayed}
          onClick={() => {
            history.push(viewsRoutes.CAMPAIGN);
          }}
        />
        <SecondaryNavBarButton
          text="MAP"
          isChosen={currentView === viewsRoutes.MAP}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => {
            history.push(viewsRoutes.MAP);
          }}
        />
        <SecondaryNavBarButton
          text="SESSIONS"
          isChosen={currentView === viewsRoutes.SESSIONS}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => {
            history.push(viewsRoutes.SESSIONS);
          }}
        />
        <SecondaryNavBarButton
          text="CODEX"
          isChosen={currentView === viewsRoutes.CODEX}
          isDisplayed={areSecondaryButtonsDisplayed}
          onClick={() => {
            history.push(viewsRoutes.CODEX);
          }}
        />
        <PrimaryNavBarButton
          text="NOTES"
          isChosen={currentView === viewsRoutes.NOTES}
          onClick={() => {
            history.push(viewsRoutes.NOTES);
          }}
        />
        <LogoutPanel
          onClick={() => {
            history.push(viewsRoutes.LOGOUT);
          }}
        />
      </Stack>
    </Paper>
  );
};

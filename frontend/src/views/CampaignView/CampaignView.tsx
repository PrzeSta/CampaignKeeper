import { Box, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { handleWheelEvent, useWindowDimensions } from '../../utils/utils';
import { CampaignTile } from '../components/CampaignTile/CampaignTile';
import { QuoteLine } from '../components/QuoteLine/QuoteLine';
import { quotes } from '../components/QuoteLine/quotes';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { SessionTile } from './components/SessionTile/SessionTile';

export const CampaignView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const sessionsNames = useSelector((state: RootState) => state.campaignView.sessionsNames);

  const handleFab = () => {
    setDialogType(NavBarViewDialog.NewCampaign);
    setIsOpen(true);
  };

  const { width: width } = useWindowDimensions();
  const centeredPadding = Math.max((width - 1368.1) / 2, width < 450 ? 6 : 51);

  const title = 'Lorem ipsum';
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => setQuote(quotes[Math.floor(Math.random() * quotes.length)]), []);

  return (
    <ViewWithNavBarWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogType={dialogType}
      setDialogType={setDialogType}
      isSecondaryOpen={isSecondaryOpen}
      setIsSecondaryOpen={setIsSecondaryOpen}
      handleFab={handleFab}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ width: '100%', overflowY: 'auto' }}
      >
        <QuoteLine text={quote} />
        <CampaignTile campaignTitle={title} setIsOpen={setIsOpen} setDialogType={setDialogType} />
        <Box
          component="div"
          onWheel={handleWheelEvent}
          sx={{
            overflowY: 'hidden',
            alignItems: 'center',
            justifyContent: 'flex-start',
            display: 'flex',
            height: '100%',
            width: '100%',
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            columnSpacing={10}
            sx={{
              maxHeight: '100%',
              width: 'auto',
              maxWidth: '100%',
              paddingLeft: centeredPadding + 'px',
            }}
          >
            {sessionsNames.map(title => (
              <Grid item key={title}>
                <SessionTile
                  sessionTitle={title}
                  setIsOpen={setIsOpen}
                  setDialogType={setDialogType}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </ViewWithNavBarWrapper>
  );
};
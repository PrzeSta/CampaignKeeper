import { Paper, Stack } from '@mui/material';
import { NavBarViewDialog } from '../../../../../../../../types/types';
import { SessionEventWithPos } from '../../../../../../eventsSlice';
import { EventDetails } from './components/EventDetails/EventDetails';
import { EventMenu } from './components/EventMenu/EventMenu';

type EventTileProps = {
  id: string;
  event: SessionEventWithPos;
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

export const EventTile: React.FC<EventTileProps> = props => (
  <Paper
    elevation={0}
    sx={{
      backgroundColor: 'customPalette.accent',
      borderRadius: 2,
      width: '400px',
      minHeight: props.event.displayStatus === 'shown' ? '200px' : '30px',
      '& .MuiBox-root': {
        '& .css-0': {
          zIndex: '5',
        },
      },
      position: 'relative',
    }}
    id={props.id}
  >
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={0}
      sx={{
        padding: 0.7,
      }}
    >
      <EventMenu
        title={props.event.title}
        event={props.event}
        setIsOpen={props.setIsOpen}
        setDialogType={props.setDialogType}
      />
      {props.event.displayStatus === 'shown' ? (
        <EventDetails
          place={props.event.placeMetadataArray}
          characters={props.event.charactersMetadataArray}
          description={props.event.descriptionMetadataArray}
        />
      ) : null}
    </Stack>
  </Paper>
);

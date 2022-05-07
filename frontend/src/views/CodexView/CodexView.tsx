import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import viewsRoutes from '../viewsRoutes';
import { fetchSchemas } from './codexSlice';
import { updateCampaignId } from './codexViewSlice';
import { EntriesListPanel } from './components/EntriesListPanel/EntriesListPanel';
import { EntryDisplayPanel } from './components/EntryDisplayPanel/EntryDisplayPanel';
import { NewSchemaDialog } from './components/NewSchemaDialog/NewSchemaDialog';
import { SchemasList } from './components/SchemasList/SchemasList';

export const CodexView: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCampaignId } = useSelector((state: RootState) => state.campaignView);
  const { codexCampaignId, currentEntry } = useSelector((state: RootState) => state.codexView);
  const { isCodexDownloaded } = useSelector((state: RootState) => state.codex);

  const history = useHistory();

  const [isPrimaryOpen, setIsPrimaryOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewEntry);
  const [isSchemaDialogOpen, setIsSchemaDialogOpen] = useState(false);

  useEffect(() => {
    if (currentEntry) setDialogType(NavBarViewDialog.EditEntry);
    else setDialogType(NavBarViewDialog.NewEntry);
  }, [currentEntry]);

  if (currentCampaignId === '') history.push(viewsRoutes.CAMPAIGN);
  else if (!isCodexDownloaded || codexCampaignId !== currentCampaignId) {
    dispatch(fetchSchemas(currentCampaignId));
    dispatch(updateCampaignId({ campaignId: currentCampaignId }));
  }

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isPrimaryOpen}
      setIsPrimaryOpen={setIsPrimaryOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
    >
      <Box sx={{ height: '100%', width: '100%' }}>
        <SchemasList setIsOpen={setIsSchemaDialogOpen} />
        <Box
          sx={{
            height: '100%',
            maxHeight: '100%',
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              marginLeft: '230px',
              marginRight: { xs: '0px', md: '220px' },
              height: 'calc(100% - 25px)',
            }}
          >
            {currentEntry ? (
              <EntryDisplayPanel />
            ) : (
              <EntriesListPanel setDialogType={setDialogType} />
            )}
          </Box>
        </Box>
        <NewSchemaDialog isOpen={isSchemaDialogOpen} setIsOpen={setIsSchemaDialogOpen} />
      </Box>
    </ViewWithNavBarWrapper>
  );
};

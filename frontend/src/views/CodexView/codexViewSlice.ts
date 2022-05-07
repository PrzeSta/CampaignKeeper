import { createSlice } from '@reduxjs/toolkit';
import { Entry, Schema } from './codexSlice';

interface CodexViewState {
  codexCampaignId: string;
  currentSchema: null | Schema;
  currentEntry: null | Entry;
}

const initialState: CodexViewState = {
  codexCampaignId: '',
  currentSchema: null,
  currentEntry: null,
};

const codexViewSlice = createSlice({
  name: 'codexView',
  initialState,
  reducers: {
    setCurrentSchema: (state, action) => {
      state.currentSchema = action.payload.newSchema;
    },
    setCurrentEntry: (state, action) => {
      state.currentSchema = action.payload.newEntry;
    },
    updateCampaignId: (state, action) => {
      state.codexCampaignId = action.payload.campaignId;
    },
  },
});

export const { setCurrentSchema, setCurrentEntry, updateCampaignId } = codexViewSlice.actions;

export default codexViewSlice.reducer;

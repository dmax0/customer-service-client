import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { PURGE } from 'redux-persist';
import type { IRoute } from '@/router/routes';
import localConfig from '@/config';
import {  fetchTeams } from '@/services/api';
export interface Team {
    id: number;
    name: string;
    industry: string;
    province: string;
    city: string;
    createdAt: string;
    updatedAt: string;
}
export const initialState: Team[] = [];
// Thunk action，用于获取所有Team
export const fetchAllTeams = createAsyncThunk('team/fetchAllTeams', async () => {
  const response = await fetchTeams();
//   console.log("response", response)
  return response;
});
export const TeamSlice = createSlice({
  name: 'Team',
  initialState,
  reducers: {
    
    setTeams: (state, action: PayloadAction<Team[]>) => {
        state.team = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTeams.fulfilled, (state, action) => {
        state.team = action.payload;
      })
      .addCase(PURGE, (state) => {
        return initialState;
      });

  }
});

export const { setTeams } = TeamSlice.actions;  

export const selectTeams= (state: RootState) => state.team.team;

export default TeamSlice.reducer;

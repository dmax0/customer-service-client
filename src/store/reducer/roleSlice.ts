import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { PURGE } from 'redux-persist';
import type { IRoute } from '@/router/routes';
import localConfig from '@/config';
import { fetchRoles } from '@/services/api';
export interface Role {
    id: number;
    nameEn: string;
    nameZh: string;
    level: number;
    remark: string;
    createdAt: string;
    updatedAt: string;
}
export const initialState: Role[] = [];
// Thunk action，用于获取所有角色
export const fetchAllRoles= createAsyncThunk('user/fetchAllRoles', async () => {
  const response = await fetchRoles();
  console.log("response", response)
  return response;
});
export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    
    setRoles: (state, action: PayloadAction<Role[]>) => {
        state.roles = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.roles = action.payload as API.Role[];
      }) // 处理获取所有用户成功的情况，更新用户数组
      .addCase(fetchAllRoles.rejected, (state) => {
        state.roles = [];
      }) // 处理获取所有用户失败的情况，置空用户数组
      .addCase(PURGE, (state) => {
        state.roles = [];
      });
  }
});

export const { setRoles } = roleSlice.actions;  

export const selectRoles = (state: RootState) => state.role.roles;

export default roleSlice.reducer;

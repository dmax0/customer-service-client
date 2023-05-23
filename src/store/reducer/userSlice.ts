import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { fetchLogin, getUserMenuFromServer } from '@/services/api';
import { PURGE } from 'redux-persist';
import type { IRoute } from '@/router/routes';
import localConfig from '@/config';
import { fetchUsers } from '@/services/user';
export interface UserState {
  menuItems: IRoute[];
  userInfo: API.UserInfo;
  token: string | undefined;
  isLogin: boolean;
}

const initialState: UserState = {
  menuItems: [],
  userInfo: {},
  token: undefined,
  isLogin: false
};

export const login = createAsyncThunk(
  'user/fetchLogin',
  async (params: Expand<API.LoginParams>) => {
    const response = await fetchLogin(params);
    // console.log(response)
    return response;
  }
);
export const fetchUserMenu = createAsyncThunk(
  'user/fetchUserMenu',
  async () => {
    const response = await getUserMenuFromServer();
    return response;
  }
);
// 新增异步 Thunk action，用于获取所有用户
export const fetchAllUsers = createAsyncThunk('user/fetchAllUsers', async () => {
  const response = await fetchUsers();
  return response;
});
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<API.UserInfo>) => {
      state.userInfo = action.payload;
    },
    setMenuItems: (state, action: PayloadAction<IRoute[]>) => {
      state.menuItems = action.payload;
    },
    setUsers: (state, action: PayloadAction<API.User[]>) => {
      state.users = action.payload;
    } 
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        // console.log(action.payload)
        const {userInfo, token } = action.payload;

        state.userInfo = userInfo;
        state.token = token;
        state.isLogin = true;
        // 在这里将token保存到localStorage
        localStorage.setItem(localConfig.api.sessionKey, token);
      })
      .addCase(login.rejected, (state) => {
        state.isLogin = false;
      })
      .addCase(fetchUserMenu.fulfilled, (state, action) => {
        state.menuItems = action.payload as IRoute[];
      })
      .addCase(fetchUserMenu.rejected, (state) => {
        state.menuItems = [];
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload as API.User[];
      }) // 处理获取所有用户成功的情况，更新用户数组
      .addCase(fetchAllUsers.rejected, (state) => {
        state.users = [];
      }) // 处理获取所有用户失败的情况，置空用户数组
      .addCase(PURGE, (state) => {
        state.menuItems = [];
        state.userInfo = {};
        state.token = undefined;
        state.isLogin = false;
  
        localStorage.removeItem(localConfig.api.sessionKey);
      });
  }
});

export const { setToken, setUserInfo } = userSlice.actions;

export const selectToken = (state: RootState) => state.user.token;
export const selectUserInfo = (state: RootState) => state.user.userInfo;
export const selectMenuItems = (state: RootState) => state.user.menuItems;
export const selectUsers = (state: RootState) => state.user.users;

export default userSlice.reducer;

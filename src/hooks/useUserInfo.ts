import { fetchUserInfo } from '@/services/api';
import { setUserInfo } from '@/store/reducer/userSlice';
import { store } from '@/store';


export const useUserInfo = function () {
  return useAppSelector(selectUserInfo);
};

export const initUserInfo = async function (navigate) {
  const user = JSON.parse(localStorage.getItem('persist:user') || '{}');
  if (!user.token) {
    return;
  }
  const userInfo = await fetchUserInfo();
  store.dispatch(setUserInfo(userInfo));
  // 如果用户已经登录，重定向到首页
  navigate('/');
};

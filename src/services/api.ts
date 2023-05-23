import axios from './axios';
import type { MenuItem } from '@/config';

/**
 * 分析页接口
 */
export const fetchAnalysisChart = () =>
  axios.get<API.AnalysisChartData>('/AnalysisChart');

/**
 * 登录
 */
export const fetchLogin = async (params: Expand<API.LoginParams>) =>
  axios.post<any, ExpandRecursively<API.LoginData>>('/auth/login', params);

/**
 * 验证用户登录态是否过期 
 * @returns
 */
export const fetchIsTokenValid = () => axios.get<boolean>('/auth/validateToken');

/**
 * 获取用户菜单
 */
export const getUserMenuFromServer = () =>
  axios.get<ExpandRecursively<MenuItem[]>>('/menu/list');

/**
 * 获取用户信息
 */
export const fetchUserInfo = () => axios.get<API.UserInfo>('/auth/info');

/**
 * 获取文章列表
 * @param params
 * @returns
 */
export const fetchArticleList = (params: any) =>
  axios.post<any, API.ArticleList>('/Article/List', params);

/**
 * 请求规则列表
 * @param params
 * @returns
 */
export const getRules = (params: any) =>
  axios.post<any, API.List<API.RuleItem[]>>('/Rule/List', params);


/**
 * 获取所有角色
 * @returns 
 */
export const fetchRoles = () => axios.get<API.Role[]>('/roles');

/**
 * 获取所有团队
 * @returns
 * 
 */
export const fetchTeams = () => axios.get<API.Team[]>('/teams');
/**
 * 获取faq列表
 * @returns 
 */
export const fetchFaqList = () => axios.get<API.Faq[]>('/faq');
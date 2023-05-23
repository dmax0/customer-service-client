import axios from './axios';
import type { MenuItem } from '@/config';

/**
 * 获取所有用户
 */
export const fetchUsers = (page: number, pageSize: number) =>
    axios.get<API.User[]>('/users', { params: { page, pageSize } });

/**
 * 切换用户状态
 */
export const toggleUserStatus = (id: number, status: number) =>
    axios.put<API.User>(`/users/${id}/status`, { status });

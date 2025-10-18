import { api } from './api';

export const adminUserService = {
  // Get all users with filters
  async getUsers(params = {}) {
    const { page = 1, limit = 20, search, role, status } = params;
    const query = {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
    };

    const res = await api.get('/admin/users', query);
    if (!res?.success) throw new Error(res?.error || 'Failed to fetch users');
    return res.data;
  },

  // Get user by ID
  async getUserById(id) {
    const res = await api.get(`/admin/users/${id}`);
    if (!res?.success) throw new Error(res?.error || 'Failed to fetch user');
    return res.data;
  },

  // Update user status (activate/deactivate)
  async updateUserStatus(id, isActive) {
    const res = await api.put(`/admin/users/${id}/status`, { is_active: isActive });
    if (!res?.success) throw new Error(res?.error || 'Failed to update user status');
    return res;
  },

  // Update user role
  async updateUserRole(id, roleName) {
    const res = await api.put(`/admin/users/${id}/role`, { role_name: roleName });
    if (!res?.success) throw new Error(res?.error || 'Failed to update user role');
    return res;
  },

  // Get user statistics
  async getUserStats() {
    const res = await api.get('/admin/users/stats/overview');
    if (!res?.success) throw new Error(res?.error || 'Failed to fetch user stats');
    return res.data;
  },

  // Create new user
  async createUser(userData) {
    const res = await api.post('/admin/users', userData);
    if (!res?.success) throw new Error(res?.error || 'Failed to create user');
    return res.data;
  },
};

export default adminUserService;

// api/rolesServices.ts
import { api } from './api';

export interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  permissions: string[];
  isActive: boolean;
  isSystem: boolean;
  userCount: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleAssignment {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: string;
  action: string;
  date: string;
  assignedBy: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
  level: number;
  permissions: string[];
  created_by: string;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  level?: number;
  permissions?: string[];
  isActive?: boolean;
  updated_by?: string;
}

export interface RoleAssignmentData {
  user_id: string;
  role_id: string;
  assigned_by: string;
}

export interface BulkRoleAssignmentData {
  user_ids: string[];
  role_id: string;
  assigned_by: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const permissionCategories = {
  user_management: [
    { id: 'user_view', name: 'View Users', description: 'Can view user profiles and information' },
    { id: 'user_edit', name: 'Edit Users', description: 'Can modify user information' },
    { id: 'user_delete', name: 'Delete Users', description: 'Can remove users from the system' },
    { id: 'role_view', name: 'View Roles', description: 'Can view role definitions' },
    { id: 'role_edit', name: 'Edit Roles', description: 'Can modify role permissions' },
  ],
  content_management: [
    { id: 'content_view', name: 'View Content', description: 'Can access and view content' },
    { id: 'content_create', name: 'Create Content', description: 'Can create new content' },
    { id: 'content_edit', name: 'Edit Content', description: 'Can modify existing content' },
    { id: 'content_delete', name: 'Delete Content', description: 'Can remove content' },
  ],
  course_management: [
    { id: 'course_view', name: 'View Courses', description: 'Can view course catalog' },
    { id: 'course_create', name: 'Create Courses', description: 'Can create new courses' },
    { id: 'course_edit', name: 'Edit Courses', description: 'Can modify course details' },
    { id: 'course_delete', name: 'Delete Courses', description: 'Can remove courses' },
  ],
  analytics: [
    { id: 'analytics_view', name: 'View Analytics', description: 'Can access analytics dashboard' },
    { id: 'reports_generate', name: 'Generate Reports', description: 'Can create and export reports' },
  ],
  system: [
    { id: 'system_settings', name: 'System Settings', description: 'Can modify system configuration' },
    { id: 'backup_manage', name: 'Manage Backups', description: 'Can manage system backups' },
  ]
};

class RolesService {
  async getRoles(): Promise<Role[]> {
    return await api.get<Role[]>('/api/roles/');
  }

  async getRole(roleId: string): Promise<Role> {
    return await api.get<Role>(`/api/roles/${roleId}`);
  }

  async createRole(data: CreateRoleData): Promise<Role> {
    return await api.post<Role>('/api/roles/', data);
  }

  async updateRole(roleId: string, data: UpdateRoleData): Promise<Role> {
    return await api.put<Role>(`/api/roles/${roleId}`, data);
  }

  async deleteRole(roleId: string): Promise<void> {
    await api.delete(`/api/roles/${roleId}`);
  }

  async getRoleAssignments(): Promise<RoleAssignment[]> {
    return await api.get<RoleAssignment[]>('/api/roles/assignments/history');
  }

  async assignRole(assignment: RoleAssignmentData): Promise<any> {
    return await api.post('/api/roles/assign', assignment);
  }

  async bulkAssignRole(bulkAssignment: BulkRoleAssignmentData): Promise<any> {
    return await api.post('/api/roles/bulk-assign', bulkAssignment);
  }

  async removeRole(assignment: RoleAssignmentData): Promise<any> {
    return await api.post('/api/roles/remove', assignment);
  }
async getUserRoles(userId: string): Promise<Role[]> {
  return await api.get<Role[]>(`/api/roles/users/${userId}/roles`);
}
  async getUsers(): Promise<User[]> {
    try {
      return await api.get<User[]>('/api/users');
    } catch (error) {
      console.error('Failed to fetch users, using mock data:', error);
      // Fallback mock data
      return [
        { id: "user_001", name: "John Doe", email: "john@example.com" },
        { id: "user_002", name: "Jane Smith", email: "jane@example.com" },
        { id: "user_003", name: "Bob Johnson", email: "bob@example.com" },
        { id: "user_004", name: "Alice Brown", email: "alice@example.com" },
        { id: "user_005", name: "Charlie Wilson", email: "charlie@example.com" },
      ];
    }
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    return await api.get<Role[]>(`/api/roles/users/${userId}/roles`);
  }

  async getPermissionCategories(): Promise<any> {
    return await api.get('/api/roles/permissions/categories');
  }

  async getAllPermissions(): Promise<any> {
    return await api.get('/api/roles/permissions/list');
  }
}

export const rolesService = new RolesService();
// services/rolesService.ts
const API_BASE_URL = 'http://localhost:8000';

// Interfaces
export interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  userCount: number;
  isActive: boolean;
  isSystem: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
  level: number;
  permissions: string[];
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
  action: "assigned" | "updated" | "removed";
  date: string;
  assignedBy: string;
}

// API Service
class RolesService {
  private baseUrl = `${API_BASE_URL}/api/roles`;

  async getRoles(): Promise<Role[]> {
    const response = await fetch(`${this.baseUrl}/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.statusText}`);
    }
    return response.json();
  }

  async getRole(id: string): Promise<Role> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch role: ${response.statusText}`);
    }
    return response.json();
  }

  async createRole(roleData: CreateRoleData): Promise<Role> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to create role: ${response.statusText}`);
    }
    return response.json();
  }

  async updateRole(id: string, roleData: Partial<Role>): Promise<Role> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to update role: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteRole(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to delete role: ${response.statusText}`);
    }
  }

  async getRoleAssignments(): Promise<RoleAssignment[]> {
    const response = await fetch(`${this.baseUrl}/assignments/history`);
    if (!response.ok) {
      throw new Error(`Failed to fetch role assignments: ${response.statusText}`);
    }
    return response.json();
  }
}

export const rolesService = new RolesService();

// Permission categories
export const permissionCategories = {
  "User Management": [
    { id: "user_create", name: "Create Users", description: "Add new users" },
    { id: "user_edit", name: "Edit Users", description: "Modify user profiles" },
    { id: "user_view", name: "View Users", description: "View user profiles" },
    { id: "user_delete", name: "Delete Users", description: "Remove users" }
  ],
  "Content Management": [
    { id: "content_create", name: "Create Content", description: "Create new content" },
    { id: "content_edit", name: "Edit Content", description: "Modify existing content" },
    { id: "content_delete", name: "Delete Content", description: "Remove content" },
    { id: "content_publish", name: "Publish Content", description: "Publish content" }
  ],
  "Course Management": [
    { id: "course_create", name: "Create Courses", description: "Create new courses" },
    { id: "course_edit", name: "Edit Courses", description: "Modify courses" },
    { id: "course_delete", name: "Delete Courses", description: "Remove courses" },
    { id: "course_enroll", name: "Enroll Students", description: "Manage course enrollments" }
  ],
  "Analytics": [
    { id: "analytics_view", name: "View Analytics", description: "Access analytics dashboard" },
    { id: "reports_generate", name: "Generate Reports", description: "Create analytical reports" },
    { id: "data_export", name: "Export Data", description: "Export system data" }
  ],
  "System": [
    { id: "system_settings", name: "Manage Settings", description: "Modify system settings" },
    { id: "role_management", name: "Manage Roles", description: "Create and modify roles" },
    { id: "backup_management", name: "Manage Backups", description: "Handle system backups" }
  ]
};
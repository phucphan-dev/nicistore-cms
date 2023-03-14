export type PermissionData = {
  [x: string]: string[];
};

export type GetAllRolesParams = {
  limit?: number;
  page?: number;
  keyword?: string;
};

export type RoleData = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  displayName: string;
};

export type GetRoleParams = {
  id: number;
};

export type RoleDetailData = {
  role: RoleData;
  assignedPermissions: string[];
};

export type CreateRoleParams = {
  display_name?: string;
  permissions?: string[];
};

export type UpdateRoleParams = {
  id: number;
  display_name?: string;
  permissions?: string[];
};

export type DeleteRoleParams = {
  ids: number[];
};

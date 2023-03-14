export type UserDataType = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type UserDetailDataType = {
  user: UserDataType;
  assignedRoles: number[];
};

export type CreateUserParams = {
  name: string;
  email: string;
  password: string;
  roles: number[];
};

export type UpdateUserParams = {
  id: number;
} & CreateUserParams;

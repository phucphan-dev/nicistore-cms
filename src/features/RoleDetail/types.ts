import { ColumnGroupType, ColumnType } from 'antd/lib/table';

export type RolePermissionTableRow = {
  index?: boolean;
  show?: boolean;
  store?: boolean;
  update?: boolean;
  destroy?: boolean;
  others?: string[];
};

export type RolePermissionProps = {
  module: string;
} & RolePermissionTableRow;

export type RolePermissionColumnForm = {
  [x: string]: RolePermissionTableRow;
};

export type RoleDetailForm = {
  displayName: string;
  permissions: RolePermissionColumnForm;
};

export type RolePermissionColumnType =
(ColumnGroupType<RolePermissionProps> | ColumnType<RolePermissionProps>);

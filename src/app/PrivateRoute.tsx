import React, { FunctionComponent, useMemo } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';

import { useAppSelector } from './store';

import { getAccessToken } from 'common/services/common/storage';
import { RolesRoute } from 'configs/routes';
import NotFound from 'features/NotFound';

type PrivateRouteProps = {
  roles?: RolesRoute;
  component: React.FC<ActiveRoles>;
} & RouteProps;

type RenderPageProps = {
  activeRoles: ActiveRoles;
  component: React.FC<ActiveRoles>;
};

const RenderPage: React.FC<RenderPageProps> = ({ component, activeRoles }) => {
  if (!activeRoles?.roleIndex) {
    return <NotFound />;
  }
  return React.createElement<ActiveRoles>(component as FunctionComponent, activeRoles);
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  path, index, component, roles
}) => {
  const rolesUser = useAppSelector((state) => state.auth.roles);
  const token = getAccessToken();

  const activeRoles: ActiveRoles = useMemo(() => (rolesUser.includes('*') ? ({
    roleIndex: true,
    roleCreate: true,
    roleUpdate: true,
    roleDelete: true,
    roleView: true,
    roleOther: roles?.other || []
  }) : ({
    roleIndex: roles?.index ? rolesUser.includes(roles?.index) : false,
    roleCreate: roles?.create ? rolesUser.includes(roles?.create) : false,
    roleUpdate: roles?.update ? rolesUser.includes(roles?.update) : false,
    roleDelete: roles?.delete ? rolesUser.includes(roles?.delete) : false,
    roleView: roles?.update ? rolesUser.includes(roles?.update) : false,
    roleOther: rolesUser.filter((role) => roles?.other?.includes(role)) || []
  })), [roles, rolesUser]);

  if (!token) {
    return <Navigate to="/login" state={{ from: index ? '/' : path }} replace />;
  }
  return <RenderPage component={component} activeRoles={activeRoles} />;
};

export default PrivateRoute;

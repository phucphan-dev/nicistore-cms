import './App.scss';
import 'common/styles/antd/index.less';
import { Spin } from 'antd';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainModal from './MainModal';
import PrivateRoute from './PrivateRoute';
import { store } from './store';

import Mainlayout from 'common/components/Mainlayout';
import { LayoutProvider } from 'common/components/Mainlayout/context';
import useGlobalError from 'common/hooks/useGlobalError';
import useInitialRender from 'common/hooks/useInitialRender';
import routes from 'configs/routes';
import menuSidebar from 'configs/sidebar';
import ForgotPassword from 'features/ForgotPassword';
import Home from 'features/Home';
import Login from 'features/Login';
import NotFound from 'features/NotFound';
import PreviewData from 'features/PreviewData';

const AppContent: React.FC = () => {
  const isDone = useInitialRender();
  useGlobalError(isDone);
  if (!isDone) {
    return <Spin size="large" className="center" />;
  }
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route element={(
        <LayoutProvider>
          <Mainlayout menus={menuSidebar} />
        </LayoutProvider>
      )}
      >
        <Route index element={<Home />} />
        {routes.map((item) => (
          <Route
            key={`${item.id}`}
            path={item.path}
            element={<PrivateRoute path={item.path} component={item.element} roles={item.roles} />}
          />
        ))}
      </Route>
      <Route path="/preview" element={<PreviewData />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
        <MainModal />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const AppWrapper: React.FC = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppWrapper;

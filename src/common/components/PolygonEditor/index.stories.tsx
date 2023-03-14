import { Story, Meta } from '@storybook/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import PolygonEditor from '.';

import { store } from 'app/store';

export default {
  title: 'Components/templates/PolygonEditor',
  component: PolygonEditor,
  argTypes: {},
} as Meta;

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

export const normal: Story = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PolygonEditor />
    </Provider>
  </QueryClientProvider>
);

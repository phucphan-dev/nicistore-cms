import { Story, Meta } from '@storybook/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { BrowserRouter } from 'react-router-dom';

import ListFilter, { FilterFormTypes } from '.';

import { languageList, samplePage } from 'common/assets/dummyData/system';

export default {
  title: 'Components/templates/ListFilter',
  component: ListFilter,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const method = useForm<FilterFormTypes>({
    defaultValues: {
      isHome: false,
    },
  });

  return (
    <BrowserRouter>
      <ListFilter
        languageList={languageList}
        samplePageList={samplePage}
        method={method}
        // eslint-disable-next-line no-console
        onSubmit={(data) => console.log(data)}
      />
    </BrowserRouter>
  );
};

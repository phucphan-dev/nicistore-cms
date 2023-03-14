/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import PageTable from '.';

import { dataDummy } from 'common/assets/dummyData/page';
import { delay } from 'common/utils/functions';

export default {
  title: 'Components/templates/PageTable',
  component: PageTable,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  const [pageData, setPageData] = useState(dataDummy);
  const [loading, setLoading] = useState(false);
  const onDelete = (data: any[]) => {
    const idData = data.map((v) => v.id);
    setPageData(pageData.filter((v) => !idData.includes(v.id)));
  };

  return (
    <PageTable
      handleDelete={(data) => {
        setLoading(true);
        delay(1000).then(() => {
          onDelete(data);
          setLoading(false);
        });
      }}
      isLoading={loading}
      handleEditPage={(id) => console.log('id visible: ', id)}
      tableProps={{
        columns: [],
        pageData
      }}
    />
  );
};

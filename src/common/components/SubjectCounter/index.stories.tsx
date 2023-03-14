import { Story, Meta } from '@storybook/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import SubjectCounter from '.';

import { numberWithPrefix } from 'common/utils/functions';

export default {
  title: 'Components/molecules/SubjectCounter',
  component: SubjectCounter,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ maxWidth: '180px' }}>
    <Router>
      <SubjectCounter
        title="Pages"
        number={numberWithPrefix(1665, ' ')}
        backgroundColor="#28CB38"
        backgroundColorButton="#12BF24"
        href="https://www.google.com/"
        target="_blank"
      />
    </Router>
  </div>
);

import React from 'react';

import mapModifiers from 'common/utils/functions';

export const iconList = {
  vietnam: 'vietnam',
  english: 'english',
  edit: 'edit',
  filter: 'filter',
  duplicate: 'duplicate',
  next: 'next',
  nextBlue: 'nextBlue',
  desktop: 'desktop',
  tablet: 'tablet',
  mobile: 'mobile',
};

export type IconName = keyof typeof iconList;

export type IconSize = '12' | '13' | '14' | '16' | '18' | '20' | '22' | '24' | '28' | '30' | '32' | '40' | '48' | '60' | '100' | '120' | '80';

type Props = {
  iconName: IconName;
  size?: IconSize;
};

const Icon: React.FC<Props> = ({ iconName, size }) => (
  <i className={mapModifiers('a-icon', iconName, size)} />
);

Icon.defaultProps = {
  size: '24',
};

export default Icon;

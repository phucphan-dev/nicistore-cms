import { CaretDownOutlined } from '@ant-design/icons';
import { Checkbox, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useClickOutside from 'common/hooks/useClickOutside';
import mapModifiers from 'common/utils/functions';

interface FilterTableColumnProps {
  listFilter: {
    label: string;
    key: string;
  }[];
  listSelected?: string[];
  handleFilter?: (key: string) => void;
}

const FilterTableColumn: React.FC<FilterTableColumnProps> = (
  { listFilter, handleFilter, listSelected }
) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const refOption = useRef<HTMLDivElement>(null);

  useClickOutside(refOption, () => open && setOpen(false));

  return (
    <div ref={refOption} className="filterTableColumn">
      <Space onClick={() => setOpen(!open)} className="filterTableColumn_head">
        <Typography.Text>
          {listSelected?.length}
          {' '}
          {t('system.outOf')}
          {' '}
          {listFilter.length}
          {' '}
          {t('system.columnShow')}
        </Typography.Text>
        <CaretDownOutlined style={{ fontSize: 14 }} />
      </Space>
      <div className={mapModifiers('filterTableColumn_options', open && 'open')}>
        {
          listFilter.map((item, index) => (
            <Space className="u-mt-8" key={`filter-column-${index.toString()}`}>
              <Checkbox
                checked={listSelected?.includes(item.key)}
                onChange={() => handleFilter && handleFilter(item.key)}
              />
              <Typography.Text>
                {item.label}
              </Typography.Text>
            </Space>
          ))
        }
      </div>
    </div>
  );
};

export default FilterTableColumn;

import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Select,
  Space,
  Typography,
  Tag,
} from 'antd';
import moment from 'moment';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DropdownElement } from '../DropdownType';

import { contactStatusDummy, statusDummy } from 'common/assets/dummyData/system';
import Icon from 'common/components/Icon';
import Input from 'common/components/Input';
import useClickOutside from 'common/hooks/useClickOutside';
import { AdvancedFilterTypes, AdvancedFilterValueType } from 'common/services/noPermission/types';
import mapModifiers from 'common/utils/functions';

export type FilterValueProps = {
  key: string;
  field: string | number;
  filter: string | number;
  value?: any;
  index?: number;
  type: AdvancedFilterValueType;
};

type FilterItemProps = {
  type: AdvancedFilterValueType;
} & OptionType;

export type FilterDataProps = {
  filters: FilterItemProps[];
} & OptionType;
interface FilterTableProps {
  filterList: FilterDataProps[];
  handleFilter?: (data: FilterValueProps) => void;
}

const FilterTable: React.FC<FilterTableProps> = ({
  filterList, handleFilter
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<FilterDataProps | undefined>(filterList[0]);
  const [filter, setFilter] = useState<FilterItemProps | undefined>(filterList[0].filters[0]);
  const [value, setValue] = useState<any>(undefined);
  const [require, setRequire] = useState(false);

  const filterWith = useMemo(
    () => filterList.find(
      (item) => item.value === field?.value
    )?.filters,
    [field, filterList]
  );

  const handleReset = () => {
    setValue(undefined);
    setField(filterList[0]);
    setFilter(filterList[0].filters[0]);
  };

  const handleChange = () => {
    if (filter?.type !== 'boolean' && !value) {
      setRequire(true);
      return;
    }
    if (handleFilter && field && filter?.value) {
      setRequire(false);
      handleFilter({
        key: `${field.value}[${filter.value}]`,
        field: field.label,
        filter: filter.label,
        value: filter?.type === 'boolean' ? true : value,
        type: filter.type
      });
      handleReset();
      setOpen(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && handleFilter && field && filter?.value && value) {
      handleFilter({
        key: `${field.value}[${filter.value}]`,
        field: field.label,
        filter: filter.label,
        value: filter?.type === 'boolean' ? true : value,
        type: filter.type
      });
      handleReset();
      setOpen(false);
    }
  };

  return (
    <div className="filterTable">
      <Space onClick={() => setOpen(!open)} className="filterTable_head">
        <Icon iconName="filter" />
        <Typography.Text>
          {t('system.filter')}
        </Typography.Text>
      </Space>
      <div className={mapModifiers('filterTable_options', open && 'open')}>
        <Select
          value={field?.value}
          onChange={(v) => {
            setField(filterList.find((item) => item.value === v));
            setFilter(undefined);
          }}
        >
          {
            filterList?.map((val, idx) => (
              <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                {t(val.label)}
              </Select.Option>
            ))
          }
        </Select>
        {field && (
          <div className="u-mt-16">
            <Select
              value={filter?.value}
              onChange={(v) => {
                setFilter(filterWith?.find((item) => item.value === v));
                setValue(undefined);
              }}
            >
              {
                filterWith?.map((val, idx) => (
                  <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                    {t([val.label + val.type, val.label])}
                  </Select.Option>
                ))
              }
            </Select>
          </div>
        )}
        {filter && (
          <div className="u-mt-16">
            {(() => {
              switch (filter.type) {
                case 'string':
                  return (
                    <Input
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => setValue(e.target.value)}
                      onKeyDown={onKeyDown}
                      value={value}
                      error={require ? 'Vui lòng nhập' : undefined}
                    />
                  );
                case 'numeric':
                  return (
                    <Input
                      type="number"
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => setValue(e.target.value)}
                      value={value}
                      error={require ? 'Vui lòng nhập' : undefined}
                    />
                  );
                case 'date':
                  return (
                    <DatePicker
                      style={{ width: '100%' }}
                      showNow={false}
                      showTime={false}
                      placeholder="Chọn"
                      onChange={(date) => date && setValue(moment(date).format('YYYY-MM-DD'))}
                      status={require ? 'error' : undefined}
                    />
                  );
                case 'datetime':
                  return (
                    <DatePicker
                      style={{ width: '100%' }}
                      showNow={false}
                      showTime
                      placeholder="Chọn"
                      onChange={(date) => date && setValue(date.toISOString())}
                      status={require ? 'error' : undefined}
                    />
                  );
                case 'modelStatus':
                  return (
                    <Select
                      size="large"
                      style={{ width: '100%' }}
                      className="u-mt-8"
                      placeholder="---"
                      value={value}
                      onChange={(val) => setValue(val)}
                    >
                      {
                        statusDummy.map((item, index) => (
                          <Select.Option value={item.value} key={`option-${index.toString()}`}>
                            {item.label}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  );
                case 'contactStatus':
                  return (
                    <Select
                      size="large"
                      style={{ width: '100%' }}
                      className="u-mt-8"
                      placeholder="---"
                      value={value}
                      onChange={(val) => setValue(val)}
                    >
                      {
                        contactStatusDummy.map((item, index) => (
                          <Select.Option value={item.value} key={`option-${index.toString()}`}>
                            {item.label}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  );
                case 'newsCategoryId':
                  return (
                    <DropdownElement
                      type="newsCategory"
                      locale="vi"
                      placeholder="---"
                      isGetOption
                      value={value}
                      onChange={(val) => setValue(val)}
                    />
                  );
                case 'faqCategoryId':
                  return (
                    <DropdownElement
                      type="faqCategory"
                      locale="vi"
                      placeholder="---"
                      isGetOption
                      value={value}
                      onChange={(val) => setValue(val)}
                    />
                  );
                default:
                  return null;
              }
            })()}
          </div>
        )}
        <Button onClick={handleChange} type="primary" className="u-mt-16">
          <PlusOutlined />
          {t('system.filter')}
        </Button>
      </div>
    </div>
  );
};

interface FilterTableColumnProps {
  filterList: FilterDataProps[];
  handleFilter?: (data: FilterValueProps) => void;
}

interface FilterTagListProps {
  selectedFilterList?: FilterValueProps[];
  handleDeleteFilter?: (key: string, index?: number) => void;
}

const FiltersDataTable: React.FC<FilterTableColumnProps> = ({
  filterList,
  handleFilter,
}) => {
  const [open, setOpen] = useState(false);

  const refOption = useRef<HTMLDivElement>(null);

  useClickOutside(refOption, () => open && setOpen(false));

  return (
    <div ref={refOption} className="filtersDataTable">
      <FilterTable
        filterList={filterList}
        handleFilter={handleFilter}
      />
    </div>
  );
};

export const RenderTagsListFilter: React.FC<FilterTagListProps> = (
  {
    selectedFilterList, handleDeleteFilter
  }
) => {
  const { t } = useTranslation();

  return (
    <div className="filtersDataTable_tagList">
      {selectedFilterList?.map((item) => (
        <Tag
          className="edit-tag"
          key={item.key + item.index}
          onClose={() => {
            if (handleDeleteFilter) {
              handleDeleteFilter(item.key, item.index);
            }
          }}
          closable
        >
          <span>
            {t(String(item.field))}
            {' '}
            {t([`${item.filter}${item.type}`, String(item.filter)])}
            {' '}
            {(() => {
              switch (item.type) {
                case 'modelStatus':
                  return statusDummy.find((stat) => stat.value === Number(item.value))?.label;
                case 'contactStatus':
                  return contactStatusDummy.find(
                    (stat) => stat.value === Number(item.value)
                  )?.label;
                case 'newsCategoryId':
                case 'faqCategoryId':
                  return item.value.label;
                default:
                  return item.value;
              }
            })()}
          </span>
        </Tag>
      ))}
    </div>
  );
};

export const mappingFilterFields = (
  module: string,
  filterData?: AdvancedFilterTypes,
): FilterDataProps[] => {
  if (!filterData || !filterData[module]) {
    return [];
  }
  const keys = Object.keys(filterData[module]);
  return keys.map((key) => ({
    value: key,
    label: `filterField.${key}`,
    filters: Object.keys(filterData[module][key]).map((type) => ({
      label: `filterWith.${type}`,
      value: type,
      type: filterData[module][key][type].dataType
    }))
  }));
};

type FilterQueryParamsType = { [key: string]: string };

export const mappingParamsFilter = (
  filter: FilterValueProps[]
) => filter.reduce((prev, current) => Object.assign(prev, { [`${current.key}[${current.index}]`]: current.value.value ? current.value.value : current.value }), {});

export const mappingQueryParamsFilter = (data: FilterQueryParamsType): FilterValueProps[] => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  return keys.map((item, index) => {
    const key = item.split('.');
    return ({
      key: `${key[0]}[${key[1]}]`,
      field: `filterField.${key[0]}`,
      filter: `filterWith.${key[1]}`,
      value: key[2] === 'boolean' ? Boolean(values[index]) : values[index],
      index: key[3] ? Number(key[3]) : 0,
      type: key[2] as AdvancedFilterValueType
    });
  });
};

export const mappingFilterToQuery = (data: FilterValueProps[])
  : FilterQueryParamsType => data.reduce((prev: FilterQueryParamsType, current) => {
    const key = `${String(current.field).split('.')[1]}.${String(current.filter).split('.')[1]}.${current.type}${current.index ? `.${current.index}` : ''}`;
    return Object.assign(
      prev,
      { [key]: current.value.value ? current.value.value : current.value }
    );
  }, {});

export default FiltersDataTable;

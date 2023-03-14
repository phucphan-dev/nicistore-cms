import { Select } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import useDebounce from 'common/hooks/useDebounce';
import useScrollInfinite from 'common/hooks/useScrollInfinite';
import getDropdownCodeDataService from 'common/services/noPermission';

export enum DropDownType {
  role = 'role',
  page = 'page',
  newsCategory = 'news-category',
  faqCategory = 'faq-category',
  news = 'news',
  tag = 'tag',
  banner = 'banner',
  form = 'form',
  menu = 'menu',
}

export type DropdownTypeKey = keyof typeof DropDownType;

export type DropdownElementProps = {
  type: DropdownTypeKey;
  locale: string;
  isValueSlug?: boolean;
  placeholder?: string;
  size?: SizeType;
  value: any;
  onChange: (...event: any[]) => void;
  filterParams?: string;
  isGetOption?: boolean;
  hasAllOption?: boolean;
  isShowSearch?: boolean;
  multiple?: {
    allowClear?: boolean;
    defaultValue?: any;
  }
};

export function getDropdownTypeKey(value: string) {
  return Object.entries(DropDownType).find(([, val]) => val === value)?.[0];
}

export const DropdownElement: React.FC<DropdownElementProps> = ({
  type,
  size = 'large',
  locale,
  isValueSlug,
  placeholder,
  isShowSearch,
  value,
  onChange,
  filterParams,
  hasAllOption,
  isGetOption,
  multiple,
}) => {
  const dropdownType = useMemo(() => (DropDownType[type] || ''), [type]);
  const [txtSearch, setTxtSearch] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [options, setOptions] = useState<OptionType[]>([]);

  useDebounce(() => {
    setSearchDebounce(txtSearch);
  }, 500, [txtSearch]);

  const {
    data: dropdownList,
    fetchNextPage,
  } = useInfiniteQuery(
    [`dropdown-${dropdownType}`, { locale, searchDebounce }],
    ({ pageParam = 1 }) => getDropdownCodeDataService({
      locale,
      type: dropdownType,
      filter: {
        keyword: searchDebounce,
        limit: 10,
        page: pageParam,
      }
    }),
    {
      getNextPageParam: (lastPage) => (lastPage.meta.page + 1 <= lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined),
    },
  );

  const { setNode } = useScrollInfinite(() => {
    fetchNextPage();
  });

  useEffect(() => {
    if (dropdownList) {
      const data = dropdownList.pages.reduce((prev: OptionType[], current) => [...prev,
      ...current.data.map((val) => ({
        label: val.text,
        value: isValueSlug ? val.slug : val.id,
      })).filter((val) => ((filterParams ? val.value.toString() !== filterParams : true)
        && (searchDebounce
          ? val.label.toLowerCase().includes(searchDebounce.toLowerCase()) : true)))], []);
      setOptions((hasAllOption && !searchDebounce) ? [{ label: 'Tất cả', value: null }, ...data] : data);
    }
  }, [dropdownList, filterParams, hasAllOption, isValueSlug, searchDebounce]);

  return (
    <Select
      className="u-mt-8"
      size={size}
      style={{ width: '100%' }}
      placeholder={placeholder}
      value={value}
      onChange={(val) => {
        if (isGetOption) {
          onChange(options.find((item) => item.value === val));
        } else {
          onChange(val);
        }
      }}
      {...multiple && {
        mode: 'multiple',
        allowClear: multiple.allowClear,
        defaultValue: multiple.defaultValue,
      }}
      dropdownMatchSelectWidth={false}
      getPopupContainer={(trigger) => trigger.parentElement}
      defaultActiveFirstOption={false}
      showSearch={isShowSearch}
      filterOption={false}
      onSearch={(val) => isShowSearch && setTxtSearch(val)}
    >
      {
        options.map(
          (option, idx) => (idx === options.length - 3 ? (
            <Select.Option label={option.label} value={option.value} key={`option-${type}-${idx.toString()}`}>
              <div ref={(ref) => setNode(ref)}>{option.label}</div>
            </Select.Option>
          ) : (
            <Select.Option label={option.label} value={option.value} key={`option-${type}-${idx.toString()}`}>
              {option.label}
            </Select.Option>
          ))
        )
      }
    </Select>
  );
};

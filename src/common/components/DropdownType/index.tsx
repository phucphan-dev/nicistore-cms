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
  productCategories = 'product-categories',
  colors = 'colors',
  sizes = 'sizes',
  products = 'products',
}

export type DropdownTypeKey = keyof typeof DropDownType;

export type DropdownElementProps = {
  options?: OptionType[];
  name?: string;
  type?: DropdownTypeKey;
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
  },
  error?: string;
};

export function getDropdownTypeKey(value: string) {
  return Object.entries(DropDownType).find(([, val]) => val === value)?.[0];
}

export const DropdownElement: React.FC<DropdownElementProps> = ({
  name,
  type,
  options,
  size,
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
  error,
}) => {
  const dropdownType = useMemo(() => (type ? DropDownType[type] || '' : ''), [type]);
  const [txtSearch, setTxtSearch] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [optionsData, setOptionsData] = useState<OptionType[]>(options || []);

  useDebounce(() => {
    setSearchDebounce(txtSearch);
  }, 500, [txtSearch]);

  const {
    data: dropdownList,
    isLoading,
    fetchNextPage,
  } = useInfiniteQuery(
    [`dropdown-${dropdownType}${name ? `-${name}` : ''}`, { locale, searchDebounce }],
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
      enabled: !!type,
      getNextPageParam: (lastPage) => (lastPage.meta.page + 1 <= lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined),
    },
  );

  const { setNode } = useScrollInfinite(() => {
    if (type) {
      fetchNextPage();
    }
  });

  useEffect(() => {
    if (dropdownList) {
      const data = dropdownList.pages.reduce((prev: OptionType[], current) => [...prev,
      ...current.data.map((val) => ({
        label: val.text,
        value: isValueSlug ? val.slug : val.id,
      })).filter((val) => ((filterParams ? val.value.toString() !== filterParams : true)))], []);
      setOptionsData((hasAllOption && !searchDebounce) ? [{ label: 'Tất cả', value: null }, ...data] : data);
    }
  }, [dropdownList, filterParams, hasAllOption, isValueSlug, searchDebounce]);

  useEffect(() => {
    if (options) {
      setOptionsData(options.filter((
        item
      ) => item.label.toLowerCase().includes(searchDebounce.toLowerCase())));
    }
  }, [options, searchDebounce]);

  return (
    <>
      <Select
        className="u-mt-8"
        size={size}
        style={{ width: '100%' }}
        placeholder={placeholder}
        value={value}
        onChange={(val) => {
          if (isGetOption) {
            onChange(optionsData.find((item) => item.value === val));
          } else {
            onChange(val);
          }
          if (multiple) {
            setTxtSearch('');
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
        onClear={() => setTxtSearch('')}
        allowClear
        loading={isLoading}
      >
        {
          optionsData.map(
            (option, idx) => (idx === optionsData.length - 3 ? (
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
      {error && (
        <span
          className="a-input_errorMessage"
        >
          {error}
        </span>
      )}
    </>
  );
};

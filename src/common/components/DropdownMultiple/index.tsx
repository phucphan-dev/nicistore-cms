import { Select, Tag, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FieldValues, UseControllerReturn, useFormContext
} from 'react-hook-form';
import { useInfiniteQuery } from 'react-query';

import { DropDownType, DropdownTypeKey } from 'common/components/DropdownType';
import useScrollInfinite from 'common/hooks/useScrollInfinite';
import getDropdownCodeDataService from 'common/services/noPermission';

function tagRender(props: {
  label?: string;
  value: any;
  closable?: boolean;
  onClose: (e: React.MouseEvent<HTMLElement, MouseEvent>, idTag?: number) => void;
}) {
  const {
    label, closable, onClose, value
  } = props;

  return (
    <Tag
      closable={closable}
      onClose={(e) => onClose(e, value)}
      className="m-dropdownMultiple_tab"
    >
      <Typography.Text ellipsis>
        {label}
      </Typography.Text>
    </Tag>
  );
}

type DropdownMultipleProps = {
  type: DropdownTypeKey;
  locale: string;
  isValueSlug?: boolean;
  placeholder?: string;
  filterParams?: string;
  isHideValueInSelect?: boolean;
  controller: UseControllerReturn<FieldValues, any>
};

const DropdownMultiple: React.FC<DropdownMultipleProps> = (
  {
    controller,
    locale,
    type,
    filterParams,
    isHideValueInSelect,
    isValueSlug,
    placeholder
  },
) => {
  const [valueSelected, setValueSelected] = useState<number[]>([]);
  const dropdownType = useMemo(() => (DropDownType[type] || ''), [type]);
  const { watch } = useFormContext();
  const dataValues = watch(controller.field.name);

  const {
    data: dropdownMultiple,
    fetchNextPage,
  } = useInfiniteQuery(
    [`dropdown-${dropdownType}`, { locale }],
    ({ pageParam = 1 }) => getDropdownCodeDataService({
      locale,
      type: dropdownType,
      filter: {
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

  const dropdownOptions: OptionType[] = useMemo(() => {
    if (dropdownMultiple) {
      if (filterParams) {
        return dropdownMultiple.pages.reduce((prev: OptionType[], current) => [...prev,
        ...current.data.map((val) => ({
          label: val.text,
          value: isValueSlug ? val.slug : val.id,
        })).filter((val) => val.value.toString() !== filterParams)], []);
      }
      return dropdownMultiple.pages.reduce((prev: OptionType[], current) => [...prev,
      ...current.data.map((val) => ({
        label: val.text,
        value: isValueSlug ? val.slug : val.id,
      }))], []);
    }
    return [];
  }, [dropdownMultiple, filterParams, isValueSlug]);

  useEffect(() => {
    setValueSelected(dataValues);
  }, [dataValues]);

  return (
    <div className="m-dropdownMultiple">
      <Select
        className={`u-mt-8 ${isHideValueInSelect ? 'm-dropdownMultiple-hideValueInSelect' : ''}`}
        size="large"
        style={{ width: '100%' }}
        placeholder={placeholder}
        value={valueSelected}
        onChange={(val) => {
          controller.field.onChange(val);
        }}
        mode="multiple"
        // eslint-disable-next-line react/no-unstable-nested-components
        tagRender={() => <div className="ant-select-selection-placeholder">{placeholder}</div>}
      >
        {
          dropdownOptions.map((option, idx) => (idx === dropdownOptions.length - 3 ? (
            <Select.Option value={option.value} key={`option-${type}-${idx.toString()}`}>
              <div ref={(ref) => setNode(ref)}>{option.label}</div>
            </Select.Option>
          ) : (
            <Select.Option value={option.value} key={`option-${type}-${idx.toString()}`}>
              {option.label}
            </Select.Option>
          )))
        }
      </Select>
      <div className="m-dropdownMultiple_value">
        {
          valueSelected?.map((val) => {
            const itemSelected = dropdownOptions.find((item) => item.value === val);
            return (
              <div key={itemSelected?.value} className="m-dropdownMultiple_wraptab">
                {tagRender({
                  label: itemSelected?.label,
                  value: itemSelected?.value,
                  closable: true,
                  onClose: (_, id) => {
                    controller.field.onChange(valueSelected.filter(
                      (valNumber) => valNumber !== id
                    ));
                  }
                })}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default DropdownMultiple;

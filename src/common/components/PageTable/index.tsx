import {
  CheckOutlined,
  DeleteOutlined, EditOutlined, PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Modal,
  Select,
  Space,
  Spin,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, {
  useMemo, useState
} from 'react';
import { useTranslation } from 'react-i18next';

import FiltersDataTable, { FilterDataProps, FilterValueProps, RenderTagsListFilter } from './filter';
import FilterTableColumn from './filterTableCol';
import SearchInput from './searchInput';

import { useAppSelector } from 'app/store';

export type MenuItemTableTypes = {
  code: string;
  id: number;
  key: string;
  locale: string[];
  title: string;
};
interface PageTableProps<T> {
  isLoading?: boolean;
  noCheckbox?: boolean;
  roles?: ActionRoles;
  tableProps?: {
    initShowColumns?: string[];
    columns?: ColumnsType<T>;
    filterFields?: FilterDataProps[];
    pageData?: T[];
    total?: number;
    pageSize?: number;
    currentPage?: number;
    noBaseCol?: boolean;
    noDeleteLanguage?: boolean;
    isHidePagination?: boolean;
    handleSetCurrentPage?: (page: number) => void;
    handleSetCurrentView?: (view: number) => void;
  }
  filtersDataTable?: {
    handleFilter?: (data: FilterValueProps) => void;
    selectedFilterList?: FilterValueProps[];
    handleDeleteFilter?: (key: string) => void;
  }
  handleDelete?: (data: T[], lang?: string) => void;
  handleEditPage?: (id: number, code: string, language: string) => void;
  handleCreatePage?: (id: number, code: string, language: string) => void;
  handleSearch?: (keyword: string) => void;
  statusDataTable?: {
    handleChangeStatus?: (data: T[], status: number) => void;
    changeStatusLoading?: boolean;
    canChangeStatusApprove?: boolean;
    statusOptions?: OptionType[];
  }
}

const PageTable = <T extends any>({
  isLoading,
  handleDelete,
  handleEditPage,
  handleCreatePage,
  handleSearch,
  tableProps,
  noCheckbox,
  roles,
  filtersDataTable,
  statusDataTable,
}: PageTableProps<T>) => {
  /* Hooks */
  const { t } = useTranslation();
  const { initialData, defaultPageSize } = useAppSelector((state) => state.system);
  const cellAlgnmentObj = { width: '100%', justifyContent: 'center' };

  /* States */
  const [selectedRowsState, setSelectedRowsState] = useState<T[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string[]>(tableProps?.initShowColumns || []);

  const [action, setAction] = useState<string | undefined>(undefined);
  const [statusChange, setStatusChange] = useState<number | undefined>(undefined);

  /* Variables */
  const bulkActions: OptionType[] = [
    {
      label: t('system.delete'),
      value: 'delete',
    },
    ...(statusDataTable?.handleChangeStatus ? [{
      label: t('system.changeStatus'),
      value: 'status',
    }] : []),
  ];

  const statusActions = useMemo(() => {
    if (statusDataTable?.statusOptions) {
      return statusDataTable?.statusOptions;
    }
    return [
      {
        label: t('system.saveDraft'),
        value: 1,
      },
      {
        label: t('system.sendApprove'),
        value: 7,
      },
      ...(statusDataTable?.canChangeStatusApprove ? [{
        label: t('system.saveApproved'),
        value: 13,
      }] : []),
    ];
  }, [statusDataTable, t]);

  /* Functions */
  const handleSelectedColumn = (val: string) => {
    if (!selectedColumn.includes(val)) {
      setSelectedColumn([...selectedColumn, val]);
    } else if (selectedColumn.length > 1) {
      setSelectedColumn(selectedColumn.filter((item) => item !== val));
    }
    if (!selectedColumn.length) {
      setSelectedColumn([val]);
    }
  };

  const dataSource = useMemo(() => (tableProps?.pageData ? tableProps.pageData.map((val: any) => ({
    ...val,
    key: val.id.toString(),
  })) : []), [tableProps?.pageData]);

  const paginationSize = useMemo(() => {
    if (!initialData) {
      return [];
    }
    return initialData.paginationOptions.numbersOfRows.map((option) => option.numbers);
  }, [initialData]);

  const renderButton = (data: any, allowLocale: string, localeItem?: string) => {
    const enableLocale = localeItem ? localeItem.includes(allowLocale) : false;
    return (
      <div>
        {enableLocale ? (
          <Space size={10}>
            <Button
              disabled={!roles?.roleUpdate}
              icon={<EditOutlined />}
              onClick={
                () => handleEditPage && handleEditPage(data.id, data.code, allowLocale)
              }
            />
            {!tableProps?.noDeleteLanguage && (
              <Button
                disabled={!roles?.roleDelete}
                icon={<DeleteOutlined />}
                onClick={() => {
                  Modal.confirm({
                    className: 't-pagetable_deleteLanguageModal',
                    autoFocusButton: 'cancel',
                    okText: t('system.ok'),
                    cancelText: t('system.cancel'),
                    cancelButtonProps: {
                      type: 'primary',
                    },
                    okButtonProps: {
                      type: 'default',
                    },
                    title: t('message.confirmDeleteLanguage'),
                    onOk: () => {
                      if (handleDelete) handleDelete([data], allowLocale);
                    },
                  });
                }}
              />
            )}
          </Space>
        ) : (
          <Button
            disabled={!roles?.roleCreate}
            icon={<PlusOutlined />}
            onClick={
              () => handleCreatePage && handleCreatePage(data.id, data.code, allowLocale)
            }
          />
        )}
      </div>
    );
  };
  const renderColumnLocale: ColumnsType<T> = useMemo(() => {
    if (!initialData) {
      return [];
    }
    return Object.keys(initialData.websiteLocales).map((locale) => ({
      title: locale.toUpperCase(),
      key: locale,
      width: 90,
      align: 'center',
      render: (_name: string, data: any) => (
        <Space direction="horizontal" style={cellAlgnmentObj}>
          {renderButton(data, locale, typeof data.locale === 'string' ? data.locale : Object.keys(data.locale).toString())}
        </Space>
      ),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const baseColumns: ColumnsType<T> = [
    ...renderColumnLocale,
    {
      title: t('system.action'),
      key: 'action',
      width: 90,
      align: 'center',
      render: (_name: string, data: any) => (
        <Button
          disabled={!roles?.roleDelete}
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              className: 't-pagetable_deleteRecordModal',
              autoFocusButton: 'cancel',
              title: t('message.confirmDeleteRecord'),
              okText: t('system.ok'),
              cancelText: t('system.cancel'),
              cancelButtonProps: {
                type: 'primary',
              },
              okButtonProps: {
                type: 'default',
              },
              onOk: () => {
                if (handleDelete) handleDelete([data], 'all');
              },
            });
          }}
        />
      ),
    },
  ];
  const columns: ColumnsType<T> = tableProps?.noBaseCol
    ? (tableProps?.columns || []) : [...(tableProps?.columns || []), ...baseColumns];

  const columnSelected = columns.filter((item) => selectedColumn.includes(item.key as string));

  /**
   * RowSelection object indicates the need for row selection
   */
  const rowSelection: TableRowSelection<T> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: T[]) => {
      setSelectedRowsState(selectedRows);
      setSelectedRowKeys(newSelectedRowKeys);
    },
    fixed: 'left',
  };

  /**
   * Delete External button
   */
  const onDeleteAll = () => {
    Modal.confirm({
      title: selectedRowsState.length === dataSource.length
        ? t('message.confirmDeleteAll') : t('message.confirmDeleteRecord'),
      onOk: () => {
        if (handleDelete) {
          handleDelete(selectedRowsState, 'allRow');
          setSelectedRowsState([]);
          setSelectedRowKeys([]);
        }
      },
    });
  };
  const changeStatus = (status: number) => {
    Modal.confirm({
      title: t('message.confirmChangeAllStatus'),
      onOk: () => {
        if (statusDataTable?.handleChangeStatus) {
          statusDataTable.handleChangeStatus(selectedRowsState, status);
          setSelectedRowsState([]);
          setSelectedRowKeys([]);
        }
      },
    });
  };

  return (
    <div className="t-pagetable u-mt-20">
      <div className="t-pagetable_head">
        {handleSearch && (
          <Space style={{ flexGrow: 1, alignItems: 'flex-start' }}>
            <SearchInput
              handleSearch={handleSearch}
            />
            {tableProps?.filterFields && tableProps?.filterFields.length > 0 && (
              <FiltersDataTable
                filterList={tableProps?.filterFields || []}
                handleFilter={filtersDataTable?.handleFilter}
              />
            )}
            {!noCheckbox && (
              <Select
                size="middle"
                style={{ width: '140px' }}
                placeholder={t('system.actions')}
                onChange={(val) => setAction(val)}
                value={action}
              >
                {
                  bulkActions.map((val, idx) => (
                    <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                      {val.label}
                    </Select.Option>
                  ))
                }
              </Select>
            )}
            {action === 'status' && (
              <Select
                size="middle"
                style={{ width: '130px' }}
                placeholder={`${t('system.select')} ${t('system.status')}`}
                onChange={(val) => setStatusChange(val)}
                value={statusChange}
              >
                {
                  statusActions.map((val, idx) => (
                    <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                      {val.label}
                    </Select.Option>
                  ))
                }
              </Select>
            )}
            {action && (
              <Button
                icon={<CheckOutlined />}
                type="primary"
                size="middle"
                loading={statusDataTable?.changeStatusLoading}
                disabled={!selectedRowKeys.length}
                onClick={() => {
                  if (action === 'delete') {
                    onDeleteAll();
                  }
                  if (action === 'status' && statusChange) {
                    changeStatus(statusChange);
                  }
                }}
              >
                {t('system.apply')}
              </Button>
            )}
            {filtersDataTable?.selectedFilterList
              && filtersDataTable?.selectedFilterList.length > 0
              && (
                <RenderTagsListFilter
                  handleDeleteFilter={filtersDataTable.handleDeleteFilter}
                  selectedFilterList={filtersDataTable.selectedFilterList}
                />
              )}
          </Space>
        )}
        <FilterTableColumn
          listFilter={(tableProps?.columns || []).map((item) => (
            { label: item.title as string, key: item.key as string }))}
          listSelected={selectedColumn}
          handleFilter={handleSelectedColumn}
        />
      </div>
      <div className="t-pagetable_wrap u-mt-20">
        <Spin tip={t('system.loading')} spinning={isLoading}>
          <Table
            rowSelection={noCheckbox || !roles?.roleDelete
              ? undefined : rowSelection as TableRowSelection<T>}
            size="small"
            dataSource={dataSource}
            showSorterTooltip={false}
            columns={tableProps?.noBaseCol ? columnSelected : [...columnSelected, ...baseColumns]}
            pagination={{
              pageSize: tableProps?.pageSize,
              pageSizeOptions: paginationSize,
              defaultPageSize,
              showSizeChanger: true,
              onChange: (page) => {
                if (tableProps?.handleSetCurrentPage) {
                  tableProps.handleSetCurrentPage(page);
                }
              },
              onShowSizeChange: (_, size) => {
                if (tableProps?.handleSetCurrentView) {
                  tableProps.handleSetCurrentView(size);
                }
              },
              total: tableProps?.total,
              current: tableProps?.currentPage,
              hideOnSinglePage: tableProps?.isHidePagination,
            }}
            scroll={{ x: 986 }}
          />
        </Spin>
      </div>
    </div>
  );
};

export default PageTable;

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, message, Modal, Space, Typography
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import {
  FilterDataProps, FilterValueProps, mappingFilterFields,
  mappingFilterToQuery,
  mappingParamsFilter, mappingQueryParamsFilter
} from 'common/components/PageTable/filter';
import { deleteStaticBlockService, getAllStaticBlockService } from 'common/services/staticBlock';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';

type StaticBlockDataTypes = {
  id: number;
  name: string;
  template: string;
  updatedAt: string;
};

const StaticBlockManagement: React.FC<ActiveRoles> = ({
  roleCreate, roleDelete, roleView, roleUpdate
}) => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  /* Selectors */
  const {
    defaultPageSize, defaultWebsiteLanguage, advancedFilter
  } = useAppSelector((state) => state.system);

  /* States */
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(defaultPageSize);
  const [keyword, setKeyword] = useState('');
  const [selectedFilterList, setSelectedFilterList] = useState<
    FilterValueProps[]>(mappingQueryParamsFilter(params));

  const returnParamsFilter = useMemo(
    () => mappingParamsFilter(selectedFilterList),
    [selectedFilterList]
  );

  /* Queries */
  const { data: staticBlocks, isLoading } = useQuery(
    ['getAllStaticBlock', keyword, currentPage, currentView, selectedFilterList],
    () => getAllStaticBlockService({
      keyword, page: currentPage, limit: currentView, ...returnParamsFilter
    }),
  );

  const { mutate: deleteStaticBlockMutate, isLoading: deleteStaticBlockLoading } = useMutation(
    ['staticBlockDelete'],
    async (ids: number[]) => deleteStaticBlockService(ids),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(['getAllStaticBlock']);
      },
      onError: () => {
        message.error(t('message.deleteError'));
      }
    }
  );

  /* Variables */
  const columns: ColumnsType<StaticBlockDataTypes> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: StaticBlockDataTypes, b: StaticBlockDataTypes) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: StaticBlockDataTypes) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Tên
    {
      title: t('system.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (
          a: StaticBlockDataTypes,
          b: StaticBlockDataTypes
        ) => a.name.localeCompare(b.name)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: StaticBlockDataTypes) => (
        <Typography.Text
          onClick={() => roleView && navigate(`${ROUTE_PATHS.STATIC_BLOCK_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {data.name}
        </Typography.Text>
      ),
    },
    {
      title: t('system.sample'),
      dataIndex: 'template',
      key: 'template',
      sorter: {
        compare: (
          a: StaticBlockDataTypes,
          b: StaticBlockDataTypes
        ) => a.template.localeCompare(b.template)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: StaticBlockDataTypes) => (
        <Typography.Text>
          {data.template}
        </Typography.Text>
      ),
    },
    {
      title: t('system.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: {
        compare: (a: StaticBlockDataTypes, b: StaticBlockDataTypes) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: StaticBlockDataTypes) => (
        <Typography.Text>
          {formatDateTime(data.updatedAt)}
        </Typography.Text>
      ),
    },
    {
      title: t('system.action'),
      key: 'action',
      width: 100,
      align: 'center',
      render: (_name: string, data: StaticBlockDataTypes) => (
        <Space>
          <Button
            disabled={!roleView}
            icon={<EditOutlined />}
            onClick={() => navigate(`${ROUTE_PATHS.STATIC_BLOCK_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
          />
          <Button
            disabled={!roleDelete}
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
                  deleteStaticBlockMutate([data.id]);
                },
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const filterFields: FilterDataProps[] = useMemo(
    () => mappingFilterFields('staticBlocks', advancedFilter),
    [advancedFilter]
  );

  const staticBlockData = useMemo(() => (staticBlocks?.data?.map((val) => ({
    id: val.staticBlockData.id,
    name: val.staticBlockData.name,
    template: val.template.name,
    updatedAt: val.staticBlockData.updatedAt,
  })) || []), [staticBlocks]);

  /* Functions */
  const onDelete = async (data: StaticBlockDataTypes[], code?: string) => {
    switch (code) {
      case 'allRow':
      case 'all': {
        deleteStaticBlockMutate(data.map((item) => item.id));
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetCurrentView = (view: number) => {
    setCurrentView(view);
  };

  const handleFilter = (data: FilterValueProps) => {
    const typeFilter = String(data.filter).split('.')[1];
    if ((typeFilter === 'isNull' || typeFilter === 'isNotNull') && selectedFilterList.find((item) => item.key === data.key)) {
      return;
    }
    const counter = selectedFilterList.filter(
      (item) => item.field === data.field && item.filter === data.filter
    ).length;
    setSelectedFilterList([...selectedFilterList, { ...data, index: counter }]);
  };

  const handleDeleteFilter = (key: string, index?: number) => {
    const tempList = selectedFilterList.slice();
    setSelectedFilterList(tempList.filter((item) => !(item.key === key && item.index === index)));
  };

  useEffect(() => {
    setSearchParams(mappingFilterToQuery(selectedFilterList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilterList]);

  /* Render */
  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.staticBlocks')}
        rightHeader={(
          <Button type="primary" disabled={!roleCreate} onClick={() => navigate(`${ROUTE_PATHS.STATIC_BLOCK_DETAIL}?locale=${defaultWebsiteLanguage}`)}>
            <PlusOutlined />
            {t('system.create')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleDelete={onDelete}
          handleSearch={setKeyword}
          isLoading={isLoading || deleteStaticBlockLoading}
          roles={{
            roleCreate,
            roleDelete,
            roleUpdate
          }}
          tableProps={{
            initShowColumns: ['id', 'name', 'template', 'action'],
            columns,
            pageData: staticBlockData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: staticBlockData.length,
            filterFields,
            noDeleteLanguage: true,
            noBaseCol: true
          }}
          filtersDataTable={{
            handleFilter,
            selectedFilterList,
            handleDeleteFilter,
          }}
        />
      </div>
    </>
  );
};

export default StaticBlockManagement;

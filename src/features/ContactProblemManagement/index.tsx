import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Typography } from 'antd';
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
  mappingFilterToQuery, mappingParamsFilter, mappingQueryParamsFilter
} from 'common/components/PageTable/filter';
import StatusLabel from 'common/components/StatusLabel';
import {
  changeStatusContactProblemManyIdService,
  deleteContactProblemService,
  deleteContactProblemTranslationService,
  getAllContactProblemService,
} from 'common/services/contact';
import { ContactProblemDataType } from 'common/services/contact/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';
import roles, { getPermission } from 'configs/roles';

export type TableDataTypes = {
  id: number;
  name: string;
  status: number;
  updatedAt: string;
  locale: ContactProblemDataType['translations'];
};

const ContactProblemManagement: React.FC<ActiveRoles> = ({
  roleCreate, roleDelete, roleIndex, roleUpdate
}) => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  /* Selectors */
  const {
    defaultPageSize,
    defaultWebsiteLanguage,
    advancedFilter
  } = useAppSelector((state) => state.system);
  const rolesUser = useAppSelector((state) => state.auth.roles);

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
  const queryKey = ['contactProblem-list', keyword, currentPage, currentView, selectedFilterList];

  /* Queries */
  const { data: listRes, isLoading } = useQuery(
    queryKey,
    () => getAllContactProblemService({
      keyword, page: currentPage, limit: currentView, ...returnParamsFilter
    }),
    { keepPreviousData: true }
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['contactProblem-delete'],
    async (ids: number[]) => deleteContactProblemService({ ids }),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(queryKey);
      },
      onError: () => {
        message.error(t('message.deleteError'));
      }

    }
  );

  const { mutate: changeStatusMutate, isLoading: changeStatusLoading } = useMutation(
    ['contactProblem-changeStatusManyId'],
    async (data:
      {
        ids: number[], status: number
      }) => changeStatusContactProblemManyIdService(data.ids, data.status),
    {
      onSuccess: () => {
        message.success(t('message.updateStatusSuccess'));
        queryClient.invalidateQueries(queryKey);
      },
      onError: () => {
        message.error(t('message.updateStatusError'));
      }
    }
  );

  const {
    mutate: deletePageTranslationMutate,
    isLoading: deletePageTranslationLoading
  } = useMutation(
    ['contactProblem-translation-delete'],
    async (ids: number[]) => deleteContactProblemTranslationService({ ids }),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(queryKey);
      },
      onError: () => {
        message.error(t('message.deleteError'));
      }

    }
  );

  /* Datas */
  const tableData: TableDataTypes[] = useMemo(() => (
    listRes?.data.map((val) => ({
      id: val.contactProblemData.id,
      name: val.translations.vi?.name || val.translations.en?.name || '',
      status: val.contactProblemData.status,
      updatedAt: val.contactProblemData.updatedAt,
      locale: Object.fromEntries(
        Object
          .entries(val.translations)
          .map(([k, o]) => [k, { ...o, id: val.contactProblemData.id }])
      )
    })) || []), [listRes]);

  /* Variables */
  const columns: ColumnsType<TableDataTypes> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: TableDataTypes, b: TableDataTypes) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: TableDataTypes) => (
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
        compare: (a: TableDataTypes, b: TableDataTypes) => a.name.localeCompare(b.name)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: TableDataTypes) => (
        <Typography.Text
          onClick={() => roleIndex && navigate(`${ROUTE_PATHS.CONTACT_PROBLEM_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {data.name}
        </Typography.Text>
      ),
    },
    // --- Trạng thái
    {
      title: t('system.status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_name: string, data: TableDataTypes) => (
        <StatusLabel status={data.status} />
      ),
    },
    // --- Cập nhật lúc
    {
      title: t('system.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: {
        compare: (a: TableDataTypes, b: TableDataTypes) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: any) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {formatDateTime(data.updatedAt)}
        </Typography.Text>
      ),
    },
  ];

  const filterFields: FilterDataProps[] = useMemo(
    () => mappingFilterFields('contactProblem', advancedFilter),
    [advancedFilter]
  );

  /* Functions */
  const onDelete = async (data: TableDataTypes[], code?: string) => {
    switch (code) {
      case 'allRow':
      case 'all': {
        deleteMutate(data.map((item) => item.id));
        break;
      }
      default: {
        if (code) {
          const localeId = data?.[0].locale[code]?.id;
          if (localeId) {
            deletePageTranslationMutate([localeId]);
          }
        }
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
        title={t('sidebar.contactProblem')}
        rightHeader={(
          <Button type="primary" disabled={!roleCreate} onClick={() => navigate(`${ROUTE_PATHS.CONTACT_PROBLEM_DETAIL}?locale=${defaultWebsiteLanguage}`)}>
            <PlusOutlined />
            {t('system.create')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleDelete={onDelete}
          handleSearch={setKeyword}
          isLoading={isLoading || deleteLoading || deletePageTranslationLoading}
          handleEditPage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.CONTACT_PROBLEM_DETAIL}?id=${id}&locale=${locale}`);
          }}
          handleCreatePage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.CONTACT_PROBLEM_DETAIL}?id=${id}&locale=${locale}`);
          }}
          roles={{
            roleCreate,
            roleDelete,
            roleUpdate
          }}
          tableProps={{
            initShowColumns: ['id', 'name', 'status'],
            columns,
            pageData: tableData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: listRes?.meta.total || 1,
            filterFields,
          }}
          filtersDataTable={{
            handleFilter,
            selectedFilterList,
            handleDeleteFilter,
          }}
          statusDataTable={{
            handleChangeStatus:
              (data, status) => changeStatusMutate({ ids: data.map((item) => item.id), status }),
            changeStatusLoading,
            canChangeStatusApprove: getPermission(rolesUser, roles.CONTACT_PROBLEM_APPROVED),
          }}
        />
      </div>
    </>
  );
};

export default ContactProblemManagement;

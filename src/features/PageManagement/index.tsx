import { HomeTwoTone, PlusOutlined } from '@ant-design/icons';
import {
  Button, message, Space, Typography
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, {
  useEffect, useMemo, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import {
  FilterDataProps, FilterValueProps,
  mappingFilterFields, mappingFilterToQuery, mappingParamsFilter, mappingQueryParamsFilter
} from 'common/components/PageTable/filter';
import StatusLabel from 'common/components/StatusLabel';
import useNavigateParams from 'common/hooks/useNavigateParams';
import {
  changeStatusManyIdService,
  deletePagesService, deletePageTranslationService, getAllPagesService,
} from 'common/services/pages';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';
import roles, { getPermission } from 'configs/roles';

type PageProps = {
  id: number;
  title: string;
  sample: string;
  status: number;
  updatedAt: string;
  locale: {
    [locale: string]: {
      id: number;
      title: string;
      slug: string;
    };
  };
  isHome?: boolean;
};

const PageManagement: React.FC<ActiveRoles> = ({
  roleCreate, roleView, roleDelete, roleUpdate
}) => {
  /* Hook */
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const navigateParams = useNavigateParams();

  /* Selector */
  const {
    defaultPageSize,
    defaultWebsiteLanguage, advancedFilter
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
  /* Queries */
  const {
    isLoading,
    data: pageData,
  } = useQuery(
    ['pages', currentPage, keyword, currentView, selectedFilterList],
    () => getAllPagesService({
      keyword, page: currentPage, limit: currentView, ...returnParamsFilter
    }),
  );

  const { mutate: deletePageMutate, isLoading: deletePageLoading } = useMutation(
    ['page-delete'],
    async (ids: number[]) => deletePagesService(ids),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(['pages', currentPage, keyword, currentView, selectedFilterList]);
      },
      onError: () => {
        message.error(t('message.deleteError'));
      }
    }
  );

  const { mutate: changeStatusMutate, isLoading: changeStatusLoading } = useMutation(
    ['changeStatusManyId'],
    async (data:
      { ids: number[], status: number }) => changeStatusManyIdService(data.ids, data.status),
    {
      onSuccess: () => {
        message.success(t('message.updateStatusSuccess'));
        queryClient.invalidateQueries(['pages', currentPage, keyword, currentView, selectedFilterList]);
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
    ['page-translation-delete'],
    async (ids: number[]) => deletePageTranslationService(ids),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(['pages', currentPage, keyword, currentView, selectedFilterList]);
      },
      onError: () => {
        message.error(t('message.deleteError'));
      }

    }
  );

  /* Variables */
  const columns: ColumnsType<PageProps> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: PageProps, b: PageProps) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: PageProps) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    {
      title: t('system.title'),
      dataIndex: 'title',
      key: 'title',
      sorter: {
        compare: (a: PageProps, b: PageProps) => a.title.localeCompare(b.title),
      },
      sortDirections: ['descend', 'ascend'],
      render: (name: string, data: PageProps) => (
        <Space>
          <Typography.Text
            onClick={() => roleView && navigate(`${ROUTE_PATHS.PAGE_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
            style={{ color: '#4a4a4a', cursor: 'pointer' }}
          >
            {name}
          </Typography.Text>
          {data.isHome && <HomeTwoTone twoToneColor="#8DC63F" />}
        </Space>
      ),
    },
    {
      title: t('system.sample'),
      dataIndex: 'sample',
      key: 'sample',
    },
    {
      title: t('system.status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_name: string, data: PageProps) => (
        <StatusLabel status={data.status} />
      ),
    },
    {
      title: t('system.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: {
        compare: (a: PageProps, b: PageProps) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: PageProps) => (
        <Typography.Text>
          {formatDateTime(data.updatedAt)}
        </Typography.Text>
      ),
    },
  ];

  const tableData: PageProps[] = useMemo(() => (pageData?.data ? pageData?.data.map((item) => ({
    id: item.pageData.id,
    title: item.translations.vi?.title || item.translations.en?.title || '',
    sample: item.template?.name,
    status: item.pageData?.status,
    updatedAt: item.pageData?.updatedAt,
    isHome: item.pageData.isHome,
    locale: Object.fromEntries(
      Object
        .entries(item.translations)
        .map(([k, o]) => [k, { ...o, id: item.translations[k].id, }])
    )
  })) : []), [pageData]);

  const filterFields: FilterDataProps[] = useMemo(
    () => mappingFilterFields('page', advancedFilter),
    [advancedFilter]
  );

  /* Functions */
  const onDelete = async (data: PageProps[], code?: string) => {
    switch (code) {
      case 'allRow':
      case 'all': {
        deletePageMutate(data.map((item) => item.id));
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

  const handleSearch = (val: string) => {
    setKeyword(val);
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
        title={t('sidebar.page')}
        rightHeader={(
          <Button
            type="primary"
            disabled={!roleCreate}
            onClick={() => navigate(`${ROUTE_PATHS.PAGE_DETAIL}?locale=${defaultWebsiteLanguage}`)}
          >
            <PlusOutlined />
            {t('system.create')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleDelete={(data, lang) => onDelete(data, lang)}
          isLoading={isLoading || deletePageLoading || deletePageTranslationLoading}
          handleEditPage={(id, _, language) => navigateParams(`${ROUTE_PATHS.PAGE_DETAIL}`, `id=${id}&locale=${language}`)}
          handleCreatePage={(id, _, language) => navigateParams(`${ROUTE_PATHS.PAGE_DETAIL}`, `id=${id}&locale=${language}`)}
          handleSearch={handleSearch}
          roles={{ roleCreate, roleDelete, roleUpdate }}
          filtersDataTable={{
            handleFilter,
            selectedFilterList,
            handleDeleteFilter,
          }}
          tableProps={{
            columns,
            initShowColumns: ['id', 'title', 'sample', 'status'],
            pageData: tableData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: pageData?.meta.total,
            filterFields,
          }}
          statusDataTable={{
            handleChangeStatus:
              (data, status) => changeStatusMutate({ ids: data.map((item) => item.id), status }),
            changeStatusLoading,
            canChangeStatusApprove: getPermission(rolesUser, roles.PAGE_APPROVED),
          }}
        />
      </div>
    </>
  );
};

export default PageManagement;

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
import { changeStatusFaqManyIdService, deleteFaqService, getAllFaqsService } from 'common/services/faqs';
import { FaqTypes } from 'common/services/faqs/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';
import roles, { getPermission } from 'configs/roles';

export type NewsDataTypes = {
  id: number;
  title: string;
  category?: number[];
  publishedAt: string;
  status: number;
  locale: FaqTypes['translations'];
};

const convertNewsData = (data: FaqTypes[]): NewsDataTypes[] => {
  if (!data.length) return [];
  return data.map((val) => ({
    id: val.faqData.id,
    title: val.translations.vi ? val.translations.vi.question : val.translations.en.question,
    status: val.faqData.status,
    publishedAt: val.faqData.createdAt,
    locale: Object.fromEntries(
      Object
        .entries(val.translations)
        .map(([k, o]) => [k, { ...o, id: val.faqData.id }])
    )
  }));
};

const FaqManagement: React.FC<ActiveRoles> = ({
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
    defaultPageSize, defaultWebsiteLanguage,
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
  const queryKey = ['faq-get', keyword, currentPage, currentView, selectedFilterList];

  /* Queries */
  const { data: news, isLoading } = useQuery(
    queryKey,
    () => getAllFaqsService({
      keyword, page: currentPage, limit: currentView, ...returnParamsFilter
    }),
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['faq-delete'],
    async (ids: number[]) => deleteFaqService({ ids }),
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
    ['changeStatusFaqManyId'],
    async (data:
      { ids: number[], status: number }) => changeStatusFaqManyIdService(data.ids, data.status),
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

  /* Datas */
  const newsData = useMemo(() => {
    if (news) {
      return convertNewsData(news.data);
    }
    return [];
  }, [news]);

  /* Variables */
  const columns: ColumnsType<NewsDataTypes> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: NewsDataTypes, b: NewsDataTypes) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: NewsDataTypes) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Tiêu đề
    {
      title: t('system.title'),
      dataIndex: 'title',
      key: 'title',
      sorter: {
        compare: (a: NewsDataTypes, b: NewsDataTypes) => a.title.localeCompare(b.title)
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: any) => (
        <Typography.Text
          onClick={() => roleView && navigate(`${ROUTE_PATHS.FAQ_DETAIL}?id=${data.id}&locale=${defaultWebsiteLanguage}`)}
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {data.title}
        </Typography.Text>
      ),
    },
    {
      title: t('system.status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_name: string, data: NewsDataTypes) => (
        <StatusLabel status={data.status} />
      ),
    },
    {
      title: t('system.publishedAt'),
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      sorter: {
        compare: (a: NewsDataTypes, b: NewsDataTypes) => {
          const aDate = new Date(a.publishedAt);
          const bDate = new Date(b.publishedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_: string, data: any) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {formatDateTime(data.publishedAt)}
        </Typography.Text>
      ),
    },
  ];

  const filterFields: FilterDataProps[] = useMemo(
    () => mappingFilterFields('faq', advancedFilter),
    [advancedFilter]
  );

  /* Functions */
  const onDelete = async (data: NewsDataTypes[], lang?: string) => {
    if (lang === 'all' || lang === 'allRow') {
      deleteMutate(data.map((val) => val.id));
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
        title={t('sidebar.faqs')}
        rightHeader={(
          <Button type="primary" disabled={!roleCreate} onClick={() => navigate(`${ROUTE_PATHS.FAQ_DETAIL}?locale=${defaultWebsiteLanguage}`)}>
            <PlusOutlined />
            {t('system.create')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleDelete={onDelete}
          handleSearch={setKeyword}
          isLoading={isLoading || deleteLoading}
          handleEditPage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.FAQ_DETAIL}?id=${id}&locale=${locale}`);
          }}
          handleCreatePage={(id, _, locale) => {
            navigate(`${ROUTE_PATHS.FAQ_DETAIL}?id=${id}&locale=${locale}`);
          }}
          roles={{
            roleCreate,
            roleDelete,
            roleUpdate
          }}
          tableProps={{
            initShowColumns: ['id', 'title', 'status'],
            columns,
            pageData: newsData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: news?.meta.total || 1,
            noDeleteLanguage: true,
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
            canChangeStatusApprove: getPermission(rolesUser, roles.FAQ_APPROVED),
          }}
        />
      </div>
    </>
  );
};

export default FaqManagement;

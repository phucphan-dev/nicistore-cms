import { EyeOutlined } from '@ant-design/icons';
import {
  Button,
  Typography
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import useNavigateParams from 'common/hooks/useNavigateParams';
import { getAllActivityLogsService } from 'common/services/activityLogs';
import { formatDateTime } from 'common/utils/functions';
import { ActivityModelType, handleActivityLink } from 'configs/activityLink';

type ActivityLogsProps = {
  id: number;
  username: string;
  module: string;
  action: string;
  description: string;
  createdAt: string;
  modelId?: number;
  modelName?: string;
};

const ActivityLogsManagement: React.FC<ActiveRoles> = () => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();

  /* Selectors */
  const { defaultPageSize } = useAppSelector((state) => state.system);

  /* States */
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(defaultPageSize);
  const [keyword, setKeyword] = useState('');

  /* React-query */
  const {
    isLoading: listLoading,
    data: listData,
  } = useQuery(
    ['activityLogsManagement-list', currentPage, keyword, currentView],
    () => getAllActivityLogsService({ page: currentPage, keyword, limit: currentView }),
    { keepPreviousData: true }
  );

  /* Functions */
  const handleSearch = (val: string) => {
    setKeyword(val);
  };

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetCurrentView = (view: number) => {
    setCurrentView(view);
  };

  /* Datas */
  const columns: ColumnsType<ActivityLogsProps> = useMemo(() => ([
    // --- STT
    {
      title: 'ID',
      key: 'id',
      width: 75,
      align: 'center',
      render: (_name: string, data: ActivityLogsProps) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Tên người dùng
    {
      title: t('system.username'),
      dataIndex: 'username',
      key: 'username',
    },
    // --- Module
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
    },
    // --- Hành động
    {
      title: t('system.action'),
      dataIndex: 'action',
      key: 'action',
    },
    // --- Mô tả
    {
      title: t('system.description'),
      dataIndex: 'description',
      key: 'description',
    },
    // --- Cập nhật
    {
      title: t('system.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: {
        compare: (a: ActivityLogsProps, b: ActivityLogsProps) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: ActivityLogsProps) => (
        <Typography.Text>
          {formatDateTime(data.createdAt)}
        </Typography.Text>
      ),
    },
    // --- Xem
    {
      title: t('system.see'),
      key: 'action',
      width: 100,
      align: 'center',
      render: (_name: string, _data: ActivityLogsProps) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            const { url, params } = handleActivityLink(
              _data.modelName as ActivityModelType,
              _data.modelId,
              _data.action,
            );
            if (params) {
              navigateParams(url, params);
            } else {
              navigate(url);
            }
          }}
        />
      ),
    },
  ]), [t, navigateParams, navigate]);

  const tableData: ActivityLogsProps[] = useMemo(() => (
    listData?.data?.map((item) => ({
      id: item.id,
      username: item.user.name,
      module: item.modelName || '',
      action: item.actionName,
      description: `${item.user.name} ${t(`activityLog.${item.actionName}`)} ${item.modelData?.title || ''}`,
      createdAt: item.createdAt,
      modelId: item.modelId,
      modelName: item.modelName,
    })) || []), [listData, t]);

  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.activityLogs')}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          isLoading={listLoading}
          handleSearch={handleSearch}
          noCheckbox
          tableProps={{
            initShowColumns: ['id', 'username', 'module', 'action', 'description'],
            columns,
            pageData: tableData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: listData?.meta.total || 1,
            noBaseCol: true,
            noDeleteLanguage: true,
          }}
        />
      </div>
    </>
  );
};

export default ActivityLogsManagement;

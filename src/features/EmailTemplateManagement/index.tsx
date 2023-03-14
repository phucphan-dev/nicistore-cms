import { EditOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import { getAllEmailTemplatesService } from 'common/services/emailTemplates';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';

export type TableDataTypes = {
  id: number;
  name: string;
  updatedAt: string;
};

const EmailTemplateManagement: React.FC<ActiveRoles> = ({
  roleIndex, roleUpdate
}) => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();

  /* Selectors */
  const {
    defaultPageSize,
  } = useAppSelector((state) => state.system);

  /* States */
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(defaultPageSize);
  const [keyword, setKeyword] = useState('');

  const queryKey = ['emailTemplate-list', keyword, currentPage, currentView];

  /* Queries */
  const { data: listRes, isLoading } = useQuery(
    queryKey,
    () => getAllEmailTemplatesService({
      keyword, page: currentPage, limit: currentView,
    }),
    { keepPreviousData: true }
  );

  /* Datas */
  const tableData: TableDataTypes[] = useMemo(() => (
    listRes?.data?.map((val) => ({
      id: val.id,
      name: val.name,
      updatedAt: val.updatedAt,
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
          onClick={() => roleIndex && navigate(`${ROUTE_PATHS.EMAIL_TEMPLATE_DETAIL}?id=${data.id}`)}
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {data.name}
        </Typography.Text>
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
    // --- Thao tác
    {
      title: t('system.action'),
      key: 'action',
      width: 100,
      align: 'center',
      render: (_name: string, _data: TableDataTypes) => (
        <Space>
          <Button
            disabled={!roleUpdate}
            icon={<EditOutlined />}
            onClick={() => roleIndex && navigate(`${ROUTE_PATHS.EMAIL_TEMPLATE_DETAIL}?id=${_data.id}`)}
          />
        </Space>
      ),
    },
  ];

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetCurrentView = (view: number) => {
    setCurrentView(view);
  };

  /* Render */
  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.emailTemplate')}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          noCheckbox
          handleSearch={setKeyword}
          isLoading={isLoading}
          roles={{
            roleCreate: false,
            roleDelete: false,
            roleUpdate
          }}
          tableProps={{
            initShowColumns: ['id', 'name', 'action'],
            columns,
            pageData: tableData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: listRes?.meta.total || 1,
            noBaseCol: true,
            noDeleteLanguage: true,
          }}
        />
      </div>
    </>
  );
};

export default EmailTemplateManagement;

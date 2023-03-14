/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DeleteOutlined, EditOutlined, PlusOutlined,
} from '@ant-design/icons';
import {
  Button, message, Modal, Space, Typography
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import useNavigateParams from 'common/hooks/useNavigateParams';
import {
  deleteFormManagementService,
  getAllFormManagementService,
} from 'common/services/forms';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';

type FormProps = {
  id: number;
  code: string;
  name: string;
  updatedAt: string;
};

const FormManagement: React.FC<ActiveRoles> = ({
  roleDelete, roleCreate, roleUpdate
}) => {
  /* Hook */
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();

  /* Store */
  const rolesUser = useAppSelector((state) => state.auth.roles);
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
    ['formManagement-list', currentPage, keyword, currentView],
    () => getAllFormManagementService({ keyword, page: currentPage, limit: currentView }),
    { keepPreviousData: true }
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['formManagement-delete'],
    async (ids: number[]) => deleteFormManagementService({ ids }),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(['formManagement-list']);
      },
      onError: () => {
        message.error(t('message.deleteError'));
      }

    }
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

  const handleDelete = useCallback((data: FormProps[]) => {
    deleteMutate(data.map((ele) => ele.id));
  }, [deleteMutate]);

  /* Datas */
  const columns: ColumnsType<FormProps> = useMemo(() => ([
    // --- STT
    {
      title: 'ID',
      key: 'id',
      width: 75,
      align: 'center',
      render: (_name: string, data: FormProps) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Code
    {
      title: t('system.code'),
      dataIndex: 'code',
      key: 'code',
      sorter: {
        compare: (a: FormProps, b: FormProps) => a.code.localeCompare(b.code),
      },
      sortDirections: ['descend', 'ascend'],
    },
    // --- Name
    {
      title: t('system.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a: FormProps, b: FormProps) => a.name.localeCompare(b.name),
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: FormProps) => (
        <Typography.Text style={{ cursor: 'pointer' }} onClick={() => navigateParams(`${ROUTE_PATHS.FORM_DETAIL}`, `id=${data.id}`)}>
          {data.name}
        </Typography.Text>
      )
    },
    // --- Cập nhật
    {
      title: t('system.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: {
        compare: (a: FormProps, b: FormProps) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: FormProps) => (
        <Typography.Text>
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
      render: (_name: string, _data: FormProps) => (
        <Space>
          <Button
            disabled={!roleUpdate}
            icon={<EditOutlined />}
            onClick={() => navigateParams(`${ROUTE_PATHS.FORM_DETAIL}`, `id=${_data.id}`)}
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
                  handleDelete([_data]);
                },
              });
            }}
          />
        </Space>
      ),
    },
  ]), [t, roleUpdate, roleDelete, handleDelete, navigateParams]);

  const tableData: FormProps[] = useMemo(() => (
    listData?.data.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      updatedAt: item.updatedAt,
    })) || []), [listData]);

  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.forms')}
        rightHeader={(
          <Space>
            <Button
              disabled={!roleCreate}
              type="primary"
              onClick={() => {
                navigate(`${ROUTE_PATHS.FORM_DETAIL}`);
              }}
            >
              <PlusOutlined />
              {t('system.create')}
            </Button>
          </Space>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleDelete={(data) => handleDelete(data)}
          isLoading={listLoading || deleteLoading}
          handleSearch={handleSearch}
          noCheckbox
          tableProps={{
            initShowColumns: ['id', 'name', 'action'],
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

export default FormManagement;

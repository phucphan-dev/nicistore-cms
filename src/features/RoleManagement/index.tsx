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
import { deleteRoleService, getAllRolesService } from 'common/services/roles';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';

type RoleManageProps = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const RoleManagement: React.FC<ActiveRoles> = ({
  roleDelete, roleCreate, roleUpdate
}) => {
  /* Hook */
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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
    isFetching: listLoading,
    data: listData,
  } = useQuery(
    ['roleManagement-list', currentPage, keyword, currentView],
    () => getAllRolesService({ page: currentPage, keyword, limit: currentView }),
    { keepPreviousData: true }
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['roleManagement-delete'],
    async (ids: number[]) => deleteRoleService({ ids }),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(['roleManagement-list']);
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

  const handleDelete = useCallback((data: RoleManageProps[]) => {
    deleteMutate(data.map((ele) => ele.id));
  }, [deleteMutate]);

  /* Datas */
  const columns: ColumnsType<RoleManageProps> = useMemo(() => ([
    // --- ID
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      render: (_name: string, data: RoleManageProps) => (
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
        compare: (a: RoleManageProps, b: RoleManageProps) => a.name.localeCompare(b.name),
      },
      sortDirections: ['descend', 'ascend'],
    },
    // --- Tạo lúc
    {
      title: t('system.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 250,
      sorter: {
        compare: (a: RoleManageProps, b: RoleManageProps) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: RoleManageProps) => (
        <Typography.Text>
          {formatDateTime(data.createdAt)}
        </Typography.Text>
      ),
    },
    // --- Cập nhật
    {
      title: t('system.updatedAt'),
      dataIndex: 'updatedAt',
      width: 250,
      key: 'updatedAt',
      sorter: {
        compare: (a: RoleManageProps, b: RoleManageProps) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: RoleManageProps) => (
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
      render: (_name: string, _data: RoleManageProps) => (
        <Space>
          <Button
            disabled={!roleUpdate}
            icon={<EditOutlined />}
            onClick={() => navigateParams(`${ROUTE_PATHS.ROLES_DETAIL}`, `id=${_data.id}`)}
          />
          <Button
            disabled={!roleDelete}
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                className: 't-pagetable_deleteRecordModal',
                autoFocusButton: 'cancel',
                okText: t('system.ok'),
                cancelText: t('system.cancel'),
                cancelButtonProps: {
                  type: 'primary',
                },
                okButtonProps: {
                  type: 'default',
                },
                title: t('message.confirmDeleteRecord'),
                onOk: () => {
                  handleDelete([_data]);
                },
              });
            }}
          />
        </Space>
      ),
    },
  ]), [t, roleUpdate, roleDelete, navigateParams, handleDelete]);

  const tableData: RoleManageProps[] = useMemo(() => (
    listData?.data.map((item) => ({
      id: item.id,
      name: item.displayName,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })) || []), [listData]);

  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.roles')}
        rightHeader={(
          <Space>
            <Button
              disabled={!roleCreate}
              type="primary"
              onClick={() => {
                navigate(`${ROUTE_PATHS.ROLES_DETAIL}`);
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

export default RoleManagement;

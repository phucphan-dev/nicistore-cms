import {
  DeleteOutlined, EditOutlined, PlusOutlined, DatabaseOutlined
} from '@ant-design/icons';
import {
  Button, message, Modal, Space, Typography
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import CreateRedirectModal from './CreateRedirectModal';
import UpdateRedirectModal from './UpdateRedirectModal';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import { deleteRedirectsService, getAllRedirectsService } from 'common/services/redirects';
import { ROUTE_PATHS } from 'common/utils/constant';
import { formatDateTime } from 'common/utils/functions';
import roles, { getPermission } from 'configs/roles';

type RedirectProps = {
  id: number;
  from: string;
  to: string;
  updatedAt: string;
};

const RedirectManagement: React.FC<ActiveRoles> = ({
  roleDelete, roleCreate, roleUpdate
}) => {
  /* Hook */
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /* Store */
  const rolesUser = useAppSelector((state) => state.auth.roles);
  const { defaultPageSize } = useAppSelector((state) => state.system);

  /* States */
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(defaultPageSize);
  const [keyword, setKeyword] = useState('');
  const [createModal, setCreateModal] = useState({ open: false });
  const [updateModal, setUpdateModal] = useState({
    open: false,
    redirectData: {
      id: -1,
      from: '',
      to: '',
    }
  });

  /* React-query */
  const {
    isLoading: listLoading,
    data: listData,
  } = useQuery(
    ['redirectManagement-list', currentPage, keyword, currentView],
    () => getAllRedirectsService({ keyword, page: currentPage, limit: currentView }),
    { keepPreviousData: true }
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['redirectManagement-delete'],
    async (ids: number[]) => deleteRedirectsService({ ids }),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(['redirectManagement-list']);
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

  const handleDelete = useCallback((data: RedirectProps[]) => {
    deleteMutate(data.map((ele) => ele.id));
  }, [deleteMutate]);

  /* Datas */
  const columns: ColumnsType<RedirectProps> = useMemo(() => ([
    // --- STT
    {
      title: 'ID',
      key: 'id',
      width: 75,
      align: 'center',
      render: (_name: string, data: RedirectProps) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Chuyển từ
    {
      title: t('system.from'),
      dataIndex: 'from',
      key: 'from',
      sorter: {
        compare: (a: RedirectProps, b: RedirectProps) => a.from.localeCompare(b.from),
      },
      sortDirections: ['descend', 'ascend'],
    },
    // --- Chuyển đến
    {
      title: t('system.to'),
      dataIndex: 'to',
      key: 'to',
      sorter: {
        compare: (a: RedirectProps, b: RedirectProps) => a.from.localeCompare(b.from),
      },
      sortDirections: ['descend', 'ascend'],
    },
    // --- Cập nhật
    {
      title: t('system.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: {
        compare: (a: RedirectProps, b: RedirectProps) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: RedirectProps) => (
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
      render: (_name: string, _data: RedirectProps) => (
        <Space>
          <Button
            disabled={!roleUpdate}
            icon={<EditOutlined />}
            onClick={() => {
              setUpdateModal({
                open: true,
                redirectData: {
                  id: _data.id,
                  from: _data.from,
                  to: _data.to,
                }
              });
            }}
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
  ]), [t, roleUpdate, roleDelete, handleDelete]);

  const tableData: RedirectProps[] = useMemo(() => (
    listData?.data.map((item) => ({
      id: item.id,
      from: item.from,
      to: item.to,
      active: item.active,
      updatedAt: item.updatedAt,
    })) || []), [listData]);

  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.redirect')}
        rightHeader={(
          <Space>
            <Button
              disabled={!getPermission(rolesUser, roles.REDIRECT_IMPORT)}
              type="default"
              onClick={() => navigate(`${ROUTE_PATHS.REDIRECT_IMPORT}`)}
            >
              <DatabaseOutlined />
              {t('system.import')}
            </Button>
            <Button
              disabled={!roleCreate}
              type="primary"
              onClick={() => {
                setCreateModal({ open: true });
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
            initShowColumns: ['id', 'from', 'to', 'action'],
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
      <CreateRedirectModal
        open={createModal.open}
        handleClose={() => {
          setCreateModal({ open: false });
        }}
      />
      <UpdateRedirectModal
        open={updateModal.open}
        redirectData={updateModal.redirectData}
        handleClose={() => {
          setUpdateModal({
            open: false,
            redirectData: {
              id: -1,
              from: '',
              to: '',
            }
          });
        }}
      />
    </>
  );
};

export default RedirectManagement;

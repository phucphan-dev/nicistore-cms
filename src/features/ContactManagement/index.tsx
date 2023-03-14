import {
  DeleteOutlined, EditOutlined,
} from '@ant-design/icons';
import {
  Button, message, Modal, Space, Typography
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, {
  useCallback, useEffect, useMemo, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import UpdateContactModal, { UpdateContactForm } from './UpdateContactModal';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import {
  FilterDataProps, FilterValueProps, mappingFilterFields,
  mappingFilterToQuery, mappingParamsFilter, mappingQueryParamsFilter
} from 'common/components/PageTable/filter';
import { StatusHandleLabel, StatusHandleLabelType } from 'common/components/StatusLabel';
import { changeStatusContactManyIdService, deleteContactService, getAllContactService } from 'common/services/contact';
import { enumToMap } from 'common/utils/enumHelper';
import { formatDateTime } from 'common/utils/functions';

type ContactDataTable = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  content: string;
  updatedAt: string;
  status: number;
};

const ContactManagement: React.FC<ActiveRoles> = ({
  roleDelete, roleUpdate
}) => {
  /* Hook */
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  /* Store */
  const { defaultPageSize, advancedFilter } = useAppSelector((state) => state.system);

  /* States */
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(defaultPageSize);
  const [keyword, setKeyword] = useState('');
  const [selectedFilterList, setSelectedFilterList] = useState<
    FilterValueProps[]>(mappingQueryParamsFilter(params));
  const [updateModal, setUpdateModal] = useState<{
    open: boolean;
    contactData: UpdateContactForm;
  }>({
    open: false,
    contactData: {
      id: -1,
      name: '',
      email: '',
      phone: '',
      subject: '',
      content: '',
      status: -1,
    }
  });

  const returnParamsFilter = useMemo(
    () => mappingParamsFilter(selectedFilterList),
    [selectedFilterList]
  );

  /* React-query */
  const {
    isLoading: listLoading,
    data: listData,
  } = useQuery(
    ['contact-list', currentPage, keyword, currentView, selectedFilterList],
    () => getAllContactService({
      keyword, page: currentPage, limit: currentView, ...returnParamsFilter
    }),
  );

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    ['contact-delete'],
    async (ids: number[]) => deleteContactService({ ids }),
    {
      onSuccess: () => {
        message.success(t('message.deleteSuccess'));
        queryClient.invalidateQueries(['contact-list', currentPage, keyword, currentView, selectedFilterList]);
      },
      onError: () => {
        message.error(t('message.deleteError'));
      }

    }
  );

  const { mutate: changeStatusMutate, isLoading: changeStatusLoading } = useMutation(
    ['contact-changeStatusManyId'],
    async (data:
      {
        ids: number[], status: number
      }) => changeStatusContactManyIdService(data.ids, data.status),
    {
      onSuccess: () => {
        message.success(t('message.updateStatusSuccess'));
        queryClient.invalidateQueries(['contact-list', currentPage, keyword, currentView, selectedFilterList]);
      },
      onError: () => {
        message.error(t('message.updateStatusError'));
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

  const handleDelete = useCallback((data: ContactDataTable[]) => {
    deleteMutate(data.map((ele) => ele.id));
  }, [deleteMutate]);

  /* Datas */
  const columns: ColumnsType<ContactDataTable> = useMemo(() => ([
    // --- STT
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      render: (_name: string, data: ContactDataTable) => (
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
        compare: (a: ContactDataTable, b: ContactDataTable) => a.name.localeCompare(b.name),
      },
      sortDirections: ['descend', 'ascend'],
    },
    // --- Email
    {
      title: t('system.email'),
      dataIndex: 'email',
      key: 'email',
      sorter: {
        compare: (a: ContactDataTable, b: ContactDataTable) => a.email.localeCompare(b.email),
      },
      sortDirections: ['descend', 'ascend'],
    },
    // --- Số điện thoại
    {
      title: t('system.phone'),
      dataIndex: 'phone',
      key: 'phone',
      sorter: {
        compare: (a: ContactDataTable, b: ContactDataTable) => a.phone.localeCompare(b.phone),
      },
      sortDirections: ['descend', 'ascend'],
    },
    // --- Tiêu đề
    {
      title: t('system.subject'),
      dataIndex: 'subject',
      key: 'subject',
      sorter: {
        compare: (a: ContactDataTable, b: ContactDataTable) => a.phone.localeCompare(b.phone),
      },
      sortDirections: ['descend', 'ascend'],
    },
    // --- Trạng thái
    {
      title: t('system.status'),
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_name: string, data: ContactDataTable) => (
        <StatusHandleLabel status={data.status} />
      ),
    },
    // --- Cập nhật
    {
      title: t('system.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: {
        compare: (a: ContactDataTable, b: ContactDataTable) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return Number(aDate) - Number(bDate);
        },
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: ContactDataTable) => (
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
      render: (_name: string, _data: ContactDataTable) => (
        <Space>
          <Button
            disabled={!roleUpdate}
            icon={<EditOutlined />}
            onClick={() => {
              setUpdateModal({
                open: true,
                contactData: { ..._data }
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

  const tableData: ContactDataTable[] = useMemo(() => (
    listData?.data.map((item) => ({
      id: item.contactData.id,
      name: item.contactData.name,
      email: item.contactData.email,
      phone: item.contactData.phone,
      subject: item.contactData.subject,
      content: item.contactData.content,
      updatedAt: item.contactData.updatedAt,
      status: item.contactData.status,
    })) || []), [listData]);

  const filterFields: FilterDataProps[] = useMemo(
    () => mappingFilterFields('contact', advancedFilter),
    [advancedFilter]
  );

  /* Functions */
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

  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.contact')}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleDelete={(data) => handleDelete(data)}
          isLoading={listLoading || deleteLoading}
          handleSearch={handleSearch}
          tableProps={{
            initShowColumns: ['id', 'name', 'email', 'phone', 'status', 'subject', 'action'],
            columns,
            pageData: tableData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: listData?.meta.total || 1,
            noBaseCol: true,
            noDeleteLanguage: true,
            filterFields
          }}
          roles={{
            roleCreate: false,
            roleDelete,
            roleUpdate
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
            statusOptions: Array.from(enumToMap(
              StatusHandleLabelType
            ).entries())
              // Remove waiting option
              .slice(1)
              .map((ele) => ({
                label: t(`system.${ele[0]}HandleSave`),
                value: ele[1],
              })),
            canChangeStatusApprove: true,
          }}
        />
      </div>
      <UpdateContactModal
        open={updateModal.open}
        contactData={updateModal.contactData}
        handleClose={() => {
          setUpdateModal({
            open: false,
            contactData: {
              id: -1,
              name: '',
              email: '',
              phone: '',
              subject: '',
              content: '',
              status: -1,
            }
          });
        }}
      />
    </>
  );
};

export default ContactManagement;

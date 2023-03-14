import { EditOutlined } from '@ant-design/icons';
import {
  Button, Checkbox, Typography, Modal, message
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, {
  useEffect,
  useMemo, useState
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAppSelector } from 'app/store';
import Input from 'common/components/Input';
import PageTable from 'common/components/PageTable';
import SelectFile from 'common/components/SelectFile';
import { getSystemLocalesService, updateSystemLocalesService } from 'common/services/systems';
import { SystemLocaleItemType, UpdateSystemLocalesParams } from 'common/services/systems/types';

type SystemLocaleModal = {
  open: boolean;
  data?: SystemLocaleItemType;
};

type SystemLocaleForm = {
  id: string;
  icon: string;
  active: boolean;
  text: string;
};

const LanguageSM: React.FC<{ canEdit: boolean }> = ({ canEdit }) => {
  /* Hooks */
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  /* Selectors */
  const { defaultPageSize } = useAppSelector((state) => state.system);

  /* States */
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(defaultPageSize || 15);
  const [editModal, setEditModal] = useState<SystemLocaleModal>({
    open: false,
    data: undefined,
  });

  /* React-hooks-form */
  const method = useForm<SystemLocaleForm>({
    mode: 'onSubmit',
    defaultValues: {
      icon: '',
      active: true,
      text: '',
    },
  });

  /* Queries */
  const {
    isLoading,
    data: localeData,
  } = useQuery(
    ['systemsManagement-language', 'list'],
    () => getSystemLocalesService(),
  );

  const { mutate: editLocaleMutate, isLoading: isEditLoading } = useMutation(
    ['systemsManagement-language', 'edit'],
    async (params: UpdateSystemLocalesParams) => updateSystemLocalesService(params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        setEditModal({ open: false, data: undefined });
        queryClient.invalidateQueries(['systemsManagement-language', 'list']);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }

    }
  );

  /* Configs */
  const columns: ColumnsType<SystemLocaleItemType> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      render: (_name: string, _data: SystemLocaleItemType, index: number) => (
        <Typography.Text>
          {((currentPage - 1) * currentView) + index + 1}
        </Typography.Text>
      ),
    },
    {
      title: t('system.name'),
      dataIndex: 'text',
      key: 'text',
      render: (_name: string, data: SystemLocaleItemType) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {`${data.text} (${data.id})`}
        </Typography.Text>
      ),
    },
    // --- Trạng thái
    {
      title: t('system.status'),
      dataIndex: 'active',
      key: 'active',
      width: 80,
      align: 'center',
      render: (_name: string, data: SystemLocaleItemType) => (
        <Checkbox
          checked={data.active}
        />
      ),
    },
    {
      title: t('system.action'),
      key: 'action',
      width: 100,
      align: 'center',
      render: (_name: string, data: SystemLocaleItemType) => (
        <Button
          disabled={!canEdit}
          icon={<EditOutlined />}
          onClick={() => {
            setEditModal({ open: true, data });
          }}
        />
      ),
    },
  ];

  const tableData = useMemo(() => {
    if (localeData) {
      return Object.keys(localeData).map((locale) => ({
        id: locale,
        icon: localeData[locale].icon,
        text: `${localeData[locale].text}`,
        active: localeData[locale].active
      }));
    }
    return [];
  }, [localeData]);

  /* Functions */
  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetCurrentView = (view: number) => {
    setCurrentView(view);
  };

  const handleEditLocale = (data: SystemLocaleForm) => {
    if (localeData) {
      const result = {
        locales: {
          [data.id]: {
            elements: {
              active: data.active,
              icon: data.icon,
              text: data.text,
            }
          }
        }
      };
      editLocaleMutate(result);
    }
  };

  /* Effects */
  useEffect(() => {
    if (editModal.open && editModal.data) {
      method.reset({
        id: editModal.data.id,
        icon: editModal.data.icon,
        active: editModal.data.active,
        text: editModal.data.text,
      });
    }
  }, [editModal, method]);

  return (
    <div className="p_system_language">
      <div className="p_system_language_table">
        <PageTable
          isLoading={isLoading || isEditLoading}
          tableProps={{
            initShowColumns: ['id', 'text', 'active', 'action'],
            columns,
            pageData: tableData,
            currentPage,
            noBaseCol: true,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: tableData.length
          }}
        />
      </div>
      <div className="p_system_language_editModal">
        <Modal
          title={<Typography.Title level={3}>{t('system.update')}</Typography.Title>}
          visible={editModal.open}
          centered
          onCancel={() => { setEditModal({ open: false, data: undefined }); }}
          width={800}
          onOk={method.handleSubmit(handleEditLocale)}
          confirmLoading={isEditLoading}
        >
          <FormProvider<SystemLocaleForm> {...method}>
            <form noValidate>
              <Controller
                name="text"
                render={({
                  field: { onChange, value, ref },
                  fieldState: { error },
                }) => (
                  <div>
                    <Typography.Text strong>
                      {t('system.name')}
                      {' '}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      *
                    </Typography.Text>
                    <Input
                      ref={ref}
                      onChange={onChange}
                      value={value}
                      placeholder={t('system.name')}
                      error={error?.message}
                    />
                  </div>
                )}
              />

              <Controller
                name="icon"
                render={({
                  field: { value, onChange },
                }) => (
                  <div className="u-mt-8">
                    <SelectFile
                      value={value}
                      name="icon"
                      handleSelect={(url) => onChange(url)}
                      handleDelete={() => onChange(undefined)}
                      title={t('system.icon')}
                    />
                  </div>
                )}
              />

              <Controller
                name="active"
                render={({
                  field: { onChange, value, ref },
                  fieldState: { error },
                }) => (
                  <div className="u-mt-8">
                    <Checkbox
                      ref={ref}
                      checked={value}
                      onChange={onChange}
                    >
                      Active
                    </Checkbox>
                    {error?.message && (
                      <Typography.Text strong type="danger">
                        {error?.message}
                      </Typography.Text>
                    )}
                  </div>
                )}
              />
            </form>
          </FormProvider>
        </Modal>
      </div>
    </div>
  );
};

export default LanguageSM;

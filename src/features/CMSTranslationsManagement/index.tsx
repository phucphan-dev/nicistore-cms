import { EditOutlined } from '@ant-design/icons';
import {
  Button, Typography
} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import PageTable from 'common/components/PageTable';
import { getCMSTranslationsService, updateCMSTranslationsService } from 'common/services/translations';

type PageProps = {
  id: number;
  group: string;
  keyCode: string;
  text: {
    en?: string;
    vi?: string;
  };
};

type TranslationFormData = {
  id: number;
  vi: string;
  en: string;
};

const CMSTranslationsManagement: React.FC<ActiveRoles> = ({
  roleUpdate
}) => {
  const { t } = useTranslation();
  /* Selectors */
  const { defaultPageSize } = useAppSelector((state) => state.system);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(defaultPageSize);
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const queryKey = ['pages', 'cms-translations', currentPage, keyword, currentView];

  const {
    isLoading,
    data: pageData,
  } = useQuery(
    queryKey,
    () => getCMSTranslationsService({ keyword, page: currentPage, limit: currentView }),
    { keepPreviousData: true }
  );

  const method = useForm<TranslationFormData>({
    mode: 'onSubmit',
    defaultValues: {
      id: 0,
      vi: '',
      en: '',
    },
  });

  const handleSearch = (val: string) => {
    setKeyword(val);
  };

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetCurrentView = (view: number) => {
    setCurrentView(view);
  };

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const columns: ColumnsType<PageProps> = [
    {
      title: 'ID',
      key: 'id',
      width: 75,
      align: 'center',
      render: (_name: string, data: PageProps) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    {
      title: t('system.group'),
      dataIndex: 'group',
      key: 'group',
      sorter: {
        compare: (a: PageProps, b: PageProps) => a.group.localeCompare(b.group),
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: PageProps) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {data.group}
        </Typography.Text>
      ),
    },
    {
      title: t('system.code'),
      dataIndex: 'key',
      key: 'key',
      sorter: {
        compare: (a: PageProps, b: PageProps) => a.keyCode.localeCompare(b.keyCode),
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: PageProps) => (
        <Typography.Text
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {data.keyCode}
        </Typography.Text>
      ),
    },
    {
      title: t('system.content'),
      dataIndex: 'text',
      key: 'text',
      render: (_name: string, data: PageProps) => (
        <div>
          <Typography.Text
            style={{ color: '#4a4a4a', cursor: 'pointer' }}
          >
            <strong style={{ color: '#006F3A' }}>
              {'vi: '}
            </strong>
            {data?.text?.vi}
          </Typography.Text>
          <br />
          <Typography.Text
            style={{ color: '#4a4a4a', cursor: 'pointer' }}
          >
            <strong style={{ color: '#006F3A' }}>
              {'en: '}
            </strong>
            {data?.text?.en}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: t('system.action'),
      key: 'action',
      width: 100,
      align: 'center',
      render: (_name: string, data: PageProps) => (
        <Button
          disabled={!roleUpdate}
          icon={<EditOutlined />}
          onClick={() => {
            method.setValue('id', data.id);
            method.setValue('vi', data?.text?.vi || '');
            method.setValue('en', data?.text?.en || '');
            setIsOpen(true);
          }}
        />
      ),
    },
  ];

  const tableData: PageProps[] = useMemo(
    () => pageData?.data?.map((x) => ({ ...x, keyCode: x.key })) || [],
    [pageData?.data]
  );

  const updateTranslationAction = async (data: TranslationFormData) => {
    try {
      setLoading(true);
      await updateCMSTranslationsService(data);
      await queryClient.invalidateQueries(queryKey);
      setIsOpen(false);
    } catch (error) {
      // Error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.cmsTranslations')}
      />

      <div className="t-mainlayout_wrapper">
        <PageTable
          isLoading={loading}
          handleSearch={handleSearch}
          noCheckbox
          tableProps={{
            initShowColumns: ['id', 'group', 'key', 'text', 'action'],
            noBaseCol: true,
            columns,
            pageData: tableData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            total: pageData?.meta.total,
            noDeleteLanguage: true,
          }}
        />
      </div>

      <Modal
        title={<Typography.Title level={3}>{t('translations.cmsTitle')}</Typography.Title>}
        visible={isOpen}
        centered
        okText={t('system.ok')}
        cancelText={t('system.cancel')}
        onCancel={() => {
          setIsOpen(false);
          method.reset();
        }}
        onOk={method.handleSubmit(updateTranslationAction)}
        confirmLoading={loading}
      >
        <FormProvider<TranslationFormData> {...method}>
          <form noValidate>
            <div className="t-menuManagement_input">
              <Controller
                name="vi"
                render={({
                  field: { onChange, value, ref },
                }) => (
                  <>
                    <Typography.Text strong>
                      {t('system.languageVi')}
                    </Typography.Text>
                    <Input
                      ref={ref}
                      onChange={onChange}
                      value={value}
                      placeholder={t('system.languageVi')}
                    />
                  </>
                )}
              />
            </div>
            <div className="t-menuManagement_input">
              <Controller
                name="en"
                render={({
                  field: { onChange, value, ref },
                }) => (
                  <>
                    <Typography.Text strong>
                      {t('system.languageEn')}
                    </Typography.Text>
                    <Input
                      ref={ref}
                      onChange={onChange}
                      value={value}
                      placeholder={t('system.languageEn')}
                    />
                  </>
                )}
              />
            </div>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default CMSTranslationsManagement;

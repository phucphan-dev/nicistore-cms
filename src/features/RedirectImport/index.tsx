import {
  CloudUploadOutlined, FileExcelOutlined
} from '@ant-design/icons';
import {
  Button, message, Space, Typography, Upload
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import PageTable from 'common/components/PageTable';
import {
  importRedirectsService,
  previewImportRedirectsService
} from 'common/services/redirects';
import { ROUTE_PATHS } from 'common/utils/constant';

type PreviewRedirect = {
  id: number;
  from: string;
  to: string;
};

const RedirectImport: React.FC = () => {
  /* Hook */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* Selectors */
  const importTemplates = useAppSelector((state) => state.system.initialData?.importTemplates);

  /* States */
  const [tableData, setTableData] = useState<PreviewRedirect[]>([]);
  const [uploadFile, setUploadFile] = useState<File>();

  /* React-query */
  const { mutate: previewMutate, data: previewData, isLoading: previewLoading } = useMutation(
    ['redirectManagement-import-preview'],
    async (file: File) => previewImportRedirectsService({ file }),
    {
      onSuccess: (_, file) => {
        message.success(t('message.uploadSuccess'));
        setUploadFile(file);
      },
      onError: () => {
        message.error(t('message.uploadError'));
      }

    }
  );

  const { mutate: importMutate, isLoading: importLoading } = useMutation(
    ['redirectManagement-import'],
    async (file: File) => importRedirectsService({ file }),
    {
      onSuccess: () => {
        message.success(t('message.importSuccess'));
        queryClient.invalidateQueries(['redirectManagement-list']);
        navigate(`${ROUTE_PATHS.REDIRECT_MANAGEMENT}`);
      },
      onError: () => {
        message.error(t('message.importError'));
      }

    }
  );

  /* Functions */
  const handleUpload = (file?: File) => {
    if (file) {
      previewMutate(file);
    }
  };

  const handleImport = () => {
    if (uploadFile) {
      importMutate(uploadFile);
    }
  };

  /* Datas */
  const columns: ColumnsType<PreviewRedirect> = useMemo(() => ([
    // --- STT
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      render: (_name: string, _data: any, index: number) => (
        <Typography.Text>
          {index + 1}
        </Typography.Text>
      ),
    },
    // --- Chuyển từ
    {
      title: t('system.from'),
      dataIndex: 'from',
      key: 'from',
      sorter: {
        compare: (a: PreviewRedirect, b: PreviewRedirect) => a.from.localeCompare(b.from),
      },
      sortDirections: ['descend', 'ascend'],
    },
    // --- Chuyển đến
    {
      title: t('system.to'),
      dataIndex: 'to',
      key: 'to',
      sorter: {
        compare: (a: PreviewRedirect, b: PreviewRedirect) => a.from.localeCompare(b.from),
      },
      sortDirections: ['descend', 'ascend'],
    },
  ]), [t]);

  useEffect(() => {
    if (previewData) {
      const data = previewData.map((item, index) => ({
        id: index,
        from: item.from,
        to: item.to,
      }));
      setTableData(data);
    }
  }, [previewData]);

  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.importRedirect')}
      />
      <div className="t-mainlayout_wrapper">
        <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
          {importTemplates && (
            <Button
              type="primary"
              onClick={() => window.open(importTemplates.redirect, '_blank')}
            >
              <FileExcelOutlined />
              {t('system.downloadSampleFile')}
            </Button>
          )}
          <Space align="start">
            <Button
              disabled={!tableData.length}
              type="primary"
              onClick={handleImport}
            >
              <CloudUploadOutlined />
              {t('system.import')}
            </Button>
            <Upload
              beforeUpload={(file) => {
                handleUpload(file);
                return false;
              }}
              onChange={(info) => {
                if (info.file.status === 'removed') {
                  queryClient.setQueryData(['redirectManagement-import-preview'], []);
                  setTableData([]);
                }
              }}
              maxCount={1}
              accept=".xls, .xlsx"
            >
              <Button
                type="default"
              >
                {t('system.upload')}
              </Button>
            </Upload>
          </Space>
        </Space>
        <PageTable
          isLoading={previewLoading || importLoading}
          tableProps={{
            initShowColumns: ['id', 'from', 'to'],
            columns,
            pageData: tableData,
            isHidePagination: true,
            noBaseCol: true,
            noDeleteLanguage: true,
          }}
        />
      </div>
    </>
  );
};

export default RedirectImport;

import { SaveOutlined } from '@ant-design/icons';
import {
  Typography, message, Card, Button, Upload, Space
} from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import React, {
  useEffect, useState,
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';

import Input from 'common/components/Input';
import { getSystemGeneralService, updateSystemGeneralService } from 'common/services/systems';
import { UpdateSystemGeneralParams } from 'common/services/systems/types';
import { getImageURL } from 'common/utils/functions';

type SystemGeneralForm = {
  gaId: string;
  gtmId: string;
  gMapId: string;
  fileFavicon?: File;
};

const GeneralSM: React.FC<{ canEdit: boolean }> = ({ canEdit }) => {
  /* Hooks */
  const { t } = useTranslation();

  /* States */
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  /* React-hooks-form */
  const method = useForm<SystemGeneralForm>({
    mode: 'onSubmit',
    defaultValues: {
      gaId: '',
      gtmId: '',
      gMapId: '',
      fileFavicon: undefined,
    },
  });

  /* Queries */
  const {
    data: generalData,
  } = useQuery(
    ['systemsManagement-general', 'list'],
    () => getSystemGeneralService(),
  );

  const { mutate: editGeneralMutate, isLoading: isEditLoading } = useMutation(
    ['systemsManagement-general', 'edit'],
    async (params: UpdateSystemGeneralParams) => updateSystemGeneralService(params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
      },
      onError: () => {
        message.error(t('message.updateError'));
      }

    }
  );

  /* Functions */
  const handleSubmit = (data: SystemGeneralForm) => {
    editGeneralMutate(data);
  };

  /* Effects */
  useEffect(() => {
    if (generalData) {
      method.reset({
        gaId: generalData.gaId,
        gtmId: generalData.gtmId,
        gMapId: generalData.gMapId,
      });
      setFileList([{
        uid: '-1',
        name: generalData?.favicon?.split('/').slice(-1)[0] || 'favicon.ico',
        url: getImageURL(generalData?.favicon),
        thumbUrl: getImageURL(generalData?.favicon),
      }]);
    }
  }, [generalData, method]);

  return (
    <div className="p-system_general">
      <FormProvider<SystemGeneralForm> {...method}>
        <form noValidate>
          <Card type="inner">
            <Space className="p-system_general_space" direction="vertical" size={16}>
              <Controller
                name="gaId"
                render={({
                  field: { onChange, value, ref },
                  fieldState: { error },
                }) => (
                  <div>
                    <Typography.Text strong>
                      {t('systemManagement.gaId')}
                      {' '}
                    </Typography.Text>
                    <Input
                      ref={ref}
                      onChange={onChange}
                      value={value}
                      error={error?.message}
                    />
                  </div>
                )}
              />

              <Controller
                name="gtmId"
                render={({
                  field: { onChange, value, ref },
                  fieldState: { error },
                }) => (
                  <>
                    <Typography.Text strong>
                      {t('systemManagement.gtmId')}
                    </Typography.Text>
                    <Input
                      ref={ref}
                      onChange={onChange}
                      value={value}
                      error={error?.message}
                    />
                  </>
                )}
              />

              <Controller
                name="gMapId"
                render={({
                  field: { onChange, value, ref },
                  fieldState: { error },
                }) => (
                  <>
                    <Typography.Text strong>
                      {t('systemManagement.gMapId')}
                    </Typography.Text>
                    <Input
                      ref={ref}
                      onChange={onChange}
                      value={value}
                      error={error?.message}
                    />
                  </>
                )}
              />

              <Controller
                name="fileFavicon"
                render={({ field: { onChange } }) => (
                  <Upload
                    listType="picture"
                    beforeUpload={() => false}
                    onChange={(info) => {
                      onChange(info.fileList?.[0]?.originFileObj);
                      setFileList([...info.fileList]);
                    }}
                    onRemove={() => onChange(undefined)}
                    maxCount={1}
                    fileList={fileList}
                    accept="image/x-icon"
                  >
                    <Button
                      type="default"
                    >
                      {t('systemManagement.uploadFavicon')}
                    </Button>
                  </Upload>
                )}
              />
            </Space>
            <div className="p-system_general_submit u-mt-16">
              <Button
                type="primary"
                disabled={!canEdit}
                loading={isEditLoading}
                onClick={method.handleSubmit(handleSubmit)}
              >
                <SaveOutlined />
                {t('system.save')}
              </Button>
            </div>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
};

export default GeneralSM;

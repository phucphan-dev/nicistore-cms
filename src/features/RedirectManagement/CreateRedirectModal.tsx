import { yupResolver } from '@hookform/resolvers/yup';
import {
  message,
  Modal, Typography
} from 'antd';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

import Input from 'common/components/Input';
import { createRedirectsService } from 'common/services/redirects';
import { CreateRedirectParams } from 'common/services/redirects/types';
import { redirectFormSchema } from 'common/utils/schemas';

interface CreateRedirectForm {
  from: string;
  to: string;
}

interface CreateRedirectModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateRedirectModal: React.FC<CreateRedirectModalProps> = ({ open, handleClose }) => {
  /* Hooks */
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  /* React-hooks-form */
  const method = useForm<CreateRedirectForm>({
    resolver: yupResolver(redirectFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      from: '',
      to: '',
    },
  });

  /* React-query */
  const { mutate: createMutate, isLoading } = useMutation(
    ['redirectManagement-create'],
    async (params: CreateRedirectParams) => createRedirectsService(params),
    {
      onSuccess: () => {
        message.success('Tạo thành công!');
        queryClient.invalidateQueries(['redirectManagement-list']);
        method.reset();
        handleClose();
      },
      onError: (error: any) => {
        if (error.length > 0) {
          error.forEach((element: ErrorResponse) => {
            method.setError((element.field as any), { message: t('message.dataExist') });
          });
        } else message.error('Đã có lỗi xảy ra! Vui lòng thử lại sau');
      }

    }
  );

  /* Functions */
  const handleCreateRedirect = (data: CreateRedirectForm) => {
    createMutate(data);
  };

  return (
    <Modal
      title={<Typography.Title level={3}>{t('system.create301Redirect')}</Typography.Title>}
      visible={open}
      centered
      onCancel={handleClose}
      okText={t('system.ok')}
      cancelText={t('system.cancel')}
      width={800}
      onOk={method.handleSubmit(handleCreateRedirect)}
      confirmLoading={isLoading}
    >
      <FormProvider<CreateRedirectForm> {...method}>
        <form noValidate>
          <div className="t-redirectManagement_createModal_form">
            <Controller
              name="from"
              render={({
                field: { onChange, value, ref },
                fieldState: { error },
              }) => (
                <div className="t-redirectManagement_createModal_input">
                  <Typography.Text strong>
                    {t('system.from')}
                    {' '}
                  </Typography.Text>
                  <Typography.Text strong type="danger">
                    *
                  </Typography.Text>
                  <Input
                    ref={ref}
                    onChange={onChange}
                    value={value}
                    placeholder={t('system.from')}
                    error={error?.message}
                  />
                </div>
              )}
            />
            <Controller
              name="to"
              render={({
                field: { onChange, value, ref },
                fieldState: { error },
              }) => (
                <div className="t-redirectManagement_createModal_input">
                  <Typography.Text strong>
                    {t('system.to')}
                    {' '}
                  </Typography.Text>
                  <Typography.Text strong type="danger">
                    *
                  </Typography.Text>
                  <Input
                    ref={ref}
                    onChange={onChange}
                    value={value}
                    placeholder={t('system.to')}
                    error={error?.message}
                  />
                </div>
              )}
            />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default CreateRedirectModal;

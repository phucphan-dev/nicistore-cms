import { yupResolver } from '@hookform/resolvers/yup';
import {
  message,
  Modal, Typography
} from 'antd';
import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

import Input from 'common/components/Input';
import { updateRedirectsService } from 'common/services/redirects';
import { redirectFormSchema } from 'common/utils/schemas';

interface UpdateRedirectForm {
  from: string;
  to: string;
}

interface UpdateRedirectModalProps {
  open: boolean;
  handleClose: () => void;
  redirectData: {
    id: number;
  } & UpdateRedirectForm;
}

const UpdateRedirectModal: React.FC<UpdateRedirectModalProps> = ({
  redirectData, open, handleClose
}) => {
  /* Hooks */
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  /* React-hooks-form */
  const method = useForm<UpdateRedirectForm>({
    resolver: yupResolver(redirectFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      from: '',
      to: '',
    },
  });

  /* React-query */
  const { mutate: updateMutate, isLoading } = useMutation(
    ['redirectManagement-update'],
    async (data: UpdateRedirectForm) => updateRedirectsService({ id: redirectData.id, ...data }),
    {
      onSuccess: () => {
        message.success('Chỉnh sửa thành công!');
        queryClient.invalidateQueries(['redirectManagement-list']);
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
  const handleUpdateRedirect = (data: UpdateRedirectForm) => {
    updateMutate(data);
  };

  /* Effects */
  useEffect(() => {
    method.reset({ from: redirectData.from, to: redirectData.to });
  }, [redirectData, method]);

  return (
    <Modal
      title={<Typography.Title level={3}>{t('system.edit301Redirect')}</Typography.Title>}
      visible={open}
      centered
      onCancel={handleClose}
      width={800}
      onOk={method.handleSubmit(handleUpdateRedirect)}
      confirmLoading={isLoading}
    >
      <FormProvider<UpdateRedirectForm> {...method}>
        <form noValidate>
          <div className="t-redirectManagement_updateModal_form">
            <Controller
              name="from"
              render={({
                field: { onChange, value, ref },
                fieldState: { error },
              }) => (
                <div className="t-redirectManagement_updateModal_input">
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
                <div className="t-redirectManagement_updateModal_input">
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

export default UpdateRedirectModal;

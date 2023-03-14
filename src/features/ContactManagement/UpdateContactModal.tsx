import {
  message,
  Modal, Space, Typography
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

import { StatusHandleButtons, StatusHandleLabel } from 'common/components/StatusLabel';
import { updateStatusContactService } from 'common/services/contact';
import { UpdateStatusContactParams } from 'common/services/contact/types';

export interface UpdateContactForm {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  content: string;
  status: number;
}

interface UpdateContactModalProps {
  open: boolean;
  handleClose: () => void;
  contactData: UpdateContactForm;
}

const UpdateContactModal: React.FC<UpdateContactModalProps> = ({
  contactData, open, handleClose
}) => {
  /* Hooks */
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  /* React-query */
  const { mutate: updateMutate, isLoading: updateLoading } = useMutation(
    ['contact-update'],
    async (data: UpdateStatusContactParams) => updateStatusContactService({ ...data }),
    {
      onSuccess: () => {
        message.success(t('message.updateStatusMessage'));
        queryClient.invalidateQueries(['contact-list']);
        handleClose();
      },
      onError: () => {
        message.error(t('message.updateStatusError'));
      }

    }
  );

  return (
    <Modal
      title={<Typography.Title level={3}>{t('contact.detail')}</Typography.Title>}
      visible={open}
      centered
      onCancel={handleClose}
      width={800}
      footer={null}
    >
      <div className="t-contactManagement_updateModal_form">
        <div className="t-contactManagement_updateModal_info">
          <Typography.Text strong>
            ID:
            {' '}
          </Typography.Text>
          <Typography.Text>
            {contactData.id}
          </Typography.Text>
        </div>
        <div className="t-contactManagement_updateModal_info u-mt-8">
          <Typography.Text strong>
            {t('system.name')}
            :
            {' '}
          </Typography.Text>
          <Typography.Text>
            {contactData.name}
          </Typography.Text>
        </div>
        <div className="t-contactManagement_updateModal_info u-mt-8">
          <Typography.Text strong>
            {t('system.email')}
            :
            {' '}
          </Typography.Text>
          <Typography.Text>
            {contactData.email}
          </Typography.Text>
        </div>
        <div className="t-contactManagement_updateModal_info u-mt-8">
          <Typography.Text strong>
            {t('system.phone')}
            :
            {' '}
          </Typography.Text>
          <Typography.Text>
            {contactData.phone}
          </Typography.Text>
        </div>
        <div className="t-contactManagement_updateModal_info u-mt-8">
          <Typography.Text strong>
            {t('system.subject')}
            :
            {' '}
          </Typography.Text>
          <Typography.Text>
            {contactData.subject}
          </Typography.Text>
        </div>
        <div className="t-contactManagement_updateModal_info u-mt-8">
          <Typography.Text strong>
            {t('system.content')}
            :
            {' '}
          </Typography.Text>
          <Typography.Text>
            {contactData.content}
          </Typography.Text>
        </div>
        <div className="t-contactManagement_updateModal_info u-mt-8">
          <Space>
            <Typography.Text strong>
              {t('system.status')}
              :
              {' '}
            </Typography.Text>
            <StatusHandleLabel status={contactData.status} />
            <StatusHandleButtons
              loading={updateLoading}
              status={contactData.status}
              handleChangeStatus={(stat) => {
                updateMutate({ id: contactData.id, status: stat });
              }}
            />
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateContactModal;

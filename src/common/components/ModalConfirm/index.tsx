import {
  CloseOutlined, RiseOutlined, StopOutlined, WarningTwoTone
} from '@ant-design/icons';
import {
  Button, Modal, Space, Typography
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ModalConfirmProps {
  isShow?: boolean;
  children?: React.ReactNode;
  handleCancel?: () => void;
  handleConfirm?: () => void;
  handleClose?: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isShow, children, handleCancel, handleConfirm, handleClose
}) => {
  const { t } = useTranslation();
  return (
    <Modal visible={isShow} footer={null} closable={false}>
      <div className="m-modalConfirm">
        <div className="m-modalConfirm_close">
          <CloseOutlined onClick={handleClose} />
        </div>
        <div className="m-modalConfirm_content">
          <WarningTwoTone twoToneColor="#faad14" />
          <Typography.Text>{children}</Typography.Text>
        </div>
        <Space className="m-modalConfirm_controls">
          <Button onClick={handleConfirm}>
            <StopOutlined />
            {t('system.skip')}
          </Button>
          <Button type="primary" onClick={handleCancel}>
            <RiseOutlined />
            {t('system.editContinue')}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default ModalConfirm;

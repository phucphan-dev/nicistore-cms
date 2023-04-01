import { FileAddOutlined, FileDoneOutlined, FileOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from 'app/store';
import mapModifiers from 'common/utils/functions';

export type StatusLabelType = 'draft' | 'waiting' | 'approved';
export type StatusOrderLabelType = 'new' | 'processing' | 'delivering' | 'done' | 'cancel';

export const returnModifier = (status: number): StatusLabelType => {
  switch (status) {
    case 1:
      return 'draft';
    case 7:
      return 'waiting';
    default:
      return 'approved';
  }
};

export const returnModifierOrder = (status: number): StatusOrderLabelType => {
  switch (status) {
    case 0:
      return 'new';
    case 1:
      return 'processing';
    case 2:
      return 'delivering';
    case 3:
      return 'done';
    default:
      return 'cancel';
  }
};

type StatusLabelProps = {
  status: number;
  bigger?: boolean;
  type?: 'secondary'
};

const StatusLabel: React.FC<StatusLabelProps> = ({ status, bigger, type }) => {
  const { t } = useTranslation();
  return (
    <div className={mapModifiers('m-statusLabel', type)}>
      <div className={mapModifiers('m-statusLabel_wrapper', returnModifier(status), bigger && 'bigger')}>
        {(() => {
          switch (status) {
            case 1:
              return (
                <>
                  <span>{bigger ? `${t('system.status')}: ` : ''}</span>
                  <b>{t('system.draft')}</b>
                </>
              );
            case 7:
              return (
                <>
                  {bigger ? `${t('system.status')}: ` : ''}
                  <b>{t('system.waiting')}</b>
                </>
              );
            default:
              return (
                <>
                  <span>{bigger ? `${t('system.status')}: ` : ''}</span>
                  <b>{t('system.approved')}</b>
                </>
              );
          }
        })()}
      </div>
    </div>
  );
};

export const StatusOrderLabel: React.FC<StatusLabelProps> = ({ status, bigger, type }) => {
  const { t } = useTranslation();
  return (
    <div className={mapModifiers('m-statusLabel', type)}>
      <div className={mapModifiers('m-statusLabel_wrapper', returnModifierOrder(status), bigger && 'bigger')}>
        {(() => {
          switch (status) {
            case 0:
              return (
                <>
                  <span>{bigger ? `${t('system.status')}: ` : ''}</span>
                  <b>{t('order.new')}</b>
                </>
              );
            case 1:
              return (
                <>
                  {bigger ? `${t('system.status')}: ` : ''}
                  <b>{t('order.processing')}</b>
                </>
              );
            case 2:
              return (
                <>
                  {bigger ? `${t('system.status')}: ` : ''}
                  <b>{t('order.delevering')}</b>
                </>
              );
            case 3:
              return (
                <>
                  {bigger ? `${t('system.status')}: ` : ''}
                  <b>{t('order.done')}</b>
                </>
              );
            default:
              return (
                <>
                  <span>{bigger ? `${t('system.status')}: ` : ''}</span>
                  <b>{t('order.cancel')}</b>
                </>
              );
          }
        })()}
      </div>
    </div>
  );
};

type StatusButtonsProps = {
  loading?: boolean;
  status: number;
  isApprove?: boolean;
  handleChangeStatus: (status: number) => void;
};

export const StatusButtons: React.FC<StatusButtonsProps> = ({
  loading,
  status,
  isApprove,
  handleChangeStatus
}) => {
  const { t } = useTranslation();
  const rolesUser = useAppSelector((state) => state.auth.roles);
  switch (status) {
    case 7:
      return (
        <Space size={16}>
          <Button
            loading={loading}
            className="btn-saveDraft"
            onClick={() => handleChangeStatus(1)}
          >
            <FileOutlined />
            {t('system.saveDraft')}
          </Button>
          <Button
            loading={loading}
            disabled={!rolesUser.includes('*') && !isApprove}
            className="btn-approved"
            onClick={() => handleChangeStatus(13)}
          >
            <FileDoneOutlined />
            {t('system.saveApproved')}
          </Button>
        </Space>
      );
    case 13:
      return (
        <Space size={16}>
          <Button
            loading={loading}
            className="btn-saveDraft"
            onClick={() => handleChangeStatus(1)}
          >
            <FileOutlined />
            {t('system.saveDraft')}
          </Button>
          <Button
            loading={loading}
            className="btn-sendApprove"
            onClick={() => handleChangeStatus(7)}
          >
            <FileAddOutlined />
            {t('system.sendApprove')}
          </Button>
        </Space>
      );
    default:
      return (
        <Button
          loading={loading}
          className="btn-sendApprove"
          onClick={() => handleChangeStatus(7)}
        >
          <FileAddOutlined />
          {t('system.sendApprove')}
        </Button>
      );
  }
};

export default StatusLabel;

export enum StatusHandleLabelType {
  waiting = 1,
  processing = 2,
  done = 3,
}

export type StatusHandleLabelCode = keyof typeof StatusHandleLabelType;

type StatusHandleLabelProps = {
  status: StatusHandleLabelType;
  bigger?: boolean;
};

export const StatusHandleLabel: React.FC<StatusHandleLabelProps> = ({ status, bigger }) => {
  const { t } = useTranslation();
  return (
    <div className={mapModifiers('m-statusLabel_handle', StatusHandleLabelType[status], bigger && 'bigger')}>
      <span>{bigger ? `${t('system.status')}: ` : ''}</span>
      <b>{t(`system.${StatusHandleLabelType[status]}HandleStatus`)}</b>
    </div>
  );
};

type StatusHandleButtonsProps = {
  loading?: boolean;
  status: StatusHandleLabelType;
  handleChangeStatus: (status: number) => void;
};

export const StatusHandleButtons: React.FC<StatusHandleButtonsProps> = ({
  loading,
  status,
  handleChangeStatus
}) => {
  const { t } = useTranslation();

  if (StatusHandleLabelType[status] === 'done') {
    return null;
  }

  const statusArr = Object.keys(StatusHandleLabelType)
    .filter((x) => isNaN(parseInt(x, 10)));
  const statusIdx = statusArr.indexOf(StatusHandleLabelType[status]);
  const nextCode = statusArr[statusIdx + 1];

  return (
    <Button
      loading={loading}
      className={mapModifiers('m-statusLabel_handle_btn', nextCode)}
      onClick={() => handleChangeStatus(parseInt(StatusHandleLabelType[nextCode as any], 10))}
    >
      {t(`system.${nextCode}HandleSave`)}
    </Button>
  );
};

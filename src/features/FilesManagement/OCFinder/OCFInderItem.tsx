/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unused-prop-types */
import {
  FileExcelFilled,
  FileFilled,
  FileImageFilled,
  FileMarkdownFilled,
  FilePdfFilled,
  FilePptFilled,
  FileTextFilled,
  FileWordFilled,
  FileZipFilled, FolderFilled, PlaySquareFilled,
} from '@ant-design/icons';
import { Input } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';

import { videoRegex } from '../services';

import styles from './item.module.css';

import useClickOutside from 'common/hooks/useClickOutside';
import { getImageURL, numberWithPrefix } from 'common/utils/functions';

export interface OCFinderData {
  id: number;
  // parent: string;
  name: string;
  path: string;
  isDirectory?: boolean;
  type: string;
  date: Date;
  size: number;
  thumbnail?: string;
  isCreate?: boolean;
  title?: string;
  alt?: string;
}

interface IOCFinderItemProps extends OCFinderData {
  active?: boolean;
  verticalView?: boolean;
  onClick?(id: number | string): void;
  onDoubleClick?(id: number | string): void;
  onDelete?: () => void;
  onRename?: () => void;
  onEdit?: () => void;
  onPreview?: () => void;
}

const ItemTypeIcon: Record<string, React.ComponentType> = {
  'application/pdf': FilePdfFilled,
  'text/plain': FileTextFilled,
  'image/gif': FileImageFilled,
  'image/jpeg': FileImageFilled,
  'image/png': FileImageFilled,
  'image/webp': FileImageFilled,
  'image/svg+xml': FileImageFilled,
  'text/x-markdown': FileMarkdownFilled,
  'text/markdown': FileMarkdownFilled,
  'application/vnd.ms-excel': FileExcelFilled,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileExcelFilled,
  'application/vnd.ms-powerpoint': FilePptFilled,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': FilePptFilled,
  'application/msword': FileWordFilled,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileWordFilled,
  'application/zip': FileZipFilled,
  'video/mp4': PlaySquareFilled
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

const preventDefault: React.MouseEventHandler = (e) => e.preventDefault();

export default function OCFInderItem({
  id, name, isDirectory, date, size, type, thumbnail, isCreate,
  active,
  verticalView,
  onClick, onDoubleClick, onDelete, onRename, onEdit, onPreview
}: IOCFinderItemProps) {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState('');
  const [isPopover, setIsPopover] = useState(false);

  const refOption = useRef<HTMLDivElement>(null);

  useClickOutside(refOption, () => isPopover && setIsPopover(false));

  const ItemIcon = useMemo(
    () => (isDirectory
      ? FolderFilled
      : ItemTypeIcon[type] ?? FileFilled),
    [isDirectory, type],
  );
  const tooltip = useMemo(
    () => `${name}\n${isDirectory ? '' : `${t('media.size')}: ${formatBytes(size)}\n`}${t('media.date')}: ${date}`,
    [date, isDirectory, name, size, t],
  );

  const handleClick = useCallback(() => onClick?.(id), [id, onClick]);
  const handleDblClick = useCallback(() => onDoubleClick?.(id), [id, onDoubleClick]);

  useEffect(() => {
    (async () => {
      if (thumbnail) {
        setImgSrc(getImageURL(thumbnail));
      } else {
        setImgSrc('');
      }
    })();
  }, [thumbnail]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className={classNames({
        [styles.container]: true,
        [styles.active]: active,
        [styles.vertical]: verticalView
      })}
      title={tooltip}
      onClick={() => {
        if (isPopover) {
          setIsPopover(false);
        }
        handleClick();
      }}
      onDoubleClick={handleDblClick}
      onMouseDown={preventDefault}
      onContextMenu={(e) => {
        e.preventDefault();
        setIsPopover(true);
      }}
      ref={refOption}
      role="button"
      tabIndex={-1}
      key={`folder-${id.toString()}`}
    >
      {thumbnail && !videoRegex.test(type) ? (
        <div className={styles.thumbnail} style={{ backgroundImage: `url(${imgSrc})` }}>
          <img
            src={`${imgSrc}`}
            className={styles.thumbnail_image}
            alt={name}
          />
        </div>
      )
        : <ItemIcon style={{ fontSize: verticalView ? '24px' : '56px' }} />}
      <div className={styles.filename}>
        {isCreate ? <Input /> : name}
      </div>
      {verticalView && (
        <>
          <div className={styles.date}>
            {moment(date).format('D MMM YYYY [at] kk:mm')}
          </div>
          <div className={styles.size}>
            {size ? `${numberWithPrefix(Math.round(size / 1000))} KB` : ''}
          </div>
        </>
      )}
      <div className={classNames({ [styles.popover]: true, [styles.active]: isPopover })}>
        {onPreview && (
          <p onClick={() => {
            onPreview();
            setIsPopover(false);
          }}
          >
            {t('media.preview')}
          </p>
        )}
        {onDelete && (
          <p onClick={() => {
            onDelete();
            setIsPopover(false);
          }}
          >
            {t('media.delete')}
          </p>
        )}
        {onRename && (
          <p onClick={() => {
            onRename();
            setIsPopover(false);
          }}
          >
            {t('media.rename')}
          </p>
        )}
        {onEdit && (
          <p onClick={() => {
            onEdit();
            setIsPopover(false);
          }}
          >
            {t('media.edit')}
          </p>
        )}
      </div>
    </div>
  );
}

OCFInderItem.defaultProps = {
  isDirectory: false,
  active: false,
  thumbnail: undefined,
  onClick: undefined,
  onDoubleClick: undefined,
  verticalView: undefined,
  isCreate: undefined,
  title: undefined,
  alt: undefined,
};

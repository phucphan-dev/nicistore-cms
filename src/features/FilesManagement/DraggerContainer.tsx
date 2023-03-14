import { InboxOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal';
import Progress from 'antd/lib/progress';
import Dragger from 'antd/lib/upload/Dragger';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { FineUploaderBasic } from 'fine-uploader/lib/core';
import React, {
  useEffect, useMemo, useState
} from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from 'app/store';
import { refreshTokenService } from 'common/services/authenticate';
import { getAccessToken, setAccessToken, setRefreshToken } from 'common/services/common/storage';
import { URL_CONST } from 'common/utils/constant';
import { formatBytes } from 'common/utils/functions';

type DraggerContainerProps = {
  folderId?: number;
  isOpen?: boolean;
  handleClose?: () => void;
  handleUploadSuccess?: () => void;
};

type FileUploaded = {
  id: string;
  status: 'done' | 'error',
  success?: string;
  error?: string;
};

const DraggerContainer: React.FC<DraggerContainerProps> = ({
  folderId,
  isOpen,
  handleClose,
  handleUploadSuccess,
}) => {
  /* Hooks */
  const { t } = useTranslation();

  /* Selectors */
  const media = useAppSelector((state) => state.system.initialData?.media);

  /* States */
  const [percent, setPercent] = useState<number>(0);
  const [fileList, setFileList] = useState<{
    all: UploadFile[];
    validList: UploadFile[];
  }>({
    all: [],
    validList: [],
  });
  const [uploadList, setUploadList] = useState<FileUploaded[]>([]);

  const token = getAccessToken();
  const uploader = new FineUploaderBasic({
    autoUpload: false,
    request: {
      endpoint: URL_CONST.MEDIA_FILE_UPLOAD_CHUNK,
      customHeaders: {
        Authorization: `Bearer ${token}`,
      },
    },
    chunking: {
      enabled: true,
      mandatory: true,
      partSize: 1000000, // 1MB,
      success: {
        jsonPayload: true,
        endpoint: URL_CONST.MEDIA_FILE_MERGE_CHUNK,
        params(fileId: number) {
          const uuid = uploader.getUuid(fileId);
          const fileName = (uploader.getFile(fileId) as File).name;
          return {
            qquuid: uuid,
            qqfilename: fileName,
            folderId: folderId === -1 ? null : folderId,
          };
        }
      },
    },
    callbacks: {
      onTotalProgress(totalUploadedBytes: number, totalBytes: number) {
        if (!!totalUploadedBytes && !!totalUploadedBytes) {
          setPercent(totalUploadedBytes / totalBytes * 100);
        }
      },
      onComplete(id: number, name: string, res: {
        success: boolean;
        data?: Object;
      }, xhr: XMLHttpRequest) {
        const file = (uploader.getFile(id) as UploadFile);
        if (!res.success) {
          const errors = JSON.parse(xhr.response).errors as ErrorResponse[];
          setUploadList((prev) => [...prev, { id: file.uid, status: 'error', error: errors[0].message }]);
        } else {
          setUploadList((prev) => [...prev, { id: file.uid, status: 'done', success: 'true' }]);
        }
      },
      onError: async (id: number, name: string, errorReason: string, xhr: XMLHttpRequest) => {
        if (xhr.status === 401) {
          await refreshTokenService()
            .then((data) => {
              setAccessToken(data.accessToken);
              setRefreshToken(data.refreshToken);
              uploader.setCustomHeaders({ Authorization: `Bearer ${data.accessToken}` });
              uploader.retry(id);
            });
        }
      },
    }
  });

  const handleChangeFileList = (info: UploadChangeParam<UploadFile>) => {
    const list: UploadFile[] = [...info.fileList].map((file) => {
      //* Check valid image size file
      if (media?.image?.uploadMaxSize && file.type?.includes('image')) {
        if (!((file.size || 0) < media?.image?.uploadMaxSize)) {
          return {
            ...file,
            status: 'error',
            error: {
              message: `${t('media.invalidMaximumFileSize')} ${formatBytes(media?.image?.uploadMaxSize)}`,
            }
          };
        }
      }

      return { ...file };
    });
    setPercent(0);
    setFileList({ all: [...list], validList: [...list].filter((v) => v.status !== 'error') });
  };

  const handleCloseModal = () => {
    setFileList({
      all: [],
      validList: [],
    });
    setUploadList([]);
    setPercent(0);
    if (handleClose) {
      handleClose();
    }
  };

  const handleUpload = async () => {
    let list: UploadFile[] = [];
    //* Filter exclude uploaded file
    if (uploadList.length > 0) {
      const ids = uploadList.map((ele) => ele.id);
      list = fileList.validList.filter((v) => !ids.includes(v.uid));
    } else {
      list = fileList.validList;
    }
    uploader.addFiles(list.map((ele) => ele.originFileObj));
    uploader.uploadStoredFiles();
  };

  const itemList = useMemo(() => {
    let list: UploadFile[] = [];
    list = [...fileList.all].map((ele) => {
      const uploadedEle = uploadList.find((item) => item.id === ele.uid);
      if (uploadedEle) {
        return {
          ...ele,
          status: uploadedEle.status,
          ...uploadedEle.error && { error: { message: uploadedEle.error } },
        };
      }
      return { ...ele };
    });
    return list;
  }, [fileList, uploadList]);

  useEffect(() => {
    if (uploadList.length && fileList.validList
      && uploadList.length === fileList.validList.length && handleUploadSuccess) {
      handleUploadSuccess();
      setFileList({
        all: [],
        validList: [],
      });
      setUploadList([]);
      setPercent(0);
    }
  }, [fileList, handleUploadSuccess, uploadList]);

  return (
    <Modal
      visible={isOpen}
      width="60vw"
      closable={false}
      onCancel={handleCloseModal}
      onOk={handleUpload}
      okButtonProps={{ disabled: !fileList.validList.length }}
      okText={!fileList.validList.length ? undefined : `Tải lên ${fileList.validList.length} tệp`}
      cancelText="Đóng"
    >
      {!!percent && (
        <div className="t-uploadModal_progress">
          <Progress percent={Math.round(percent)} size="small" />
        </div>
      )}
      <div className="t-uploadModal_dragger">
        <Dragger
          multiple
          beforeUpload={() => false}
          fileList={itemList}
          onChange={handleChangeFileList}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t('media.dndText')}</p>
          <p className="ant-upload-hint">
            {t('media.dndSubText')}
          </p>
        </Dragger>
      </div>
      {/* <div className="t-uploadModal_preview">
        {fileList.map((item, idx) => item.originFileObj
          && (
            <div className="t-uploadModal_image" key={`uploadModal_preview${idx.toString()}`}>
              <Image
                src={URL.createObjectURL(item.originFileObj)}
                ratio="3x2"
              />
            </div>
          ))}
      </div> */}
    </Modal>
  );
};

export default DraggerContainer;

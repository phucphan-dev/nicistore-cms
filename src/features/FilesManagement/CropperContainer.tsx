import {
  CheckOutlined,
  DownloadOutlined, MinusOutlined, PlusOutlined, RollbackOutlined, SaveOutlined, SwapOutlined
} from '@ant-design/icons';
import {
  Button, Card, Checkbox, Col, Collapse, Divider,
  Image, InputNumber, message, Progress, Row, Slider, Space, Typography
} from 'antd';
import { FineUploaderBasic } from 'fine-uploader/lib/core';
import moment from 'moment';
import React, {
  useCallback, useEffect, useState, useMemo, useRef
} from 'react';
import { Cropper } from 'react-cropper';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { OCFinderData } from './OCFinder/OCFInderItem';

import Input from 'common/components/Input';
import { refreshTokenService } from 'common/services/authenticate';
import { getAccessToken, setAccessToken, setRefreshToken } from 'common/services/common/storage';
import { updateInfoFileService } from 'common/services/mediaFolder';
import { UpdateInfoFileParams } from 'common/services/mediaFolder/types';
import { URL_CONST } from 'common/utils/constant';
import mapModifiers, { downloadFile } from 'common/utils/functions';

type CropperContainerProps = {
  folderId: number;
  fileInfo?: OCFinderData;
  file?: File;
  handleClose?: () => void;
};

type UpdateInfoFileTypes = {
  title?: string;
  alt?: string;
};

const CropperContainer: React.FC<CropperContainerProps> = ({
  folderId, fileInfo, file, handleClose
}) => {
  const { t } = useTranslation();
  const token = getAccessToken();

  const method = useForm<UpdateInfoFileTypes>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      alt: ''
    }
  });

  const cropButtons = [
    {
      label: 'Freefrom',
      value: 'free',
      icon: <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M9 3v4h13a3 3 0 0 1 2.995 2.824L25 10v13h4v2h-4v4h-2v-4H10a3 3 0 0 1-2.995-2.824L7 22V9H3V7h4V3h2zm0 6v13a1 1 0 0 0 .883.993L10 23h13V10a1 1 0 0 0-.883-.993L22 9H9z" fillRule="evenodd" /></svg>
    },
    {
      label: '1x1',
      value: '1x1',
      icon: <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M25 3a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h18zm0 1.5H7a2.5 2.5 0 0 0-2.495 2.336L4.5 7v18a2.5 2.5 0 0 0 2.336 2.495L7 27.5h18a2.5 2.5 0 0 0 2.495-2.336L27.5 25V7a2.5 2.5 0 0 0-2.336-2.495L25 4.5z" fillRule="evenodd" /></svg>
    },
    {
      label: '3x2',
      value: '3x2',
      icon: <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M26 7a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4h20zm0 1.5H6a2.5 2.5 0 0 0-2.495 2.336L3.5 11v10a2.5 2.5 0 0 0 2.336 2.495L6 23.5h20a2.5 2.5 0 0 0 2.495-2.336L28.5 21V11a2.5 2.5 0 0 0-2.336-2.495L26 8.5z" fillRule="evenodd" /></svg>
    },
    {
      label: '2x3',
      value: '2x3',
      icon: <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M25 26a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v20zm-1.5 0V6a2.5 2.5 0 0 0-2.336-2.495L21 3.5H11a2.5 2.5 0 0 0-2.495 2.336L8.5 6v20a2.5 2.5 0 0 0 2.336 2.495L11 28.5h10a2.5 2.5 0 0 0 2.495-2.336L23.5 26z" fillRule="evenodd" /></svg>
    },
    {
      label: '4x3',
      value: '4x3',
      icon: <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M27 5a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h22zm0 1.5H5a2.5 2.5 0 0 0-2.495 2.336L2.5 9v14a2.5 2.5 0 0 0 2.336 2.495L5 25.5h22a2.5 2.5 0 0 0 2.495-2.336L29.5 23V9a2.5 2.5 0 0 0-2.336-2.495L27 6.5z" fillRule="evenodd" /></svg>
    },
    {
      label: '3x4',
      value: '3x4',
      icon: <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M27 27a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V5a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v22zm-1.5 0V5a2.5 2.5 0 0 0-2.336-2.495L23 2.5H9a2.5 2.5 0 0 0-2.495 2.336L6.5 5v22a2.5 2.5 0 0 0 2.336 2.495L9 29.5h14a2.5 2.5 0 0 0 2.495-2.336L25.5 27z" fillRule="evenodd" /></svg>
    },
    {
      label: '16x9',
      value: '16x9',
      icon: <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M26 8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-8a4 4 0 0 1 4-4h20zm0 1.5H6a2.5 2.5 0 0 0-2.495 2.336L3.5 12v8a2.5 2.5 0 0 0 2.336 2.495L6 22.5h20a2.5 2.5 0 0 0 2.495-2.336L28.5 20v-8a2.5 2.5 0 0 0-2.336-2.495L26 9.5z" fillRule="evenodd" /></svg>
    },
    {
      label: '9x16',
      value: '9x16',
      icon: <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M24 26a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v20zm-1.5 0V6a2.5 2.5 0 0 0-2.336-2.495L20 3.5h-8a2.5 2.5 0 0 0-2.495 2.336L9.5 6v20a2.5 2.5 0 0 0 2.336 2.495L12 28.5h8a2.5 2.5 0 0 0 2.495-2.336L22.5 26z" fillRule="evenodd" /></svg>
    },
    {
      label: 'Original',
      value: 'original',
      icon: <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M25 3a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h18zm0 1.5H7a2.5 2.5 0 0 0-2.495 2.336L4.5 7v18a2.5 2.5 0 0 0 2.336 2.495L7 27.5h18a2.5 2.5 0 0 0 2.495-2.336L27.5 25V7a2.5 2.5 0 0 0-2.336-2.495L25 4.5zM18.572 14a5.429 5.429 0 0 1 4.78 8H8.08a4.868 4.868 0 0 1-.08-.857 4.857 4.857 0 0 1 4.857-4.857c.41 0 .806.056 1.186.152A5.42 5.42 0 0 1 18.572 14zM11 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fillRule="evenodd" /></svg>
    },
  ];
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [percent, setPercent] = useState<number>(0);
  const [cropData, setCropData] = useState<string>();
  const [cropper, setCropper] = useState<Cropper>();
  const [active, setActive] = useState('free');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isKeep, setIsKeep] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const [enableDownload, setEnableDownload] = useState(false);
  const [zoom, setZoom] = useState(0.5);
  const [uploadError, setUploadError] = useState(false);

  const ratioCrop = useRef<number>(0);

  // Resizer
  const [imageResizer, setImageResizer] = useState<HTMLImageElement | undefined>(undefined);
  const [isResize, setIsResize] = useState(false);
  const [widthResize, setWidthResize] = useState(0);
  const [heightResize, setHeightResize] = useState(0);
  const [quality, setQuality] = useState(100);
  const [isKeepResize, setIsKeepResize] = useState(true);

  const canvasResizer = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setCropData(file ? URL.createObjectURL(file) : undefined);
  }, [file]);

  useEffect(() => {
    if (cropper) {
      setTimeout(() => {
        const nW = Math.round(cropper.getImageData().naturalWidth);
        const nH = Math.round(cropper.getImageData().naturalHeight);
        const ratio = nW / cropper.getImageData().width;
        setNaturalWidth(nW);
        setNaturalHeight(nH);
        setWidthResize(nW);
        setHeightResize(nH);
        setWidth(Math.round(cropper.getCropBoxData().width * ratio));
        setHeight(Math.round(cropper.getCropBoxData().height * ratio));
        ratioCrop.current = ratio;
      }, 150);
    }
  }, [cropper]);

  useEffect(() => {
    if (file) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      setImageResizer(img);
    }
  }, [file]);

  const drawImageResizer = useCallback(() => {
    const ctx = canvasResizer.current?.getContext('2d');
    if (ctx && imageResizer) {
      ctx.canvas.width = widthResize;
      ctx.canvas.height = heightResize;
      ctx.drawImage(imageResizer, 0, 0, widthResize, heightResize);
    }
  }, [heightResize, imageResizer, widthResize]);

  useEffect(() => {
    drawImageResizer();
  }, [drawImageResizer]);

  const resizeImage = () => {
    canvasResizer.current?.toBlob((blob) => {
      if (blob) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        setImageResizer(img);
      }
    }, 'image/jpeg', quality / 100);
    drawImageResizer();
  };

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.getCroppedCanvas(
        { width, height, imageSmoothingEnabled: false }
      ).toDataURL(file?.type));
      setEnableDownload(true);
    }
  };

  const applyCropSize = useCallback((size: string) => {
    if (!cropper) {
      return;
    }
    const imageData = cropper.getImageData();
    if (size === 'free') {
      setIsKeep(false);
      cropper?.setAspectRatio(NaN);
    } else {
      setIsKeep(true);
    }
    setActive(size);
    switch (size) {
      case 'free':
        cropper.setAspectRatio(NaN);
        break;
      case 'original':
        cropper.setAspectRatio(imageData.width / imageData.height);
        break;
      case '1x1':
        cropper.setAspectRatio(1);
        break;
      case '2x3':
        cropper.setAspectRatio(2 / 3);
        break;
      case '3x2':
        cropper.setAspectRatio(3 / 2);
        break;
      case '3x4':
        cropper.setAspectRatio(3 / 4);
        break;
      case '4x3':
        cropper.setAspectRatio(4 / 3);
        break;
      case '16x9':
        cropper.setAspectRatio(16 / 9);
        break;
      case '9x16':
        cropper.setAspectRatio(9 / 16);
        break;
      default:
        break;
    }
    setWidth(Math.round(cropper.getCropBoxData().width * ratioCrop.current));
    setHeight(Math.round(cropper.getCropBoxData().height * ratioCrop.current));
    setEnableDownload(false);
  }, [cropper]);

  const swapSize = () => {
    if (!cropper) {
      return;
    }
    const w = width;
    cropper.setAspectRatio(height / w);
    setWidth(parseInt(height.toFixed(), 10));
    setHeight(parseInt(w.toFixed(), 10));
  };

  const reset = useCallback(() => {
    cropper?.reset();
    setEnableDownload(false);
    setCropData(file ? URL.createObjectURL(file) : undefined);
    applyCropSize('free');
    setPercent(0);
    setUploadError(false);
    setWidthResize(naturalWidth);
    setHeightResize(naturalHeight);
  }, [applyCropSize, cropper, file, naturalHeight, naturalWidth]);

  const uploader = useMemo(() => new FineUploaderBasic({
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
        params(id: number) {
          const uuid = uploader.getUuid(id);
          return {
            qquuid: uuid,
            qqfilename: `${file?.name}.${file?.type.split('/')[1]}`,
            folderId: folderId === -1 ? null : folderId,
          };
        }
      },
    },
    callbacks: {
      onTotalProgress(totalUploadedBytes: number, totalBytes: number) {
        setPercent(totalUploadedBytes / totalBytes * 100);
      },
      onComplete(id: number, name: string, res: {
        success: boolean;
        data?: Object;
      }) {
        if (res.success && handleClose) {
          message.success(t('media.saved'));
          handleClose();
          reset();
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
            }).catch(() => {
              setUploadError(true);
              message.error(t('media.something_wrong'));
            });
        }
      },
    }
  }), [file?.name, file?.type, folderId, handleClose, reset, t, token]);

  const handleSaveImage = useCallback(() => {
    if (isResize) {
      canvasResizer.current?.toBlob((blob) => {
        uploader.addFiles(blob);
        uploader.uploadStoredFiles();
      }, 'image/jpeg', quality / 100);
    } else if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        uploader.addFiles(blob);
        uploader.uploadStoredFiles();
      }, 'image/jpeg');
    }
  }, [cropper, isResize, quality, uploader]);

  const { mutate: updateInfoFileMutate, isLoading: updateLoading } = useMutation(
    'updateNewsById',
    async (data: UpdateInfoFileParams) => updateInfoFileService(data),
    {
      onSuccess: () => {
        message.success(t('media.updateSuccess'));
      },
      onError: () => {
        message.error(t('media.updateError'));
      }
    }
  );

  const handleUpdateInfo = async () => {
    if (fileInfo) {
      const { title, alt } = method.getValues();
      updateInfoFileMutate({ id: fileInfo.id, title, alt });
    }
  };

  useEffect(() => {
    method.reset({ title: fileInfo?.title, alt: fileInfo?.alt });
  }, [fileInfo, method]);

  return (
    <div className="t-cropperImage_container">
      <Row gutter={16} style={{ width: '100%' }}>
        <Col xxl={5} xl={6} style={{ overflowY: 'auto', height: '100%' }}>
          {cropper && (
            <div className="t-cropperImage_container_sidebar">
              <Collapse
                accordion
                expandIconPosition="right"
                bordered={false}
                destroyInactivePanel
                defaultActiveKey={['1']}
                onChange={(key) => {
                  if (key === '2') {
                    setIsResize(true);
                    drawImageResizer();
                  } else {
                    setIsResize(false);
                  }
                }}
              >
                <Collapse.Panel header={t('media.cropTitleText')} key="1">
                  <div className="t-cropperImage_container_buttons">
                    {
                      cropButtons.map((item, index) => (
                        <Button
                          key={`croppButton-${index.toString()}`}
                          type="primary"
                          className={mapModifiers('cropper_button', active === item.value && 'active')}
                          onClick={() => applyCropSize(item.value)}
                        >
                          {item.icon}
                          <p>{item.label}</p>
                        </Button>
                      ))
                    }
                  </div>
                  <div className="t-cropperImage_container_rotates">
                    <Button type="primary" className="cropper_button" onClick={() => cropper?.rotate(-45)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white">
                        <path fillRule="evenodd" d="M0 6V0l2.05 2.05C3.611.488 5.907-.338 8.375.131c2.741.521 4.955 2.723 5.488 5.463A7.007 7.007 0 0 1 7 14a6.974 6.974 0 0 1-4.95-2.05l1.416-1.416a4.995 4.995 0 0 0 4.379 1.396c1.983-.326 3.627-1.883 4.041-3.85A5.01 5.01 0 0 0 7 2a4.988 4.988 0 0 0-3.534 1.466L6 6H0z" />
                      </svg>
                      <p>{t('media.rotate_left')}</p>
                    </Button>
                    <Button type="primary" className="cropper_button" onClick={() => cropper?.rotate(45)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white"><path fillRule="evenodd" d="M14 6V0l-2.05 2.05a7 7 0 1 0 0 9.9l-1.416-1.416A4.988 4.988 0 0 1 7 12c-2.757 0-5-2.243-5-5s2.243-5 5-5c1.378 0 2.628.561 3.534 1.466L8 6h6z" /></svg>
                      <p>{t('media.rotate_right')}</p>
                    </Button>
                    <Button
                      type="primary"
                      className="cropper_button"
                      onClick={() => {
                        cropper?.scaleX(isHorizontal ? 1 : -1);
                        setIsHorizontal(!isHorizontal);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" fill="white"><path fillRule="evenodd" d="M0 6.999l4-4v8L0 7zM10.184 11V3l4 4-4 4zm-4.185 3V0H8v14H5.999z" /></svg>
                      <p>{t('media.flip_horizontal')}</p>
                    </Button>
                    <Button
                      type="primary"
                      className="cropper_button"
                      onClick={() => {
                        cropper?.scaleY(isVertical ? 1 : -1);
                        setIsVertical(!isVertical);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white"><path fillRule="evenodd" d="M7 0l4 4H3l4-4zM3 10h8l-4 4-4-4zM0 8V6h14v2H0z" /></svg>
                      <p>{t('media.flip_vertical')}</p>
                    </Button>
                  </div>
                  <div className="t-cropperImage_container_size">
                    <InputNumber
                      value={width}
                      onChange={(value) => setWidth(value)}
                      controls={false}
                    />
                    <Typography.Text>X</Typography.Text>
                    <InputNumber
                      value={height}
                      onChange={(value) => setHeight(value)}
                      controls={false}
                    />
                    <Button type="primary" className="cropper_button" onClick={swapSize}><SwapOutlined /></Button>
                  </div>
                  <Checkbox
                    checked={isKeep}
                    style={{ marginTop: 16 }}
                    onChange={(e) => {
                      if (e.target.checked) {
                        cropper?.setAspectRatio(
                          cropper.getCroppedCanvas().width / cropper.getCroppedCanvas().height
                        );
                      } else {
                        cropper?.setAspectRatio(NaN);
                      }
                      setIsKeep(e.target.checked);
                    }}
                  >
                    {t('media.keepRatio')}
                  </Checkbox>
                </Collapse.Panel>
                <Collapse.Panel header={t('media.reSize')} key="2">
                  <div>
                    <Typography.Text>
                      {t('media.width')}
                    </Typography.Text>
                    <Input
                      type="number"
                      value={widthResize}
                      onChange={(e) => {
                        setWidthResize(Number(e.currentTarget.value));
                        if (isKeepResize) {
                          setHeightResize(Math.floor(
                            Number(e.currentTarget.value) * naturalHeight / naturalWidth
                          ));
                        }
                      }}
                    />
                  </div>
                  <div className="u-mt-16">
                    <Typography.Text>
                      {t('media.height')}
                    </Typography.Text>
                    <Input
                      type="number"
                      value={heightResize}
                      onChange={(e) => {
                        setHeightResize(Number(e.currentTarget.value));
                        if (isKeepResize) {
                          setWidthResize(Math.floor(
                            Number(e.currentTarget.value) * naturalWidth / naturalHeight
                          ));
                        }
                      }}
                    />
                  </div>
                  <div className="u-mt-16">
                    <Typography.Text>
                      {t('media.quality')}
                    </Typography.Text>
                    <Slider
                      value={quality}
                      tipFormatter={(value) => (value || 0) / 100}
                      onChange={(value) => setQuality(value)}
                    />
                  </div>
                  <Checkbox
                    checked={isKeepResize}
                    style={{ marginTop: 16 }}
                    onChange={(e) => {
                      setIsKeepResize(e.target.checked);
                      setHeightResize(Math.floor(
                        widthResize * naturalHeight / naturalWidth
                      ));
                    }}
                  >
                    {t('media.keepRatio')}
                  </Checkbox>
                </Collapse.Panel>
              </Collapse>
              <div className="u-mt-32">
                <Card bodyStyle={{ padding: '16px' }}>
                  <div className="t-cropperImage_container_rotates">
                    <Button
                      type="primary"
                      disabled={enableDownload}
                      className="cropper_button"
                      onClick={() => (isResize ? resizeImage() : getCropData())}
                    >
                      <CheckOutlined />
                      {t('media.apply')}
                    </Button>
                    <Button
                      type="primary"
                      className="cropper_button"
                      disabled={!enableDownload && !isResize}
                      onClick={() => {
                        if (isResize && canvasResizer.current) {
                          downloadFile(canvasResizer.current.toDataURL(file?.type), `${file?.name}.${file?.type.split('/')[1]}`);
                        } else if (cropData) {
                          downloadFile(cropData, `${file?.name}.${file?.type.split('/')[1]}`);
                        }
                      }}
                    >
                      <DownloadOutlined />
                      {t('media.download')}
                    </Button>
                    <Button
                      type="primary"
                      danger
                      className="cropper_button"
                      onClick={reset}
                    >
                      <RollbackOutlined />
                      {t('media.reset')}
                    </Button>
                    <Button className="cropper_button" disabled={!enableDownload && !isResize} onClick={handleSaveImage}>
                      <SaveOutlined />
                      {t('media.save')}
                    </Button>
                    {percent > 0 && <Progress percent={Math.round(percent)} size="small" status={uploadError ? 'exception' : 'success'} />}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </Col>
        <Col xxl={19} xl={18} style={{ height: '100%' }}>
          <div className="t-cropperImage_container_main">
            <div className="t-cropperImage_container_cropper">
              <canvas ref={canvasResizer} className="t-cropperImage_container_resizer" style={{ visibility: isResize ? 'visible' : 'hidden' }} />
              {!isResize && (enableDownload ? <div className="t-cropperImage_result"><Image src={cropData} /></div>
                : (
                  <>
                    <Cropper
                      className="t-cropperImage_container_instance"
                      preview=".t-cropperImage_container_preview"
                      src={cropData}
                      viewMode={2}
                      dragMode="move"
                      responsive
                      guides
                      zoomTo={0}
                      center
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                      cropend={(e) => {
                        const box = e.currentTarget.cropper.getCropBoxData();
                        setWidth(Math.round(box.width * ratioCrop.current));
                        setHeight(Math.round(box.height * ratioCrop.current));
                      }}
                    />
                    {cropper && (
                      <div className="t-cropperImage_container_controls">
                        <div className="t-cropperImage_container_controls_size">
                          <Typography.Text>
                            {`${naturalWidth}px X ${naturalHeight}px`}
                          </Typography.Text>
                        </div>
                        <Space>
                          <Button
                            icon={<MinusOutlined />}
                            onClick={() => {
                              if (zoom > 0.5) {
                                cropper.zoom(-0.1);
                                setZoom(zoom - 0.1);
                              }
                            }}
                          />
                          <Typography.Text>
                            {Math.round(zoom * 200)}
                            {' '}
                            %
                          </Typography.Text>
                          <Button
                            icon={<PlusOutlined />}
                            onClick={() => {
                              cropper.zoom(0.1);
                              setZoom(zoom + 0.1);
                            }}
                          />
                        </Space>
                      </div>
                    )}
                  </>
                )
              )}
            </div>
            <div className="t-cropperImage_container_preview_wrap">
              {!isResize && (
                <>
                  <div
                    className="t-cropperImage_container_preview"
                    style={{ width: '100%', height: '400px' }}
                  />
                  <Divider />
                </>
              )}
              <Typography.Title level={3}>{t('media.information')}</Typography.Title>
              {cropper && (
                <div className="t-cropperImage_info">
                  <p><Typography.Text type="secondary">{t('media.fileName')}</Typography.Text></p>
                  <p><Typography.Text style={{ overflowWrap: 'anywhere' }}>{file?.name}</Typography.Text></p>
                  <Row gutter={8} className="t-cropperImage_info_line">
                    <Col span={14}>
                      <p><Typography.Text type="secondary">{t('media.fileType')}</Typography.Text></p>
                      <p><Typography.Text>{file?.type}</Typography.Text></p>
                    </Col>
                    <Col span={10}>
                      <p><Typography.Text type="secondary">{t('media.fileSize')}</Typography.Text></p>
                      <p>
                        <Typography.Text>
                          {file ? Math.round(file.size / 1000) : 0}
                          {' '}
                          KB
                        </Typography.Text>
                      </p>
                    </Col>
                  </Row>
                  <Row gutter={8} className="t-cropperImage_info_line">
                    <Col span={14}>
                      <p><Typography.Text type="secondary">{t('media.fileModification_date')}</Typography.Text></p>
                      <p><Typography.Text>{file?.lastModified && moment(file?.lastModified).format('H:mm, DD/MM/YYYY')}</Typography.Text></p>
                    </Col>
                    <Col span={10}>
                      <p><Typography.Text type="secondary">{t('media.fileResolution')}</Typography.Text></p>
                      <p>
                        <Typography.Text>
                          {naturalWidth}
                          {' '}
                          X
                          {' '}
                          {naturalHeight}
                        </Typography.Text>
                      </p>
                    </Col>
                  </Row>
                  <div className="u-mt-32">
                    <Typography.Text strong>
                      {t('media.fileTitle')}
                      {' '}
                    </Typography.Text>
                    <Controller
                      name="title"
                      control={method.control}
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Input
                          className="u-mt-8"
                          name="title"
                          value={value}
                          onChange={onChange}
                          error={error?.message}
                          size="large"
                        />
                      )}
                    />
                  </div>
                  <div className="u-mt-16">
                    <Typography.Text strong>
                      {t('media.altTitle')}
                      {' '}
                    </Typography.Text>
                    <Controller
                      name="alt"
                      control={method.control}
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Input
                          className="u-mt-8"
                          name="alt"
                          value={value}
                          onChange={onChange}
                          error={error?.message}
                          size="large"
                        />
                      )}
                    />
                    <Button
                      loading={updateLoading}
                      className="u-mt-16"
                      type="primary"
                      onClick={method.handleSubmit(handleUpdateInfo)}
                    >
                      {t('media.save')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CropperContainer;

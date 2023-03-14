import {
  EditOutlined, DeleteOutlined, FileImageOutlined, LinkOutlined, PlusCircleOutlined
} from '@ant-design/icons';
import {
  Typography,
  Image,
  Button,
  message,
} from 'antd';
import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import {
  DragDropContext, Draggable, DropResult,
} from 'react-beautiful-dnd';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Input from '../Input';

import {
  getItemStyle, getListStyle, reorder, StrictModeDroppable
} from './functions';

import { useAppSelector } from 'app/store';
import { mappingURLToExternal } from 'common/utils/functions';
import roles from 'configs/roles';
import ModalFinder from 'features/FilesManagement/ModalFinder';

interface SelectFileProps {
  name?: string;
  value?: string;
  title: React.ReactNode;
  isRequired?: boolean;
  hasOptions?: boolean;
  titleName?: string;
  altName?: string;
  notImage?: boolean;
  handleDelete?: () => void;
  handleSelect?: (url: string, imgTitle?: string, alt?: string) => void;
}

const SelectFile: React.FC<SelectFileProps> = ({
  name,
  value,
  isRequired,
  title,
  hasOptions,
  titleName,
  altName,
  notImage,
  handleDelete,
  handleSelect,
}) => {
  const { t } = useTranslation();
  const rolesUser = useAppSelector((state) => state.auth.roles);
  const [open, setOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState(value);
  useEffect(() => {
    setFileUrl(value);
  }, [value]);
  if (!rolesUser.includes('*') && !rolesUser.includes(roles.FOLDER_VIEWALL)) {
    return null;
  }
  return (
    <div className="o-selectFile">
      <Typography.Text strong>
        {title}
        {' '}
        {isRequired && (
          <Typography.Text type="danger">
            *
          </Typography.Text>
        )}
      </Typography.Text>
      <div className="o-selectFile_wrapper">
        <div className="o-selectFile_imgWrapper">
          {fileUrl ? (
            <>
              {notImage ? (
                <div className="o-selectFile_file">
                  <Typography.Text>{fileUrl}</Typography.Text>
                </div>
              ) : (
                <Image
                  src={fileUrl}
                  preview={false}
                  alt="Image Upload"
                />
              )}
              <div className="o-selectFile_btnGroup">
                <Button
                  type="ghost"
                  shape="default"
                  icon={<LinkOutlined style={{ color: '#bfbfbf' }} />}
                  onClick={() => {
                    navigator.clipboard.writeText(mappingURLToExternal(fileUrl));
                    message.success('Copied!');
                  }}
                />
                <Button
                  type="ghost"
                  shape="default"
                  icon={<EditOutlined style={{ color: '#bfbfbf' }} />}
                  onClick={() => setOpen(true)}
                />
                <Button
                  type="ghost"
                  shape="default"
                  icon={<DeleteOutlined style={{ color: '#bfbfbf' }} />}
                  onClick={() => {
                    setFileUrl(undefined);
                    if (handleDelete) {
                      handleDelete();
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <div className="o-selectFile_empty" onClick={() => setOpen(true)}>
              <FileImageOutlined style={{ fontSize: 28 }} />
              <Typography.Title level={5} style={{ marginTop: 16 }}>
                {notImage ? t('system.selectFile') : t('system.selectImage')}
              </Typography.Title>
            </div>
          )}
        </div>
        <input type="text" hidden name={name} value={value} />
        {hasOptions && (
          <>
            <div className="u-mt-16">
              <Typography.Text strong>
                {t('system.title')}
              </Typography.Text>
              <Controller
                name={titleName || ''}
                defaultValue=""
                render={({
                  field: { value: fieldValue, onChange },
                  fieldState: { error },
                }) => (
                  <Input
                    className="u-mt-8"
                    name={titleName}
                    value={fieldValue}
                    onChange={onChange}
                    error={error?.message}
                    size="large"
                  />
                )}
              />
            </div>
            <div className="u-mt-16">
              <Typography.Text strong>
                {t('system.alt')}
              </Typography.Text>
              <Controller
                name={altName || ''}
                defaultValue=""
                render={({
                  field: { value: fieldValue, onChange },
                  fieldState: { error },
                }) => (
                  <Input
                    className="u-mt-8"
                    name={altName}
                    value={fieldValue}
                    onChange={onChange}
                    error={error?.message}
                    size="large"
                  />
                )}
              />
            </div>
          </>
        )}
      </div>
      <ModalFinder
        selected={fileUrl ? [fileUrl] : []}
        isOpen={open}
        handleSelectFile={(data) => {
          if (handleSelect) {
            handleSelect(data[0].path, data[0].title, data[0].alt);
          }
          setOpen(false);
        }}
        handleClose={() => setOpen(false)}
      />
    </div>
  );
};

interface SelectMultipleFileProps {
  value?: SelectImageData[];
  title: React.ReactNode;
  isRequired?: boolean;
  handleDelete?: (data: SelectImageData[]) => void;
  handleSelect?: (data: SelectImageData[]) => void;
}

type SelectFileDraggableType = {
  id: string;
} & SelectImageData;

export const SelectMultipleFile: React.FC<SelectMultipleFileProps> = ({
  value, title, isRequired, handleDelete, handleSelect
}) => {
  /* Hooks */
  const { t } = useTranslation();
  const rolesUser = useAppSelector((state) => state.auth.roles);

  /* Refs */
  const initRef = useRef(false);

  /* States */
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<SelectFileDraggableType[]>([]);

  /* Functions */
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      return;
    }

    const items = reorder(files, source.index, destination.index);
    setFiles(items);
    if (handleSelect) {
      handleSelect(items);
    }
  };

  /* Effects */
  useEffect(() => {
    if (value && !initRef.current) {
      setFiles(value.map((ele, idx) => ({
        id: `select-file-item-${idx}-${new Date().getTime()}`,
        ...ele,
      })));
      initRef.current = true;
    }
  }, [value]);

  /* Components */
  const MemoizedDraggableSelectedImage = useCallback((item: SelectFileDraggableType) => (
    <div className="o-selectFile_imgWrapper">
      <Image
        src={item.path}
        preview={false}
        alt={item.alt}
      />
      <div className="o-selectFile_btnGroup">
        <Button
          type="ghost"
          shape="default"
          icon={<LinkOutlined style={{ color: '#bfbfbf' }} />}
          onClick={() => {
            navigator.clipboard.writeText(mappingURLToExternal(item.path));
            message.success('Copied!');
          }}
        />
        <Button
          type="ghost"
          shape="default"
          icon={<DeleteOutlined style={{ color: '#bfbfbf' }} />}
          onClick={() => {
            const newData = files.filter((file) => file.id !== item.id);
            setFiles(newData);
            if (handleDelete) {
              handleDelete(newData);
            }
          }}
        />
      </div>
    </div>
  ), [files, handleDelete]);

  if (!rolesUser.includes(roles.FOLDER_VIEWALL)) {
    return null;
  }

  return (
    <div className="o-selectFile">
      <Typography.Title level={5} style={{ fontWeight: 400, fontSize: 14 }}>
        {title}
        {' '}
        {isRequired && (
          <Typography.Text strong type="danger">
            *
          </Typography.Text>
        )}
      </Typography.Title>
      <div className="o-selectFile_wrapper multiple">
        {files && files.length > 0 ? (
          <div className="o-selectFile_content">
            <div className="o-selectFile_content_draggable">
              <DragDropContext onDragEnd={onDragEnd}>
                <StrictModeDroppable
                  droppableId="select-file-droppable"
                  direction="horizontal"
                  renderClone={(draggableProvided, draggableSnapshot, rubric) => (
                    <div
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      ref={draggableProvided.innerRef}
                      className="o-selectFile_dnd_draggable"
                      style={getItemStyle(
                        draggableSnapshot.isDragging,
                        draggableProvided.draggableProps.style
                      )}
                    >
                      {MemoizedDraggableSelectedImage(files[rubric.source.index])}
                    </div>
                  )}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      className="o-selectFile_dnd_droppable"
                      style={getListStyle(snapshot.isDraggingOver)}
                      {...provided.droppableProps}
                    >
                      {files.map((item, idx) => (
                        <Draggable key={item.id} draggableId={item.id} index={idx}>
                          {(draggableProvided, draggableSnapshot) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              className="o-selectFile_dnd_draggable"
                              style={getItemStyle(
                                draggableSnapshot.isDragging,
                                draggableProvided.draggableProps.style
                              )}
                            >
                              {MemoizedDraggableSelectedImage(item)}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              </DragDropContext>
            </div>
            <div className="o-selectFile_content_add">
              <div className="o-selectFile_imgWrapper">
                <Button type="text" size="large" icon={<PlusCircleOutlined style={{ fontSize: 28 }} />} onClick={() => setOpen(true)} />
              </div>
            </div>
          </div>
        ) : (
          <div className="o-selectFile_empty" onClick={() => setOpen(true)}>
            <FileImageOutlined style={{ fontSize: 28 }} />
            <Typography.Title level={5} style={{ marginTop: 16 }}>
              {t('system.selectImage')}
            </Typography.Title>
          </div>
        )}
      </div>
      <ModalFinder
        selected={files ? files.map((item) => item.path) : []}
        isOpen={open}
        multiple
        handleSelectFile={(data) => {
          const convertedData = [...data].map((ele, idx) => ({
            id: `select-file-item-${idx}-${new Date().getTime()}`,
            ...ele,
          }));
          const newData = [...(files || []), ...convertedData];
          setFiles(newData);
          if (handleSelect) {
            handleSelect(newData);
          }
          setOpen(false);
        }}
        handleClose={() => setOpen(false)}
      />
    </div>
  );
};

export default SelectFile;

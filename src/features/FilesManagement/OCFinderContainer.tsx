import {
  Modal,
  TreeDataNode,
  Typography,
  notification,
  Image,
} from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import CropperContainer from './CropperContainer';
import DraggerContainer from './DraggerContainer';
import OCFinder, { OCFinderRoles } from './OCFinder';
import { OCFinderData } from './OCFinder/OCFInderItem';
import services, { imageRegex, videoRegex } from './services';

import Input from 'common/components/Input';
import { deleteFilesService } from 'common/services/mediaFolder';
import { MediaFolderDataType, ParamsIds } from 'common/services/mediaFolder/types';

type OCFinderContainerProps = {
  isModal?: boolean;
  multiple?: boolean;
  ocFinderRoles?: OCFinderRoles;
  handleSelectFile?: (data: SelectImageData[]) => void
};

const OCFinderContainer: React.FC<OCFinderContainerProps> = (
  {
    handleSelectFile, isModal, multiple, ocFinderRoles
  }
) => {
  const [filesData, setFilesData] = useState<MediaFolderDataType[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [tree, setTree] = useState<Array<TreeDataNode>>([]);
  const [content, setContent] = useState<Array<OCFinderData>>([]);
  const [path, setPath] = useState<Array<OCFinderData>>([]);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Array<OCFinderData>>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isUpload, setIsUpload] = useState(false);
  const [createParentId, setCreateParentId] = useState<string | number>();
  const [newDirName, setNewDirName] = useState<string>('');
  const [selectedListFolder, setSelectedListFolder] = useState<number[]>([]);
  const [selectedListFile, setSelectedListFile] = useState<number[]>([]);
  const [isDeleteOpenModal, setIsDeleteOpenModal] = useState<boolean>(false);
  const [isRenameModal, setRenameModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>(undefined);
  const [selectedContentId, setSelectedContentId] = useState<number | undefined>(-1);
  const [infoFileSelected, setInfoFileSelected] = useState<OCFinderData | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isTrash, setIsTrash] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<string | undefined>(undefined);
  const [previewVideo, setPreviewVideo] = useState<string | undefined>(undefined);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: fileDataRes, isLoading } = useQuery(
    ['getAllFolder'],
    () => services.getFolderData(),
  );

  const { data: itemListByFolderRes } = useQuery(
    ['getItemByFolderFiles', { selectedFolderId }],
    () => services.getItemByFolderData(selectedFolderId || undefined),
  );

  const { data: itemListInTrash } = useQuery(
    ['getItemListInTrash'],
    () => services.getMediaTrash(),
    { enabled: isTrash }
  );

  const { mutate: deleteFiles } = useMutation(
    'deleteFiles',
    async (params: ParamsIds) => deleteFilesService(params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['getAllFolder']);
        queryClient.invalidateQueries(['getItemByFolderFiles', { selectedFolderId }]);
      }
    }
  );

  const emptyTrash = () => {
    Modal.confirm({
      title: t('media.confirm_empty'),
      onOk: async () => {
        await services.emptyTrash();
        await queryClient.invalidateQueries(['getItemListInTrash']);
        notification.success({
          message: t('media.empty_success'),
        });
      }
    });
  };

  const restoreTrash = async (ids: number[]) => {
    Modal.confirm({
      title: t('media.confirm_restore'),
      onOk: async () => {
        await services.restoreTrash(ids);
        await queryClient.invalidateQueries(['getItemListInTrash']);
        notification.success({
          message: t('media.restore_success'),
        });
      }
    });
  };

  const trashContent = useMemo(() => {
    if (itemListInTrash) {
      const dataConverted = services.convertFolderData(itemListInTrash);
      return dataConverted.map(({
        id, name, isDirectory, type, size, date, thumbnail, isCreate, parentId, path: filePath
      }: any) => ({
        id,
        name,
        isDirectory,
        type,
        size,
        date: new Date(date),
        thumbnail,
        path: filePath,
        isCreate,
        parentId,
      }));
    }
    return [];
  }, [itemListInTrash]);

  const refetchItemByFolder = useCallback(async () => {
    await queryClient.invalidateQueries(['getItemByFolderFiles', { selectedFolderId }]);
    setIsUpload(false);
  }, [queryClient, selectedFolderId]);

  const onRefreshContent = useCallback(async () => {
    if (isTrash) {
      await queryClient.invalidateQueries(['getItemListInTrash']);
    } else {
      await queryClient.invalidateQueries(['getItemByFolderFiles', { selectedFolderId }]);
      await queryClient.invalidateQueries(['getAllFolder']);
    }
  }, [isTrash, queryClient, selectedFolderId]);

  const onRequestContent = useCallback((id?: number | string) => {
    setSearchResult([]);
    if (id === 'trash') {
      setIsTrash(true);
      queryClient.invalidateQueries(['getItemListInTrash']);
    } else {
      setIsTrash(false);
      setSelectedFolderId(id === -1 ? undefined : id as number);
      setIsSubmitted(true);
      if (itemListByFolderRes) {
        const parentPath = filesData.find((item) => item.id === id);
        const dataConverted = services.convertFolderData(itemListByFolderRes, parentPath ? `/${parentPath.name}` : '/');
        setContentLoading(true);
        const { content: newContent, path: newPath } = services.getContent(
          id as number,
          dataConverted,
          filesData,
        );
        setContent(newContent);

        setPath(newPath);
        setContentLoading(false);
        setIsSubmitted(false);
      }
    }
  }, [queryClient, itemListByFolderRes, filesData]);

  const handleSearch = (keyword: string) => {
    if (!keyword) {
      setSearchResult([]);
    } else {
      setSearching(true);
      setSearchResult(services.search(keyword, content));
      setSearching(false);
    }
  };

  const convertFile = useCallback(async (file?: OCFinderData) => {
    if (file && file.path) {
      if (videoRegex.test(file.type)) {
        setPreviewVideo(file.path);
      }
      if (imageRegex.test(file.type)) {
        setInfoFileSelected(file);
        await fetch(file.path)
          .then((e) => e.blob())
          .then((blob) => {
            const b: File = new File(
              [blob],
              file.name,
              { lastModified: file.date.getTime(), type: file.type }
            );
            setSelectedFile(b);
          });
      }
    }
  }, []);

  const createNewDirectory = async () => {
    try {
      await services.createFolderData({
        name: newDirName,
        parentId: !selectedContentId || selectedContentId === -1 ? null : selectedContentId,
      });
      queryClient.invalidateQueries(['getAllFolder']);
      queryClient.invalidateQueries(['getItemByFolderFiles', { selectedFolderId }]);
      setCreateParentId(undefined);
      setNewDirName('');
      notification.success({
        message: t('media.createFolder_success'),
      });
    } catch (errors: any) {
      notification.error({
        message: errors[0].message || t('media.createFolder_fail'),
      });
    } finally {
      setNewDirName('');
    }
  };

  const handleDeleteFolder = useCallback(async () => {
    try {
      setIsSubmitted(true);
      if (selectedListFolder.length) {
        if (isTrash) {
          await services.forceDeleteFilesList({
            ids: selectedListFolder,
          });
          queryClient.invalidateQueries(['getItemListInTrash']);
        } else {
          await services.deleteFoldersList({
            ids: selectedListFolder,
          });
          queryClient.invalidateQueries(['getAllFolder']);
          queryClient.invalidateQueries(['getItemByFolderFiles', { selectedFolderId }]);
          notification.success({
            message: t('media.deleteFolder_success'),
          });
          setSelectedListFolder([]);
        }
      }
      if (selectedListFile.length) {
        if (isTrash) {
          await services.forceDeleteFilesList({
            ids: selectedListFile,
          });
          queryClient.invalidateQueries(['getItemListInTrash']);
        } else {
          deleteFiles({
            ids: selectedListFile,
          });
        }
        notification.success({
          message: t('media.deleteFile_success'),
        });
        setSelectedListFile([]);
      }
      setIsDeleteOpenModal(false);
      setIsSubmitted(false);
    } catch (errors: any) {
      notification.error({
        message: errors[0].message || t('media.delete_fail'),
      });
    }
  }, [selectedListFolder, selectedListFile,
    isTrash, queryClient, selectedFolderId, t, deleteFiles]);

  const handleRenameDirectory = useCallback(async () => {
    setIsSubmitted(true);
    const parentId = filesData.find((item) => item.id === selectedContentId)?.parentId || null;
    try {
      if (selectedContentId && selectedContentId !== -1) {
        await services.renameFolders(selectedContentId, {
          name: newName,
          parentId,
        });
        queryClient.invalidateQueries(['getAllFolder']);
        queryClient.invalidateQueries(['getItemByFolderFiles', { selectedFolderId }]);
        setRenameModal(false);
        notification.success({
          message: t('media.renameFolder_success'),
        });
        setIsSubmitted(false);
      }
    } catch (errors: any) {
      notification.error({
        message: errors[0].message || t('media.renameFolder_fail'),
      });
    }
  }, [filesData, selectedContentId, newName, queryClient, selectedFolderId, t]);

  useEffect(() => {
    if (fileDataRes) {
      const dataFiles = services.convertFolderData(fileDataRes);
      setFilesData(dataFiles);
      setTree(services.getTree(dataFiles));
    }
  }, [fileDataRes]);

  return (
    <>
      <OCFinder
        ocFinderRoles={ocFinderRoles}
        treeLoading={isLoading}
        contentLoading={contentLoading}
        rootId={-1}
        tree={tree}
        path={path}
        content={content}
        trash={trashContent}
        searching={searching}
        searchResult={searchResult}
        multipleSelect={multiple}
        onRefresh={onRefreshContent}
        onRequestContent={onRequestContent}
        onEditFile={(id) => convertFile(content.find((it) => it.id === id))}
        onOpenFile={(id) => {
          const target = content.find((it) => it.id === id);
          if (target && videoRegex.test(target.type)) {
            setPreviewVideo(target.path);
          }
          if (target && imageRegex.test(target.type)) {
            setPreviewFile(target.path);
          }
        }}
        onSearch={handleSearch}
        onUpload={() => selectedContentId && setIsUpload(true)}
        onCreateDirectory={(id) => setCreateParentId(id)}
        onRenameDirectory={() => setRenameModal(true)}
        onDeleteFolder={(list: number[], fileList: number[]) => {
          setIsDeleteOpenModal(true);
          setSelectedListFolder(list);
          setSelectedListFile(fileList);
        }}
        onSelectedFolder={(folder) => setSelectedFolderId(folder)}
        onSelectedContent={(id) => setSelectedContentId(id)}
        isSubmitted={isSubmitted}
        onSelectFile={(id) => {
          if (isModal && handleSelectFile) {
            const file = content.find((it) => it.id === id);
            if (file && (file.path)) {
              handleSelectFile([{
                path: file.path,
                title: file.title,
                alt: file.alt
              }]);
            }
          } else {
            convertFile(content.find((it) => it.id === id));
          }
        }}
        onSelectMultipleFile={(ids) => {
          const filterData = content.filter(
            (cont) => ids.includes(cont.id)
          );
          if (handleSelectFile) {
            handleSelectFile(filterData.map(
              (item) => ({ path: item.path || '', title: item.title, alt: item.alt })
            ));
          }
        }}
        onEmptyTrash={emptyTrash}
        onRestoreTrash={restoreTrash}
      />
      <Modal
        visible={!!selectedFile}
        width="90vw"
        style={{ top: '5vh' }}
        bodyStyle={{ height: '90vh' }}
        footer={null}
        onCancel={() => setSelectedFile(undefined)}
        destroyOnClose
        maskClosable={false}
      >
        <CropperContainer
          folderId={selectedFolderId as number}
          file={selectedFile}
          fileInfo={infoFileSelected}
          handleClose={() => {
            setSelectedFile(undefined);
            onRefreshContent();
          }}
        />
      </Modal>
      <Modal
        visible={!!previewVideo}
        width="90vw"
        style={{ top: '5vh' }}
        bodyStyle={{ height: '90vh', padding: '40px' }}
        footer={null}
        onCancel={() => setPreviewVideo(undefined)}
        destroyOnClose
        maskClosable={false}
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video className="preview-video" controls src={previewVideo} />
      </Modal>
      <DraggerContainer
        folderId={selectedFolderId}
        isOpen={isUpload}
        handleClose={() => setIsUpload(false)}
        handleUploadSuccess={refetchItemByFolder}
      />
      <Modal
        okText={t('system.ok')}
        cancelText={t('system.cancel')}
        title={<Typography.Title level={3}>{t('media.createFolder')}</Typography.Title>}
        visible={createParentId !== undefined}
        onCancel={() => setCreateParentId(undefined)}
        onOk={createNewDirectory}
      >
        <Typography.Text strong>
          {t('media.folderName')}
        </Typography.Text>
        <Input
          className="u-mt-8"
          size="large"
          autoFocus
          value={newDirName}
          onChange={(e) => setNewDirName(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && createNewDirectory()}
        />
      </Modal>
      <Modal
        className="t-pagetable_deleteRecordModal"
        title={<Typography.Title level={3}>{t('media.deleteFolder')}</Typography.Title>}
        visible={isDeleteOpenModal}
        centered
        onCancel={() => setIsDeleteOpenModal(false)}
        onOk={handleDeleteFolder}
        okText={t('media.ok')}
        cancelText={t('media.cancel')}
        cancelButtonProps={{ type: 'primary' }}
        okButtonProps={{ type: 'default' }}
      >
        <Typography.Text strong>
          {t('media.deleteFolder_warning')}
        </Typography.Text>
      </Modal>
      <Modal
        title={<Typography.Title level={3}>{t('media.renameFolder')}</Typography.Title>}
        visible={isRenameModal}
        centered
        onCancel={() => setRenameModal(false)}
        onOk={handleRenameDirectory}
      >
        <Input
          className="u-mt-8"
          size="large"
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRenameDirectory()}
        />
      </Modal>
      <Image
        src={previewFile}
        style={{ display: 'none' }}
        preview={{
          visible: !!previewFile,
          src: previewFile,
          onVisibleChange: () => {
            setPreviewFile(undefined);
          },
        }}
      />
    </>
  );
};

export default OCFinderContainer;

import {
  AppstoreOutlined,
  ArrowUpOutlined,
  BarsOutlined,
  CaretRightOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FolderAddOutlined,
  FormOutlined,
  ReloadOutlined,
  SearchOutlined,
  StopOutlined,
  UndoOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button, Divider, Dropdown, Input, Menu, Spin, Tree, TreeDataNode,
} from 'antd';
import classNames from 'classnames';
import React, {
  forwardRef,
  useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import OCFInderItem, { OCFinderData } from './OCFInderItem';
import styles from './index.module.css';

import useDebounce from 'common/hooks/useDebounce';
import useDidMount from 'common/hooks/useDidMount';
import LOCAL_STORAGE from 'common/utils/constant';

export type OCFinderRoles = {
  createFolder: boolean;
  updateFolder: boolean;
  destroyFolder: boolean;
  detailFolder: boolean;
  updateFile: boolean;
  destroyFile: boolean;
  uploadFile: boolean;
  accessTrash: boolean;
  restoreTrash: boolean;
  forceDeleteTrash: boolean;
  emptyTrash: boolean;
};
interface IProps {
  treeLoading?: boolean;
  contentLoading?: boolean;
  searching?: boolean;
  rootId: number | string;
  tree: Array<TreeDataNode>;
  path: Array<OCFinderData>;
  content: Array<OCFinderData>;
  trash?: Array<OCFinderData>;
  searchResult?: Array<OCFinderData>;
  isSubmitted?: boolean;
  multipleSelect?: boolean;
  ocFinderRoles?: OCFinderRoles;
  onRefresh?: () => void;
  onRequestContent(id: number | string): void;
  onOpenFile(id: number | string): void;
  onEditFile(id: number | string): void;
  onSelectFile(id: number): void;
  onSelectMultipleFile(id: number[]): void;
  onSearch?(keyword: string): void;
  onUpload?(): void;
  onCreateDirectory?: (id: number | string) => void;
  onDeleteFolder?: (list: number[], fileList: number[]) => void;
  onRenameDirectory?: () => void;
  onSelectedFolder?: (folderId?: number) => void;
  onSelectedContent?: (id?: number) => void;
  onEmptyTrash?: () => void;
  onRestoreTrash?: (idList: number[]) => void;
}

type SorterColumnRef = {
  reset: () => void;
};

type SorterColumnProps = {
  title: string;
  className: string;
  handleSort: (type: number) => void;
};

const SorterColumn = forwardRef<SorterColumnRef, SorterColumnProps>(({
  title, className, handleSort
}, ref) => {
  const [sortBy, setSortBy] = useState(0); // 0: not apply | 1: descending | 2: ascending
  useImperativeHandle(ref, () => ({
    reset: () => setSortBy(0),
  }));
  return (
    <div
      className={classNames({
        [className]: true,
        [styles.descending]: sortBy === 1,
        [styles.ascending]: sortBy === 2
      })}
      onClick={() => {
        const val = sortBy === 2 ? 0 : sortBy + 1;
        handleSort(val);
        setSortBy(val);
      }}
    >
      {title}
    </div>
  );
});

export default function OCFinder({
  treeLoading, contentLoading,
  tree, path, content,
  searching, searchResult = [],
  trash = [],
  rootId,
  isSubmitted,
  multipleSelect,
  ocFinderRoles,
  onRefresh,
  onRequestContent,
  onOpenFile,
  onEditFile,
  onSelectFile,
  onSelectMultipleFile,
  onSearch,
  onUpload,
  onCreateDirectory,
  onDeleteFolder,
  onRenameDirectory,
  onSelectedFolder,
  onSelectedContent,
  onEmptyTrash,
  onRestoreTrash
}: IProps) {
  const [searchMode, setSearchMode] = useState(false);
  const [currentId, setCurrentId] = useState(Number(localStorage.getItem(
    LOCAL_STORAGE.FINDER_TREE_SELECTED
  )) || rootId);
  const [treeSelectedId, setTreeSelectedId] = useState(currentId);
  const [selected, setSelected] = useState(new Set<number>());
  const [selectedFiles, setSelectedFiles] = useState(new Set<number>());
  const [verticalView, setVerticalView] = useState(false);
  const [searchTxt, setSearchTxt] = useState('');
  const { t } = useTranslation();

  const selectedFolderList = useMemo(() => Array.from(selected), [selected]);
  const selectedFilesList = useMemo(() => Array.from(selectedFiles), [selectedFiles]);
  const [sortData, setSortData] = useState({ field: 'name', type: 0 }); // 0: not apply | 1: descending | 2: ascending

  const fieldNameRef = useRef<SorterColumnRef>(null);
  const fieldDateRef = useRef<SorterColumnRef>(null);
  const fieldSizeRef = useRef<SorterColumnRef>(null);

  useDebounce(() => {
    if (onSearch) {
      onSearch(searchTxt);
    }
  }, 500, [searchTxt]);

  const treeData = useMemo(() => [
    ...(ocFinderRoles?.accessTrash ? [{
      title: t('media.trash'),
      key: 'trash',
      icon: <DeleteOutlined />,
    }] : []),
    {
      title: '/',
      key: rootId,
      children: tree,
    },
  ], [ocFinderRoles, rootId, tree]);

  const contentSorted = useMemo(() => Array.from(content)
    .sort((a: any, b: any) => {
      const dirFist = true;
      switch (sortData.type) {
        case 1:
          return sortData.field === 'name' ? b[sortData.field].localeCompare(a[sortData.field]) : b[sortData.field] - a[sortData.field];
        case 2:
          return sortData.field === 'name' ? a[sortData.field].localeCompare(b[sortData.field]) : a[sortData.field] - b[sortData.field];
        default:
          if (dirFist && a.isDirectory && !b.isDirectory) return -1;
          if (dirFist && !a.isDirectory && b.isDirectory) return 1;
          return 1;
      }
    }), [content, sortData]);

  const trashSorted = useMemo(() => Array.from(trash)
    .sort((a: any, b: any) => {
      const dirFist = true;
      switch (sortData.type) {
        case 1:
          return sortData.field === 'name' ? b[sortData.field].localeCompare(a[sortData.field]) : b[sortData.field] - a[sortData.field];
        case 2:
          return sortData.field === 'name' ? a[sortData.field].localeCompare(b[sortData.field]) : a[sortData.field] - b[sortData.field];
        default:
          if (dirFist && a.isDirectory && !b.isDirectory) return -1;
          if (dirFist && !a.isDirectory && b.isDirectory) return 1;
          return 1;
      }
    }), [trash, sortData]);

  const directorySet = useMemo(
    () => new Set(
      (searchMode ? searchResult : content).filter((c) => c.isDirectory).map((c) => c.id),
    ),
    [content, searchMode, searchResult],
  );

  const handleTreeSelect = useCallback((keys: Array<number | string>) => {
    const id = keys[0];

    if (id !== 'search') {
      setSearchMode(false);
    }

    switch (id) {
      case 'search':
        setTreeSelectedId('search');
        if (onSelectedContent) {
          onSelectedContent(undefined);
        }
        break;
      case 'trash':
        setCurrentId(id);
        setTreeSelectedId(id);
        if (onSelectedContent) {
          onSelectedContent(undefined);
        }
        break;
      case undefined:
        setTreeSelectedId(rootId);
        if (onSelectedContent) {
          onSelectedContent(Number(rootId));
        }
        break;
      default:
        setCurrentId(id);
        setTreeSelectedId(id);
        if (onSelectedContent) {
          onSelectedContent(Number(id) || undefined);
        }
    }
  }, [onSelectedContent, rootId]);

  const handleSelectPath = useCallback((id: number | string) => {
    setCurrentId(id);
  }, []);

  const toggleSelected = useCallback((id: number, isDir?: boolean) => {
    if (isDir) {
      if (selected.has(id)) { selected.delete(id); } else { selected.add(id); }
      setSelected(new Set(selected));
    } else {
      if (selectedFiles.has(id)) { selectedFiles.delete(id); } else { selectedFiles.add(id); }
      setSelectedFiles(new Set(selectedFiles));
    }
  }, [selected, selectedFiles]);

  const clearSelection = useCallback(() => {
    setSelected(new Set());
    setSelectedFiles(new Set());
  }, []);

  const enableSearchMode = useCallback(() => {
    setSearchMode(true);
  }, []);

  const openItem = useCallback((id: number) => {
    clearSelection();

    if (directorySet.has(id)) {
      setSearchMode(false);
      setCurrentId(id);
      if (onSelectedFolder) {
        onSelectedFolder(id);
      }
    } else {
      onSelectFile(id);
    }
  }, [clearSelection, directorySet, onSelectFile, onSelectedFolder]);

  const goUpper = useCallback(() => {
    if (path.length < 2) {
      setCurrentId(rootId);
    } else {
      setCurrentId(path[path.length - 2].id);
    }
  }, [path, rootId]);

  useEffect(() => {
    setTreeSelectedId(currentId);
    onRequestContent(currentId);
  }, [currentId, onRequestContent]);

  useEffect(() => {
    if (isSubmitted) {
      clearSelection();
    }
  }, [isSubmitted, clearSelection]);

  const test = (id: number, isDirectory: boolean) => {
    toggleSelected(id, isDirectory);
    if (onRenameDirectory) {
      onRenameDirectory();
    }
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE.FINDER_TREE_SELECTED, String(treeSelectedId));
  }, [treeSelectedId]);

  useDidMount(() => {
    setTreeSelectedId(localStorage.getItem(LOCAL_STORAGE.FINDER_TREE_SELECTED) || rootId);
  });

  return (
    <div className={styles.container}>
      {(selected.size || selectedFiles.size) ? (
        <div className={`${styles.toolbar} ${styles.selected}`}>
          {selectedFiles.size === 1 && treeSelectedId !== 'trash' && (
            <>
              <Button type="text" onClick={() => onOpenFile(selectedFilesList[0])} icon={<EyeOutlined />}>{t('media.preview')}</Button>
              <Button type="text" disabled={!ocFinderRoles?.updateFile} icon={<FormOutlined />} onClick={() => onEditFile(selectedFilesList[0])}>{t('media.edit')}</Button>
              <Divider type="vertical" />
            </>
          )}
          {/* <Button type="text" icon={<ScissorOutlined />}>Move To</Button> */}
          {selected.size === 1 && treeSelectedId !== 'trash' && (
            <>
              <Button type="text" disabled={!ocFinderRoles?.updateFolder} icon={<EditOutlined />} onClick={onRenameDirectory}>{t('media.rename')}</Button>
              <Divider type="vertical" />
            </>
          )}
          {treeSelectedId === 'trash' && (
            <Button
              type="text"
              icon={<UndoOutlined />}
              disabled={!ocFinderRoles?.restoreTrash}
              onClick={
                () => onRestoreTrash
                  && onRestoreTrash([...selectedFolderList, ...selectedFilesList])
              }
            >
              {t('media.restore')}
            </Button>
          )}
          <Button
            type="text"
            icon={<DeleteOutlined />}
            disabled={!ocFinderRoles?.destroyFolder}
            onClick={() => {
              if (onDeleteFolder && (
                selectedFolderList.length > 0 || selectedFilesList.length > 0)
              ) {
                onDeleteFolder(selectedFolderList, selectedFilesList);
              }
            }}
          >
            {t('media.delete')}
          </Button>
          <span style={{ flexGrow: 1 }} />
          <Button type="text" onClick={clearSelection} icon={<CloseOutlined />}>{t('media.clearSelection')}</Button>
          {multipleSelect && selectedFilesList.length > 0 && (
            <Button
              type="primary"
              onClick={() => {
                onSelectMultipleFile(selectedFilesList);
                clearSelection();
              }}
              icon={<CheckOutlined />}
            >
              {t('media.select')}
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.toolbar}>
          {treeSelectedId === 'trash' ? (
            <Button
              type="text"
              disabled={!ocFinderRoles?.emptyTrash}
              icon={<StopOutlined />}
              onClick={onEmptyTrash}
            >
              {t('media.empty')}
              {' '}
            </Button>
          ) : (
            <>
              <Button
                type="text"
                disabled={!ocFinderRoles?.createFolder}
                icon={<FolderAddOutlined />}
                onClick={() => onCreateDirectory && onCreateDirectory(treeSelectedId)}
              >
                {t('media.newDirectory')}
              </Button>
              <Button type="text" disabled={!ocFinderRoles?.uploadFile} icon={<UploadOutlined />} onClick={onUpload}>{t('media.uploadFile')}</Button>
            </>
          )}
          {onSearch && <Button type="text" onClick={enableSearchMode} icon={<SearchOutlined />}>{t('media.search')}</Button>}
          <span style={{ flexGrow: 1 }} />
          <Dropdown overlay={(
            <Menu
              items={[{
                key: '1',
                label: t('media.asList'),
                icon: <BarsOutlined />,
                onClick: () => setVerticalView(true)
              }, {
                key: '2',
                label: t('media.asIcons'),
                icon: <AppstoreOutlined />,
                onClick: () => setVerticalView(false)
              }]}
            />
          )}
          >
            <Button type="text" icon={verticalView ? <BarsOutlined /> : <AppstoreOutlined />} />
          </Dropdown>
          <Divider type="vertical" />
          <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} title={t('media.reload')} />
        </div>
      )}
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Spin spinning={treeLoading} wrapperClassName={styles.siderWrapper}>
          <Tree.DirectoryTree
            defaultExpandedKeys={[rootId]}
            expandAction="click"
            selectedKeys={[treeSelectedId]}
            treeData={treeData}
            onSelect={(key) => {
              if (ocFinderRoles?.detailFolder) {
                handleTreeSelect(key);
                clearSelection();
              }
            }}
          />
        </Spin>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {searchMode ? (
            <div className={styles.toolbar}>
              <Input.Search placeholder={t('media.searchAllMedia')} autoFocus onChange={(event) => setSearchTxt(event.currentTarget.value)} onSearch={onSearch} />
            </div>
          ) : (
            <div className={styles.toolbar}>
              <Button type="text" onClick={goUpper} icon={<ArrowUpOutlined />} />
              <Divider type="vertical" />
              <Button type="text" onClick={() => handleSelectPath(rootId)}>/</Button>
              {treeSelectedId !== 'trash' && path.map((p) => (
                <React.Fragment key={p.id}>
                  <CaretRightOutlined />
                  <Button type="text" onClick={() => handleSelectPath(p.id)}>{p.name}</Button>
                </React.Fragment>
              ))}
            </div>
          )}
          <Spin
            spinning={searchMode ? searching : contentLoading}
            wrapperClassName={styles.contentWrapper}
          >

            {verticalView && (
              <div className={styles.contentHead}>
                <SorterColumn
                  title={t('media.name')}
                  className={styles.name}
                  handleSort={(type) => {
                    setSortData({ field: 'name', type });
                    fieldDateRef.current?.reset();
                    fieldSizeRef.current?.reset();
                  }}
                  ref={fieldNameRef}
                />
                <SorterColumn
                  title={t('media.date')}
                  className={styles.date}
                  handleSort={(type) => {
                    setSortData({ field: 'date', type });
                    fieldNameRef.current?.reset();
                    fieldSizeRef.current?.reset();
                  }}
                  ref={fieldDateRef}
                />
                <SorterColumn
                  title={t('media.size')}
                  className={styles.size}
                  handleSort={(type) => {
                    setSortData({ field: 'size', type });
                    fieldNameRef.current?.reset();
                    fieldDateRef.current?.reset();
                  }}
                  ref={fieldSizeRef}
                />
              </div>
            )}
            <div className={classNames({ [styles.contentBody]: verticalView })}>
              <div
                className={styles.contentBackground}
                onClick={clearSelection}
              />
              <div
                className={classNames(
                  { [styles.content]: true, [styles.vertical]: verticalView }
                )}
              >
                {/* eslint-disable-next-line no-nested-ternary */}
                {(searchMode ? searchResult : treeSelectedId === 'trash' ? trashSorted : contentSorted).map(({
                  id, name, isDirectory, date, size, type, thumbnail, path: filePath
                }) => (
                  <OCFInderItem
                    key={id}
                    verticalView={verticalView}
                    active={selected.has(id) || selectedFiles.has(id)}
                    onClick={() => {
                      toggleSelected(id, isDirectory);
                      if (onSelectedContent) {
                        onSelectedContent(id);
                      }
                    }}
                    onDoubleClick={() => ocFinderRoles?.detailFolder && openItem(id)}
                    {...{
                      id,
                      name,
                      isDirectory,
                      date,
                      size,
                      type,
                      thumbnail,
                      path: filePath,
                    }}
                    onDelete={() => {
                      if (onDeleteFolder) {
                        onDeleteFolder(isDirectory ? [id] : [], !isDirectory ? [id] : []);
                      }
                    }}
                    onRename={isDirectory && treeSelectedId !== 'trash' ? () => test(id, isDirectory) : undefined}
                    onEdit={!isDirectory && treeSelectedId !== 'trash' ? () => onEditFile(id) : undefined}
                    onPreview={!isDirectory ? () => onOpenFile(id) : undefined}
                  />
                ))}
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </div>
  );
}

OCFinder.defaultProps = {
  treeLoading: false,
  contentLoading: false,
  searching: false,
  searchResult: [],
  onSearch: undefined,
};

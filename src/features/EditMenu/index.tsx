import {
  DeleteOutlined, MenuUnfoldOutlined,
  MinusSquareOutlined, PlusSquareOutlined, SaveOutlined, SettingOutlined
} from '@ant-design/icons';
import {
  Button, Col, Collapse, message, Modal, Row, Space, Spin, Tree, Typography
} from 'antd';
import { Key } from 'antd/lib/table/interface';
import { TreeProps } from 'antd/lib/tree';
import React, {
  useCallback, useEffect, useMemo, useState
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import { EditMenuModal } from './EditMenuModal';
import MenuGeneration from './MenuGeneration';
import {
  convertUpdateMenuParams, deleteMenuItem, onDrop, recursiveGTreeData
} from './functions';
import { MainMenuDataType, MenuGenerationFormTypes } from './types';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ModalConfirm from 'common/components/ModalConfirm';
import Pulldown from 'common/components/Pulldown';
import { createUpdateMenuService, getMenusByCodeService, getReferenceTypesService } from 'common/services/menus';
import { CreateUpdateMenuParamsTypes } from 'common/services/menus/types';

const EditMenu: React.FC<ActiveRoles> = ({ roleCreate, roleUpdate }) => {
  /* Selectors */
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);

  /* Hooks */
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const codeParams = searchParams.get('code') || '';
  const localeParams = searchParams.get('locale') || defaultWebsiteLanguage || '';

  /* States */
  const [menuTreeData, setTreeData] = useState<MainMenuDataType[]>([]);
  const [currentLang, setCurrentLang] = useState<string>(localeParams);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [confirm, setConfirm] = useState<string | undefined>(undefined);
  const [editModal, setEditModal] = useState<{
    open: boolean;
    item?: MainMenuDataType;
  }>({
    open: false,
    item: undefined,
  });
  const [customIdx, setCustomIdx] = useState(1);
  const [isDirtyItem, setIsDirtyItem] = useState(false);

  /* React-hook-form */
  const method = useForm<CreateUpdateMenuParamsTypes>({
    defaultValues: {
      title: '',
      code: '',
      locale: '',
      items: [],
    }
  });

  const { isDirty } = method.formState;

  /* React Queries */
  const { data: referenceTypesData, isLoading: referenceTypesLoading } = useQuery(
    ['getReferenceTypes'],
    async () => getReferenceTypesService()
  );

  const { data: menuDataRes, isFetching: menuDataLoading } = useQuery(
    ['getMenuByCode', { codeParams, localeParams }],
    () => getMenusByCodeService({
      code: codeParams,
      locale: localeParams
    }),
    {
      enabled: !!(localeParams && codeParams),
      refetchOnMount: 'always',
      onError: () => {
        method.reset({
          title: '',
          code: '',
          locale: '',
          items: [],
        });
        setTreeData([]);
      },
    }
  );

  const { mutate: createUpdateMutate, isLoading: createLoading } = useMutation(
    ['createUpdateMenuAction', { codeParams, localeParams }],
    async (params: CreateUpdateMenuParamsTypes) => createUpdateMenuService({
      ...params,
      code: codeParams,
      locale: localeParams
    }),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['getMenuByCode', { codeParams, localeParams }]);
      },
      onError: (err) => {
        const errors = err as ErrorResponse[];
        if (Array.isArray(errors)) {
          errors.forEach((val) => {
            message.error(val.message);
          });
        }
      }
    }
  );

  /* Datas */
  const menuGenerationOptions = useMemo(() => {
    if (referenceTypesData) {
      return referenceTypesData.map((ele, idx) => ({
        id: idx + 1,
        // kebab-case to camelCase for translation
        title: t(`menu.${ele.replace(/-./g, (x) => x[1].toUpperCase())}`),
        type: ele,
      }));
    }
    return [];
  }, [referenceTypesData, t]);

  useEffect(() => {
    if (menuDataRes) {
      const tree = recursiveGTreeData(menuDataRes.menuItems);
      setTreeData(tree);
      const items = convertUpdateMenuParams(tree);
      method.reset({
        title: menuDataRes.menuData.title,
        code: menuDataRes.menuData.code,
        locale: menuDataRes.menuData.locale,
        items,
      });
    }
  }, [menuDataRes, method]);

  useEffect(() => {
    if (menuTreeData) {
      const items = convertUpdateMenuParams(menuTreeData);
      method.setValue('items', items);
    }
  }, [menuTreeData, method]);

  /* Functions */
  const handleGenerate = (data: MenuGenerationFormTypes) => {
    const currentIdx = customIdx;
    setTreeData((prevTree) => [...prevTree, {
      key: `custom-menu-${currentIdx}`,
      dynamicId: currentIdx,
      title: data.referenceLink?.label || data.title,
      rawTitle: data.referenceLink?.label || data.title,
      target: data.target,
      link: data.url,
      type: data.type,
      referenceId: data.referenceLink?.value,
    }]);
    setCustomIdx(currentIdx + 1);
    if (!isDirtyItem) {
      setIsDirtyItem(true);
    }
  };

  const handleTreeChange: TreeProps['onDrop'] = (info) => {
    const { data } = onDrop(info, menuTreeData);
    setTreeData(data);
    if (!isDirtyItem) {
      setIsDirtyItem(true);
    }
  };

  const handleSaveMenu = () => {
    const menu = method.getValues();
    createUpdateMutate(menu);
  };

  const changeLanguageAction = (lang?: string, isSubmit?: boolean) => {
    setConfirm(undefined);
    setIsDirtyItem(false);
    if (lang) {
      if (isSubmit) {
        handleSaveMenu();
      }
      setCurrentLang(lang as LanguageCodeTypes);
      setSearchParams({
        code: codeParams,
        locale: lang
      }, { replace: true });
    }
  };

  const handleChangeLang = (lang: LanguageCodeTypes) => {
    if (isDirty || isDirtyItem) {
      setConfirm(lang);
    } else changeLanguageAction(lang);
  };

  /* Components */
  const MemoizedMenuTreeItem = useCallback((node: MainMenuDataType) => (
    <Space style={{ justifyContent: 'space-between', display: 'flex' }}>
      <div className="t-editMenu_menu_title">
        {node.title}
      </div>
      <div className="t-editMenu_menu_action">
        <Space>
          {node.type && (
            <div className="t-editMenu_category">
              {
                t(`menu.${node.type.replace(/-./g, (x) => x[1].toUpperCase())}`)
              }
            </div>
          )}
          <Button
            onClick={() => {
              setEditModal({
                open: true,
                item: node,
              });
            }}
            icon={(<SettingOutlined />)}
          />
          <Button
            onClick={() => {
              Modal.confirm({
                className: 't-pagetable_deleteRecordModal',
                autoFocusButton: 'cancel',
                okText: t('system.ok'),
                cancelText: t('system.cancel'),
                cancelButtonProps: {
                  type: 'primary',
                },
                okButtonProps: {
                  type: 'default',
                },
                title: t('message.confirmDeleteRecord'),
                onOk: () => {
                  setTreeData((prev) => deleteMenuItem(prev, node.dynamicId));
                },
              });
            }}
            icon={(<DeleteOutlined />)}
          />
        </Space>
      </div>
    </Space>
  ), [t]);

  const MemoizedIcon = useCallback((isActive?: boolean) => (
    isActive ? <MinusSquareOutlined /> : <PlusSquareOutlined width={24} />
  ), []);

  return (
    <>
      <HeaderPage
        fixed
        title={t('menu.edit')}
        rightHeader={(
          <Button
            type="primary"
            disabled={(codeParams && !roleUpdate) || (!codeParams && !roleCreate)}
            onClick={handleSaveMenu}
            loading={createLoading}
          >
            <SaveOutlined />
            {t('system.save')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <Spin size="large" spinning={menuDataLoading || referenceTypesLoading}>
          <div className="t-editMenu">
            <FormProvider<CreateUpdateMenuParamsTypes> {...method}>
              <div className="t-editMenu_titleWrapper">
                <Typography.Title level={4} style={{ fontWeight: 700 }}>
                  {t('system.title')}
                  {' '}
                  <Typography.Text strong type="danger">
                    *
                  </Typography.Text>
                </Typography.Title>
                <div className="t-editMenu_input">
                  <Controller
                    name="title"
                    rules={{
                      validate: (value) => value !== '' || 'Tiêu đề là bắt buộc'
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size="large"
                        name="menu-title"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('system.title')}
                      />
                    )}
                  />
                </div>
              </div>
              <Row gutter={[16, 16]} className="t-editMenu_row">
                <Col md={6} style={{ width: '100%' }}>
                  <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    expandIcon={({ isActive }) => MemoizedIcon(isActive)}
                    className="site-collapse-custom-collapse"
                    expandIconPosition="right"
                  >
                    {
                      menuGenerationOptions.map((val, idx) => (
                        <Collapse.Panel
                          header={(
                            <Typography.Title level={5}>
                              {val.title}
                            </Typography.Title>
                          )}
                          key={(idx + 1).toString()}
                          className="site-collapse-custom-panel"
                        >
                          <MenuGeneration
                            type={val.type}
                            handleSubmit={handleGenerate}
                          />
                        </Collapse.Panel>
                      ))
                    }
                  </Collapse>
                </Col>
                <Col md={12} style={{ width: '100%', paddingTop: '16px' }} className="u-mt-0">
                  <Typography.Title level={4}>
                    {t('menu.structure')}
                  </Typography.Title>
                  <div className="u-mt-8">
                    <Tree
                      className="draggable-tree"
                      draggable
                      autoExpandParent
                      treeData={menuTreeData}
                      blockNode
                      expandedKeys={[...expandedKeys]}
                      onExpand={(expendKey) => setExpandedKeys(expendKey)}
                      style={{ background: '#fafafa' }}
                      icon={(<MenuUnfoldOutlined />)}
                      titleRender={(node) => MemoizedMenuTreeItem(node)}
                      onDrop={handleTreeChange}
                    />
                  </div>
                </Col>
                <Col md={6} style={{ width: '100%', paddingTop: '16px' }} className="u-mt-0">
                  <div className="t-editMenu_language">
                    <Typography.Title level={4}>
                      {t('system.language')}
                    </Typography.Title>
                    <div className="t-editMenu_language_select">
                      <Pulldown
                        value={languageOptions.find((item) => item.value === currentLang)}
                        placeholder={`${t('system.select')} ${t('system.language')}`}
                        options={languageOptions}
                        handleSelect={
                          (selected) => {
                            if (selected.value !== currentLang) {
                              handleChangeLang(selected.value as LanguageCodeTypes);
                            }
                          }
                        }
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </FormProvider>
          </div>
        </Spin>
      </div>
      <EditMenuModal
        isOpen={editModal.open}
        menuItem={editModal.item}
        menuTree={menuTreeData}
        handleUpdateTree={setTreeData}
        handleClose={() => setEditModal({
          open: false,
          item: undefined,
        })}
      />
      <ModalConfirm
        isShow={!!confirm}
        handleCancel={() => setConfirm(undefined)}
        handleConfirm={() => changeLanguageAction(confirm)}
        handleClose={() => setConfirm(undefined)}
      >
        {t('message.confirmSave')}
      </ModalConfirm>
    </>
  );
};

export default EditMenu;

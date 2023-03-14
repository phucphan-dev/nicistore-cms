import { SaveOutlined } from '@ant-design/icons';
import {
  Button, Col, Input, message, Modal, Row, Select, Space, Switch, Typography
} from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

import { handleUpdateMenuTreeData } from './functions';
import { MainMenuDataType, MenuItemEditFormTypes } from './types';

import Form from 'common/components/Form';
import { updateMenuItemService } from 'common/services/menus';
import { UpdateMenuItemParamsTypes } from 'common/services/menus/types';
import { TARGET_LIST_LABEL, TARGET_LIST_OPTIONS } from 'common/utils/constant';

export type EditMenuModalProps = {
  isOpen: boolean;
  menuItem?: MainMenuDataType;
  menuTree: MainMenuDataType[];
  handleUpdateTree: (tree: MainMenuDataType[]) => void;
  handleClose: () => void;
};

const { Option } = Select;

export const EditMenuModal: React.FC<EditMenuModalProps> = ({
  isOpen,
  menuItem,
  menuTree,
  handleUpdateTree,
  handleClose,
}) => {
  /* Hooks */
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  /* React-hook-form */
  const method = useForm<MenuItemEditFormTypes>({
    defaultValues: {
      icon: '',
      cssClass: '',
      link: '',
      title: '',
      type: '',
      target: 1,
      id: 0,
      rel: '',
      download: false,
    }
  });

  /* React-query */
  const { mutate: updateMenuItemMutate, isLoading: updateMenuItemLoading } = useMutation(
    ['updateMenuItemAction'],
    async (data: {
      id: number,
      params: UpdateMenuItemParamsTypes
    }) => updateMenuItemService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['getMenuByCode']);
        method.reset();
        handleClose();
      },
      onError: () => {
        message.error(t('message.updateError'));
      },
    }
  );

  const handleSubmitEdit = (data: MenuItemEditFormTypes) => {
    if (data.id) {
      updateMenuItemMutate({
        id: data.id,
        params: {
          icon: data.icon,
          cssClass: data.cssClass,
          link: data.link,
          title: data.title,
          target: TARGET_LIST_LABEL.find((f) => f.value === data.target)?.label || '',
          rel: data.rel,
          download: data.download
        }
      });
    } else if (menuItem?.dynamicId) {
      const newTree = handleUpdateMenuTreeData(menuItem?.dynamicId, menuTree, data);
      handleUpdateTree(newTree);
      handleClose();
    }
  };

  /* Effects */
  useEffect(() => {
    if (menuItem) {
      method.reset({
        id: menuItem.id,
        title: (menuItem.title as string) || '',
        target: Number(menuItem.target),
        cssClass: menuItem.cssClass,
        link: menuItem.link,
        icon: menuItem.iconFile || '',
        rel: menuItem.rel,
        download: menuItem.download
      });
    }
  }, [menuItem, method]);

  return (
    <Modal
      title={(
        <Typography.Title level={3} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
          {t('menu.edit')}
        </Typography.Title>
      )}
      visible={isOpen}
      footer={null}
      onCancel={handleClose}
    >
      <div className="t-menuItemEdit">
        <Form method={method} submitForm={handleSubmitEdit}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="t-menuItemEdit_input">
                <Typography.Text strong>
                  {t('system.keywords')}
                </Typography.Text>
                <Controller
                  name="title"
                  render={({ field }) => (
                    <Input
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={`${t('system.input')} ${t('system.keywords')}`}
                    />
                  )}
                />
              </div>
            </Space>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="t-menuItemEdit_input">
                <Typography.Text strong>
                  Css Class
                </Typography.Text>
                <Controller
                  name="cssClass"
                  render={({ field }) => (
                    <Input
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={`${t('system.input')} class`}
                    />
                  )}
                />
              </div>
            </Space>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="t-menuItemEdit_input">
                <Typography.Text strong>
                  Icon
                </Typography.Text>
                <Controller
                  name="icon"
                  render={({ field }) => (
                    <Input
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={`${t('system.input')} Icon`}
                    />
                  )}
                />
              </div>
            </Space>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Row style={{ width: '100%' }}>
                <Col span={11}>
                  {menuItem?.type === 'customLink' ? (
                    <div className="t-listFilter_input">
                      <Typography.Text strong>
                        {t('system.slug')}
                      </Typography.Text>
                      <Controller
                        name="link"
                        render={({ field }) => (
                          <Input
                            className="u-mt-8"
                            size="large"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={menuItem?.type !== 'customLink'}
                            placeholder={`${t('system.input')} ${t('system.slug')}`}
                          />
                        )}
                      />
                    </div>
                  ) : (
                    <div className="t-listFilter_input">
                      <Typography.Text strong>
                        {t('system.slug')}
                      </Typography.Text>
                      <Input
                        className="u-mt-8"
                        size="large"
                        value={menuItem?.reference?.slug}
                        disabled
                      />
                    </div>
                  )}
                </Col>
                <Col span={12} offset={1}>
                  <div className="t-listFilter_input">
                    <Typography.Text strong>
                      Target
                    </Typography.Text>
                    <Controller
                      name="target"
                      render={({ field }) => (
                        <Select
                          size="large"
                          style={{ width: '100%' }}
                          className="u-mt-8"
                          placeholder="---"
                          value={field.value}
                          onChange={field.onChange}
                          defaultValue={TARGET_LIST_OPTIONS[0].value}
                        >
                          {
                            TARGET_LIST_OPTIONS.map((item, index) => (
                              <Option value={item.value} key={`option-${index.toString()}`}>
                                {item.label}
                              </Option>
                            ))
                          }
                        </Select>
                      )}
                    />
                  </div>
                </Col>
              </Row>
            </Space>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Row style={{ width: '100%' }}>
                <Col span={11}>
                  <div className="t-listFilter_input">
                    <Typography.Text strong>
                      Rel
                    </Typography.Text>
                    <Controller
                      name="rel"
                      render={({ field }) => (
                        <Input
                          className="u-mt-8"
                          size="large"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={`${t('system.input')} rel`}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col span={12} offset={1}>
                  <div className="t-listFilter_input">
                    <Typography.Text strong>
                      Download
                    </Typography.Text>
                    <Controller
                      name="download"
                      render={({ field }) => (
                        <div>
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      )}
                    />
                  </div>
                </Col>
              </Row>
            </Space>
            <Space align="center" direction="vertical" size={20} style={{ width: '100%' }}>
              <Button
                loading={updateMenuItemLoading}
                type="primary"
                htmlType="submit"
              >
                <SaveOutlined />
                {t('system.save')}
              </Button>
            </Space>
          </Space>
        </Form>
      </div>
    </Modal>
  );
};

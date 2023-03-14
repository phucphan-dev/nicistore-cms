import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import {
  Button, Card, Col, Collapse, message, Modal, Row, Space, Spin, Typography
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  FormProvider, useFieldArray, useForm
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import FormFieldModal from './RenderUI/FormFieldModal';
import { RenderInputFormField, RenderLanguageInputFormField } from './RenderUI/RenderFormElement';
import { generateLangObject } from './RenderUI/helper';
import {
  FormDetailType, FormFieldItemType, FormFieldType
} from './types';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import { createFormManagementService, getFormManagementService, updateFormManagementService } from 'common/services/forms';
import { UpdateFormManagementParams } from 'common/services/forms/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import roles, { getPermission } from 'configs/roles';

const FormDetail: React.FC<ActiveRoles> = ({ roleCreate, roleUpdate }) => {
  /* Hook */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idParams = Number(searchParams.get('id'));
  const queryClient = useQueryClient();

  /* States */
  const [formModal, setFormModal] = useState<{
    open: boolean;
    formIdx?: number;
    defaultForm?: FormFieldType;
  }>({
    open: false,
  });

  /* Store */
  const rolesUser = useAppSelector((state) => state.auth.roles);
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);

  /* React-hook-form */
  const method = useForm<FormDetailType>({
    defaultValues: {
      name: '',
      htmlId: '',
      htmlClass: '',
      fields: [],
      buttons: {
        submit: {
          htmlId: '',
          htmlClass: '',
          text: generateLangObject(
            languageOptions.map((ele) => (ele.value?.toString() || defaultWebsiteLanguage || 'vi'))
          )
        },
        reset: {
          htmlId: '',
          htmlClass: '',
          text: generateLangObject(
            languageOptions.map((ele) => (ele.value?.toString() || defaultWebsiteLanguage || 'vi'))
          )
        }
      }
    }
  });

  const {
    fields, append, remove, update, move,
  } = useFieldArray({
    control: method.control,
    name: 'fields'
  });

  const {
    isFetching: detailLoading,
    data: detailData,
  } = useQuery(
    ['formManagement-detail', idParams],
    () => getFormManagementService({ id: idParams }),
    { enabled: !!idParams }
  );

  const { mutate: createMutate, isLoading: createLoading } = useMutation(
    ['formManagement-create'],
    createFormManagementService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.FORM_MANAGEMENT}`);
        method.reset();
      },
      onError: () => {
        message.error(t('message.createError'));
      }
    }
  );

  const { mutate: updateMutate, isLoading: updateLoading } = useMutation(
    ['formManagement-update'],
    async (params: UpdateFormManagementParams) => updateFormManagementService(params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['formManagement-detail', idParams]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }

    }
  );

  /* Functions */
  const handleAddField = (data: FormFieldType) => {
    append(data);
  };

  const handleUpdateField = (data: FormFieldType) => {
    if (formModal.formIdx !== undefined) {
      update(formModal.formIdx, data);
    }
  };

  const handleSubmit = (data: FormDetailType) => {
    if (idParams) {
      updateMutate({
        id: idParams,
        ...data,
      });
    } else {
      createMutate(data);
    }
  };

  /* Effects */
  useEffect(() => {
    if (detailData) {
      method.reset(detailData);
    }
  }, [method, detailData]);

  return (
    <>
      <HeaderPage
        fixed
        title={idParams ? t('formManagement.detailEdit') : t('formManagement.detailCreate')}
        rightHeader={(
          <Button
            type="primary"
            onClick={() => method.handleSubmit(handleSubmit)()}
            disabled={(idParams && !roleUpdate) || (!idParams && !roleCreate)}
            loading={createLoading || updateLoading}
          >
            <SaveOutlined />
            {' '}
            {t('system.save')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <Spin size="large" spinning={detailLoading}>
          <FormProvider<FormDetailType> {...method}>
            <Card>
              <Row gutter={[16, 16]}>
                <Col>
                  {/* name */}
                  <RenderInputFormField
                    required
                    propertyKey="name"
                  />
                </Col>
                <Col span={12}>
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                </Col>
                <Col span={12}>
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                </Col>
              </Row>
            </Card>
            {/* Fields */}
            <div className="p-forms_content u-mt-16">
              <div className="p-forms_fields">
                <span>
                  {t('formManagement.formFields')}
                  {' '}
                  (
                  {fields.length}
                  )
                </span>
              </div>
              <Collapse>
                {fields.map((field, index) => (
                  <Collapse.Panel
                    key={`${index.toString()}`}
                    header={(
                      <Space style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                      >
                        <Typography.Title level={5} style={{ marginBottom: 0 }}>
                          {field.data?.inputName}
                        </Typography.Title>
                        <Space>
                          {fields.length > 1 && (
                            <>
                              <Button
                                type="text"
                                disabled={index === 0}
                                onClick={(e) => {
                                  if (e.stopPropagation) e.stopPropagation();
                                  move(index, index - 1);
                                }}
                                icon={(<ArrowUpOutlined />)}
                              />
                              <Button
                                type="text"
                                disabled={index === fields.length - 1}
                                onClick={(e) => {
                                  if (e.stopPropagation) e.stopPropagation();
                                  move(index, index + 1);
                                }}
                                icon={(<ArrowDownOutlined />)}
                              />
                            </>
                          )}
                          <Button
                            type="text"
                            onClick={(e) => {
                              if (e.stopPropagation) e.stopPropagation();
                              setFormModal({ open: true, formIdx: index, defaultForm: field });
                            }}
                            icon={(<EditOutlined />)}
                          />
                          <Button
                            type="text"
                            onClick={(e) => {
                              if (e.stopPropagation) e.stopPropagation();
                              Modal.confirm({
                                className: 't-pagetable_deleteLanguageModal',
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
                                onOk: () => remove(index),
                              });
                            }}
                            icon={(<DeleteOutlined />)}
                          />
                        </Space>
                      </Space>
                    )}
                  >
                    <table className="p-forms_table">
                      {Object.entries(field.data).map(([key, value]) => (
                        <tr>
                          <td>
                            <p className="label">
                              {key}
                            </p>
                          </td>
                          <td>
                            <p>
                              {(() => {
                                if (Array.isArray(value)) {
                                  if (key === 'items') {
                                    //* Check if array object, ex: items: {text, value}[];
                                    return (value as FormFieldItemType[]).map((ele) => (ele.text)).join(', ');
                                  }
                                  //* case string[] / number[];
                                  return (value as (string | number)[]).map((ele) => (ele.toString())).join(', ');
                                }
                                if (key === 'label' || key === 'placeholder') {
                                  //* case label, placeholder - {[lang: string]: string};
                                  const val = value as {
                                    [lang: string]: string;
                                  };
                                  return (
                                    <Space direction="vertical">
                                      {Object.entries(val).map(([itemKey, itemVal]) => (
                                        <Space key={`${field.id}-${key}-${itemKey}`}>
                                          <p className="success">
                                            {itemKey}
                                            :
                                          </p>
                                          <p>
                                            {itemVal}
                                          </p>
                                        </Space>
                                      ))}
                                    </Space>
                                  );
                                }
                                return (value || '').toString();
                              })()}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </Collapse.Panel>
                ))}
              </Collapse>
            </div>
            <Button
              type="primary"
              className="btn-center u-mt-24"
              disabled={!getPermission(rolesUser, roles.FORM_STORE)
                || !getPermission(rolesUser, roles.FORM_UPDATE)}
              onClick={() => setFormModal({ open: true })}
            >
              <PlusOutlined />
              {t('system.addNewField')}
            </Button>
            {/* Buttons */}
            <div className="u-mt-16">
              <div className="p-forms_fields">
                <span>
                  {t('formManagement.formButtons')}
                </span>
              </div>
              <Row className="u-mt-16" gutter={16}>
                <Col md={12}>
                  <Collapse>
                    <Collapse.Panel
                      key="buttons-submit"
                      header="Submit"
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {/* htmlId */}
                        <RenderInputFormField
                          labelKey="htmlId"
                          propertyKey="buttons[submit][htmlId]"
                        />
                        {/* htmlClass */}
                        <RenderInputFormField
                          labelKey="htmlClass"
                          propertyKey="buttons[submit][htmlClass]"
                        />
                        {/* text */}
                        <RenderLanguageInputFormField
                          labelKey="text"
                          propertyKey="buttons[submit][text]"
                        />
                      </Space>
                    </Collapse.Panel>
                  </Collapse>
                </Col>
                <Col md={12}>
                  <Collapse>
                    <Collapse.Panel
                      key="buttons-reset"
                      header="Reset"
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {/* htmlId */}
                        <RenderInputFormField
                          labelKey="htmlId"
                          propertyKey="buttons[reset][htmlId]"
                        />
                        {/* htmlClass */}
                        <RenderInputFormField
                          labelKey="htmlClass"
                          propertyKey="buttons[reset][htmlClass]"
                        />
                        {/* text */}
                        <RenderLanguageInputFormField
                          labelKey="text"
                          propertyKey="buttons[reset][text]"
                        />
                      </Space>
                    </Collapse.Panel>
                  </Collapse>
                </Col>
              </Row>
            </div>
          </FormProvider>
        </Spin>
      </div>
      <FormFieldModal
        open={formModal.open}
        defaultForm={formModal.defaultForm}
        handleClose={() => setFormModal({ open: false })}
        handleAddField={handleAddField}
        handleUpdateField={handleUpdateField}
      />
    </>
  );
};

export default FormDetail;

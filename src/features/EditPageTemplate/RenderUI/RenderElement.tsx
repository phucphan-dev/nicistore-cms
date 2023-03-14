import {
  ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined
} from '@ant-design/icons';
import {
  Button,
  Card, Checkbox, Col, Collapse, Modal, Row, Select, Space, Typography
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useMemo, useState, useEffect } from 'react';
import {
  Control, Controller, FieldValues, useFieldArray,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { generateDefaultVal, targetDummy } from './dataFunc';

import { DropdownElement } from 'common/components/DropdownType';
import Editor, { SimpleEditor } from 'common/components/Editor';
import Input from 'common/components/Input';
import SelectFile, { SelectMultipleFile } from 'common/components/SelectFile';
import { INTEGER_REGEX, newsListSortBy, newsListSortType } from 'common/utils/constant';

type RenderElementProps = {
  eleIdx?: number;
  elementName: string;
  type: string;
  label: string;
  locale?: string;
  element?: ElementBlockType;
  control: Control<FieldValues, any>;
  handleChangeTitleAlt?: (title?: string, alt?: string) => void;
};

type RenderRepeaterElementProps = {
  elementName: string;
  label?: string;
  element: ElementBlockType;
  control: Control<FieldValues, any>;
  renderEle: (
    props: {
      field: Record<'id', any>,
      fieldIdx: number,
      arrName: string,
    }
  ) => React.ReactNode;
};

const RenderRepeaterElement: React.FC<RenderRepeaterElementProps> = ({
  elementName, element, label, control, renderEle
}) => {
  const { t } = useTranslation();
  const {
    fields, append, remove, move
  } = useFieldArray({
    control,
    name: elementName,
  });

  const [active, setActive] = useState(-1);

  const defaultVal = useMemo(() => [generateDefaultVal(element)], [element]);

  useEffect(() => {
    setTimeout(() => {
      setActive(-1);
    }, 1000);
  }, [active]);

  return (
    <div className="u-mt-16">
      {fields.length > 0 && fields.map((field, index) => (
        <div key={field.id} className="u-mt-16">
          <Collapse>
            <Collapse.Panel
              forceRender
              className={active === index ? 'repeaterActive' : undefined}
              header={(
                <div className="p-editPageTemplate_blockHeader">
                  <Typography.Title level={5} style={{ marginBottom: 0 }}>
                    {label}
                  </Typography.Title>
                  {fields.length > 1 && (
                    <Space size={8}>
                      <Button
                        type="text"
                        disabled={index === 0}
                        onClick={(e) => {
                          if (e.stopPropagation) e.stopPropagation();
                          move(index, index - 1);
                          setActive(index - 1);
                        }}
                        icon={(<ArrowUpOutlined />)}
                      />
                      <Button
                        type="text"
                        disabled={index === fields.length - 1}
                        onClick={(e) => {
                          if (e.stopPropagation) e.stopPropagation();
                          move(index, index + 1);
                          setActive(index + 1);
                        }}
                        icon={(<ArrowDownOutlined />)}
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
                  )}
                </div>
              )}
              key={`${elementName}-${field.id}-panel`}
            >
              {renderEle({
                field,
                fieldIdx: index,
                arrName: elementName,
              })}
            </Collapse.Panel>
          </Collapse>
        </div>
      ))}
      <Space
        direction="horizontal"
        size={12}
        style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
      >
        <Button
          size="large"
          type="primary"
          icon={(<PlusOutlined />)}
          onClick={() => {
            append(defaultVal);
          }}
        >
          {t('system.addNew')}
        </Button>
      </Space>
    </div>
  );
};

const RenderElement: React.FC<RenderElementProps> = ({
  eleIdx, elementName, type, label, element, control, locale, handleChangeTitleAlt
}) => {
  const { t } = useTranslation();
  const InputHidden: React.FC = () => null;

  switch (type) {
    case 'repeater': {
      if (element) {
        return (
          <Col span={24} className="u-mt-16">
            <Card title={t(label)} type="inner">
              <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
              <RenderRepeaterElement
                control={control}
                elementName={`${elementName}[data]`}
                label={t(label)}
                element={element}
                renderEle={({ field, fieldIdx, arrName }) => {
                  const innerEle = Object.entries(element);
                  return innerEle.map((item) => (
                    <RenderElement
                      control={control}
                      key={`${field.id}-${item[0]}`}
                      eleIdx={eleIdx}
                      elementName={`${arrName}[${fieldIdx}].${item[0]}`}
                      type={item[1].type}
                      label={item[1].label}
                      element={item[1].elements}
                    />
                  ));
                }}
              />
            </Card>
          </Col>
        );
      }
      return null;
    }
    case 'text':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Typography.Text strong>
              {t(label)}
            </Typography.Text>
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data]`}
              defaultValue=""
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Input
                  className="u-mt-8"
                  name={`${elementName}[data]`}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                  size="large"
                />
              )}
            />
          </div>
        </Col>
      );
    case 'textarea':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Typography.Text strong>
              {t(label)}
            </Typography.Text>
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data]`}
              defaultValue=""
              render={({
                field: { value, onChange },
              }) => (
                <TextArea
                  className="u-mt-8"
                  name={elementName}
                  value={value}
                  onChange={onChange}
                  size="large"
                  rows={2}
                  style={{ minHeight: 50 }}
                />
              )}
            />
          </div>
        </Col>
      );
    case 'ckeditor':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Typography.Text strong>
              {t(label)}
            </Typography.Text>
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data]`}
              defaultValue=""
              render={({
                field: { value, onChange },
              }) => (
                <Editor
                  value={value || ''}
                  handleChange={(_event: any, editor: any) => {
                    const data = editor.getData();
                    onChange(data);
                  }}
                />
              )}
            />
          </div>
        </Col>
      );
    case 'simpleCkeditor':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Typography.Text strong>
              {t(label)}
            </Typography.Text>
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data]`}
              defaultValue=""
              render={({
                field: { value, onChange },
              }) => (
                <SimpleEditor
                  value={value || ''}
                  handleChange={(_event: any, editor: any) => {
                    const data = editor.getData();
                    onChange(data);
                  }}
                />
              )}
            />
          </div>
        </Col>
      );
    case 'link':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Card
              title={(
                <Typography.Title level={5}>
                  {t(label)}
                </Typography.Title>
              )}
              style={{ width: '100%' }}
            >
              <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
              <Row gutter={14}>
                <Col span={8}>
                  <Typography.Text strong>
                    Text
                  </Typography.Text>
                  <Controller
                    name={`${elementName}[data].text`}
                    defaultValue=""
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Input
                        className="u-mt-8"
                        name={elementName}
                        value={value}
                        onChange={onChange}
                        error={error?.message}
                        size="large"
                      />
                    )}
                  />
                </Col>
                <Col span={8}>
                  <Typography.Text strong>
                    Url
                  </Typography.Text>
                  <Controller
                    name={`${elementName}[data].url`}
                    defaultValue=""
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Input
                        className="u-mt-8"
                        name={elementName}
                        value={value}
                        onChange={onChange}
                        error={error?.message}
                        size="large"
                      />
                    )}
                  />
                </Col>
                <Col span={8}>
                  <Typography.Text strong>
                    Target
                  </Typography.Text>
                  <Controller
                    name={`${elementName}[data].target`}
                    defaultValue="_self"
                    render={({
                      field: { value, onChange },
                    }) => (
                      <Select
                        className="u-mt-8"
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="---"
                        value={targetDummy.find((item) => item.value === value)}
                        onChange={(item) => {
                          onChange(item.value);
                        }}
                      >
                        {
                          targetDummy.map((val, idx) => (
                            <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                              {val.label}
                            </Select.Option>
                          ))
                        }
                      </Select>
                    )}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        </Col>
      );
    case 'googleMapApi':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Card
              title={(
                <Typography.Title level={5}>
                  {t(label)}
                </Typography.Title>
              )}
              style={{ width: '100%' }}
            >
              <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
              <Row gutter={14}>
                <Col span={12}>
                  <Typography.Text strong>
                    Lat
                  </Typography.Text>
                  <Controller
                    name={`${elementName}[data].latitude`}
                    defaultValue={0}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Input
                        type="text"
                        size="large"
                        className="u-mt-8"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={value}
                        onChange={(e) => {
                          const pattern = new RegExp(INTEGER_REGEX);
                          if (pattern.test(e.target.value)) {
                            onChange(e.target.value);
                          }
                        }}
                        error={error?.message}
                      />
                    )}
                  />
                </Col>
                <Col span={12}>
                  <Typography.Text strong>
                    Lng
                  </Typography.Text>
                  <Controller
                    name={`${elementName}[data].longitude`}
                    defaultValue={0}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Input
                        type="text"
                        size="large"
                        className="u-mt-8"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={value}
                        onChange={(e) => {
                          const pattern = new RegExp(INTEGER_REGEX);
                          if (pattern.test(e.target.value)) {
                            onChange(e.target.value);
                          }
                        }}
                        error={error?.message}
                      />
                    )}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        </Col>
      );
    case 'boolean':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data]`}
              defaultValue={false}
              render={({
                field: { value, onChange },
              }) => (
                <Checkbox
                  checked={value}
                  onChange={onChange}
                >
                  {t(label)}
                </Checkbox>
              )}
            />
          </div>
        </Col>
      );
    case 'numeric':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Typography.Text strong>
              {t(label)}
            </Typography.Text>
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data]`}
              defaultValue={0}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  className="u-mt-8"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  value={value}
                  onChange={(e) => {
                    const pattern = new RegExp(INTEGER_REGEX);
                    if (pattern.test(e.target.value)) {
                      onChange(e.target.value);
                    }
                  }}
                  error={error?.message}
                  size="large"
                />
              )}
            />
          </div>
        </Col>
      );
    case 'integer':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Typography.Text strong>
              {t(label)}
            </Typography.Text>
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data]`}
              defaultValue={0}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  className="u-mt-8"
                  value={value}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(e) => {
                    const numberInput = e.target.value.replace(/\D+/g, '');
                    onChange(numberInput);
                  }}
                  error={error?.message}
                  size="large"
                />
              )}
            />
          </div>
        </Col>
      );
    case 'uploadFile':
    case 'video':
      return (
        <Col span={12}>
          <div className="u-mt-16">
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data][path]`}
              defaultValue=""
              render={({
                field: { value, onChange },
              }) => (
                <SelectFile
                  title={t(label) || ''}
                  value={value}
                  notImage
                  name={`${elementName}[data][path]`}
                  handleSelect={(url, title, alt) => {
                    onChange(url);
                    if (handleChangeTitleAlt) {
                      handleChangeTitleAlt(title, alt);
                    }
                  }}
                  handleDelete={() => onChange(undefined)}
                />
              )}
            />
          </div>
        </Col>
      );
    case 'uploadImages':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data]`}
              render={({
                field: { value, onChange },
              }) => (
                <SelectMultipleFile
                  title={t(label) || ''}
                  value={value}
                  handleSelect={(data) => {
                    onChange(data);
                  }}
                  handleDelete={(data) => onChange(data)}
                />
              )}
            />
          </div>
        </Col>
      );
    case 'uploadImage':
      return (
        <Col span={12}>
          <div className="u-mt-16">
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data][path]`}
              defaultValue=""
              render={({
                field: { value, onChange },
              }) => (
                <SelectFile
                  title={t(label) || ''}
                  value={value}
                  hasOptions
                  name={`${elementName}[data][path]`}
                  titleName={`${elementName}[data][title]`}
                  altName={`${elementName}[data][alt]`}
                  handleSelect={(url, title, alt) => {
                    onChange(url);
                    if (handleChangeTitleAlt) {
                      handleChangeTitleAlt(title, alt);
                    }
                  }}
                  handleDelete={() => onChange(undefined)}
                />
              )}
            />
          </div>
        </Col>
      );
    case 'banner':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Typography.Text strong>
              {t(label)}
            </Typography.Text>
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data]`}
              render={({
                field: { value, onChange },
              }) => (
                <DropdownElement
                  type="banner"
                  placeholder="---"
                  locale={locale || 'vi'}
                  value={value}
                  onChange={onChange}
                  isValueSlug
                />
              )}
            />
          </div>
        </Col>
      );
    case 'menu':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Typography.Text strong>
              {t(label)}
            </Typography.Text>
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data]`}
              render={({
                field: { value, onChange },
              }) => (
                <DropdownElement
                  type="menu"
                  placeholder="---"
                  locale={locale || 'vi'}
                  value={value}
                  onChange={onChange}
                  isValueSlug
                />
              )}
            />
          </div>
        </Col>
      );
    case 'newsList':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Card
              title={(
                <Typography.Title level={5}>
                  {t(label)}
                </Typography.Title>
              )}
              style={{ width: '100%' }}
            >
              <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
              <Typography.Text strong>
                Categories
              </Typography.Text>
              <Controller
                name={`${elementName}[data][queries].categoryIds`}
                render={({
                  field: { value, onChange },
                }) => (
                  <DropdownElement
                    type="newsCategory"
                    placeholder="Please select"
                    locale={locale || 'vi'}
                    value={value}
                    onChange={onChange}
                    multiple={{
                      allowClear: true,
                      defaultValue: []
                    }}
                  />
                )}
              />
              <div className="u-mt-16">
                <Row gutter={14}>
                  <Col span={8}>
                    <Typography.Text strong>
                      Number of records
                    </Typography.Text>
                    <Controller
                      name={`${elementName}[data][queries].limit`}
                      defaultValue={0}
                      render={({
                        field: { value, onChange },
                      }) => (
                        <Input
                          type="text"
                          size="large"
                          className="u-mt-8"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={value}
                          onChange={(e) => {
                            const numberInput = e.target.value.replace(/\D+/g, '');
                            onChange(numberInput);
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Typography.Text strong>
                      Sort By
                    </Typography.Text>
                    <Controller
                      name={`${elementName}[data][queries].sortBy`}
                      render={({
                        field: { value, onChange },
                      }) => (
                        <Select
                          size="large"
                          className="u-mt-8"
                          style={{ width: '100%' }}
                          placeholder="---"
                          value={value}
                          onChange={onChange}
                        >
                          {
                            newsListSortBy.map((val, idx) => (
                              <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                                {val.label}
                              </Select.Option>
                            ))
                          }
                        </Select>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Typography.Text strong>
                      Sort Type
                    </Typography.Text>
                    <Controller
                      name={`${elementName}[data][queries].sortType`}
                      render={({
                        field: { value, onChange },
                      }) => (
                        <Select
                          size="large"
                          className="u-mt-8"
                          style={{ width: '100%' }}
                          placeholder="---"
                          value={value}
                          onChange={onChange}
                        >
                          {
                            newsListSortType.map((val, idx) => (
                              <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                                {val.label}
                              </Select.Option>
                            ))
                          }
                        </Select>
                      )}
                    />
                  </Col>
                </Row>
              </div>
              <div className="u-mt-16">
                <Card
                  title={(
                    <Typography.Title level={5}>
                      View more
                    </Typography.Title>
                  )}
                  style={{ width: '100%' }}
                >
                  <Row gutter={14}>
                    <Col span={8}>
                      <Typography.Text strong>
                        Text
                      </Typography.Text>
                      <Controller
                        name={`${elementName}[data][viewMore].text`}
                        defaultValue=""
                        render={({
                          field: { value, onChange },
                          fieldState: { error },
                        }) => (
                          <Input
                            className="u-mt-8"
                            name={elementName}
                            value={value}
                            onChange={onChange}
                            error={error?.message}
                            size="large"
                          />
                        )}
                      />
                    </Col>
                    <Col span={8}>
                      <Typography.Text strong>
                        Url
                      </Typography.Text>
                      <Controller
                        name={`${elementName}[data][viewMore].url`}
                        defaultValue=""
                        render={({
                          field: { value, onChange },
                          fieldState: { error },
                        }) => (
                          <Input
                            className="u-mt-8"
                            name={elementName}
                            value={value}
                            onChange={onChange}
                            error={error?.message}
                            size="large"
                          />
                        )}
                      />
                    </Col>
                    <Col span={8}>
                      <Typography.Text strong>
                        Target
                      </Typography.Text>
                      <Controller
                        name={`${elementName}[data][viewMore].target`}
                        defaultValue="_self"
                        render={({
                          field: { value, onChange },
                        }) => (
                          <Select
                            className="u-mt-8"
                            size="large"
                            style={{ width: '100%' }}
                            placeholder="---"
                            value={targetDummy.find((item) => item.value === value)}
                            onChange={(item) => {
                              onChange(item.value);
                            }}
                          >
                            {
                              targetDummy.map((val, idx) => (
                                <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                                  {val.label}
                                </Select.Option>
                              ))
                            }
                          </Select>
                        )}
                      />
                    </Col>
                  </Row>
                </Card>
              </div>
            </Card>
          </div>
        </Col>
      );
    case 'phone':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Card
              title={(
                <Typography.Title level={5}>
                  {t(label)}
                </Typography.Title>
              )}
              style={{ width: '100%' }}
            >
              <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
              <Row gutter={14}>
                <Col span={12}>
                  <Typography.Text strong>
                    {t('system.textPhone')}
                  </Typography.Text>
                  <Controller
                    name={`${elementName}[data].text`}
                    defaultValue={0}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Input
                        type="text"
                        size="large"
                        className="u-mt-8"
                        value={value}
                        onChange={onChange}
                        error={error?.message}
                      />
                    )}
                  />
                </Col>
                <Col span={12}>
                  <Typography.Text strong>
                    {t('system.valuePhone')}
                  </Typography.Text>
                  <Controller
                    name={`${elementName}[data].phoneToCall`}
                    defaultValue={0}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Input
                        type="text"
                        size="large"
                        className="u-mt-8"
                        value={value}
                        error={error?.message}
                        onChange={onChange}
                      />
                    )}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        </Col>
      );
    case 'email':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Card
              title={(
                <Typography.Title level={5}>
                  {t(label)}
                </Typography.Title>
              )}
              style={{ width: '100%' }}
            >
              <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
              <Row gutter={14}>
                <Col span={12}>
                  <Typography.Text strong>
                    {t('system.textEmail')}
                  </Typography.Text>
                  <Controller
                    name={`${elementName}[data].text`}
                    defaultValue={0}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Input
                        type="text"
                        size="large"
                        className="u-mt-8"
                        value={value}
                        onChange={onChange}
                        error={error?.message}
                      />
                    )}
                  />
                </Col>
                <Col span={12}>
                  <Typography.Text strong>
                    {t('system.valueEmail')}
                  </Typography.Text>
                  <Controller
                    name={`${elementName}[data].mailToSend`}
                    defaultValue={0}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Input
                        type="text"
                        size="large"
                        className="u-mt-8"
                        value={value}
                        onChange={onChange}
                        error={error?.message}
                      />
                    )}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        </Col>
      );
    case 'form':
      return (
        <Col span={24}>
          <div className="u-mt-16">
            <Typography.Text strong>
              {t(label)}
            </Typography.Text>
            <Controller name={`${elementName}[type]`} defaultValue={type} render={() => <InputHidden />} />
            <Controller
              name={`${elementName}[data]`}
              render={({
                field: { value, onChange },
              }) => (
                <DropdownElement
                  type="form"
                  placeholder="---"
                  locale={locale || 'vi'}
                  value={value}
                  onChange={onChange}
                  isValueSlug
                />
              )}
            />
          </div>
        </Col>
      );
    default:
      return null;
  }
};

export default RenderElement;

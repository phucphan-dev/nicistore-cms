import {
  PlusOutlined, TranslationOutlined
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  DatePicker,
  Divider, Select, Space, Tooltip, Typography
} from 'antd';
import moment from 'moment';
import React, {
  useState, useRef, useMemo, useEffect
} from 'react';
import {
  Controller, useForm, useFormContext,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormFieldItemType,
  FormFieldEnum
} from '../types';

import { useAppSelector } from 'app/store';
import ErrorText from 'common/components/ErrorText';
import Input from 'common/components/Input';
import useClickOutside from 'common/hooks/useClickOutside';
import { INTEGER_REGEX } from 'common/utils/constant';
import { enumToMap } from 'common/utils/enumHelper';
import mapModifiers from 'common/utils/functions';

type RenderCheckboxFormFieldProps = {
  labelKey?: string;
  propertyKey: string
};

export const RenderCheckboxFormField: React.FC<RenderCheckboxFormFieldProps> = ({
  labelKey,
  propertyKey
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <Controller
        name={`${propertyKey}`}
        defaultValue={false}
        render={({
          field: { value, onChange },
          fieldState: { error },
        }) => (
          <>
            <Checkbox
              checked={value}
              onChange={onChange}
            >
              {t(`formManagement.${labelKey || propertyKey}FormField`)}
            </Checkbox>
            {
              error && (
                <ErrorText>
                  {error.message}
                </ErrorText>
              )
            }
          </>
        )}
      />
    </div>
  );
};

type RenderInputFormFieldProps = {
  labelKey?: string;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'number';
  pattern?: {
    value: RegExp;
    message: string;
  }
  propertyKey: string
};

export const RenderInputFormField: React.FC<RenderInputFormFieldProps> = ({
  labelKey,
  placeholder,
  required,
  type,
  pattern,
  propertyKey
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <Typography.Text strong>
        {t(`formManagement.${labelKey || propertyKey}FormField`)}
      </Typography.Text>
      {required && (
        <Typography.Text type="danger">
          {' '}
          *
        </Typography.Text>
      )}
      <Controller
        name={`${propertyKey}`}
        rules={{
          ...required && { required: 'Thông tin bắt buộc' },
          ...pattern && {
            pattern: {
              value: pattern.value,
              message: pattern.message,
            }
          }
        }}
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
            placeholder={placeholder || `${t('system.input')} ${t(`formManagement.${labelKey || propertyKey}FormField`)}`}
            {...type === 'number' && {
              inputMode: 'decimal',
              pattern: '[0-9]*\\.?[0-9]*',
              onChange: (e) => {
                const regexPattern = new RegExp(INTEGER_REGEX);
                if (regexPattern.test(e.target.value)) {
                  onChange(e.target.value);
                }
              }
            }}
          />
        )}
      />
    </div>
  );
};

type RenderLanguageInputFormFieldProps = {
  labelKey?: string;
  propertyKey: string;
};

export const RenderLanguageInputFormField: React.FC<RenderLanguageInputFormFieldProps> = ({
  labelKey,
  propertyKey
}) => {
  /* Hooks */
  const { t } = useTranslation();

  /* Selectors */
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);

  const [openMenu, setOpenMenu] = useState(false);

  const refMenu = useRef<HTMLDivElement>(null);

  useClickOutside(refMenu, () => openMenu && setOpenMenu(false));

  return (
    <div>
      <Typography.Text strong>
        {t(`formManagement.${labelKey || propertyKey}FormField`)}
      </Typography.Text>
      <Controller
        name={`${propertyKey}`}
        render={({
          field: { value, onChange },
          fieldState: { error },
        }) => (
          <div ref={refMenu} className="renderFormField_languageInput">
            <Input
              type="text"
              size="large"
              value={value
                && defaultWebsiteLanguage
                ? value[defaultWebsiteLanguage] : ''}
              onChange={(e) => {
                onChange({
                  ...value,
                  ...(defaultWebsiteLanguage && { [defaultWebsiteLanguage]: e.target.value })
                });
              }}
              error={error?.message}
              placeholder={`${t('system.input')} ${t(`formManagement.${labelKey || propertyKey}FormField`)}`}
              prefix={(
                <Typography.Text type="secondary">
                  {defaultWebsiteLanguage}
                </Typography.Text>
              )}
              suffix={(
                <Tooltip title={t('formManagement.otherLanguages')}>
                  <TranslationOutlined onClick={() => { setOpenMenu(!openMenu); }} />
                </Tooltip>
              )}
            />
            <div className={mapModifiers('renderFormField_languageInput_menu', openMenu && 'open')}>
              {
                languageOptions
                  .filter((option) => option?.value !== defaultWebsiteLanguage)
                  .map((ele, idx) => (
                    <Input
                      key={`${propertyKey}-${ele.value}-${idx.toString()}`}
                      type="text"
                      size="large"
                      className="u-mt-8"
                      value={value && ele.value ? value[ele.value] : ''}
                      onChange={(e) => {
                        onChange({
                          ...value,
                          ...(ele.value && { [ele.value]: e.target.value })
                        });
                      }}
                      placeholder={`${t('system.input')} ${t(`formManagement.${labelKey || propertyKey}FormField`)}`}
                      error={error?.message}
                      prefix={(
                        <Typography.Text type="secondary">
                          {ele.value || ''}
                        </Typography.Text>
                      )}
                    />
                  ))
              }
            </div>
          </div>
        )}
      />
    </div>
  );
};

const DropDownRender = (
  menu: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
  listAvailable: FormFieldItemType[],
  addItem: (text: string, value: string) => void
) => {
  /* Hook */
  const { t } = useTranslation();

  const dropdownMethod = useForm<{
    label: string;
    value: string;
  }>({
    defaultValues: {
      label: '',
      value: '',
    }
  });

  return (
    <>
      {menu}
      <Divider style={{ margin: '8px 0' }} />
      <div className="renderFormField_dropdownSelect">
        <div className="renderFormField_dropdownSelect_inputs">
          <Controller
            control={dropdownMethod.control}
            name="label"
            rules={{
              required: 'Thông tin bắt buộc'
            }}
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
                placeholder={`${t('system.input')} ${t('formManagement.labelFormField')}`}
              />
            )}
          />
          <Controller
            control={dropdownMethod.control}
            name="value"
            rules={{
              required: 'Thông tin bắt buộc',
              validate: {
                notDuplicateValue: (v) => {
                  const checkDup = [...listAvailable].find((ele) => ele.value === v);
                  if (checkDup) return `No duplicate value. Duplicate: ${checkDup.text}`;
                  return true;
                },
              }
            }}
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
                placeholder={`${t('system.input')} ${t('formManagement.valueFormField')}`}
              />
            )}
          />
        </div>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={async () => {
            const result = await dropdownMethod.trigger();
            if (result) {
              const { label, value } = dropdownMethod.getValues();
              addItem(label, value);
              dropdownMethod.reset();
            }
          }}
        >
          {t('system.addNew')}
        </Button>
      </div>
    </>
  );
};

type RenderMultipleItemsFormFieldProps = {
  required?: boolean;
  propertyKey: string
};

export const RenderMultipleItemsFormField: React.FC<RenderMultipleItemsFormFieldProps> = (
  { required, propertyKey }
) => {
  /* Hooks */
  const { t } = useTranslation();
  const { getValues } = useFormContext();

  const [listAvailable, setListAvailable] = useState<FormFieldItemType[]>([]);

  const handleAddItem = (newText: string, newValue: string) => {
    setListAvailable((prev) => [...prev, { text: newText, value: newValue }]);
  };

  useEffect(() => {
    const currVal = getValues(`${propertyKey}`);
    if (Array.isArray(currVal) && currVal.length > 0) {
      setListAvailable(currVal);
    }
  }, [getValues, propertyKey]);

  return (
    <div>
      <Typography.Text strong>
        {t(`formManagement.${propertyKey}FormField`)}
      </Typography.Text>
      {required && (
        <Typography.Text type="danger">
          {' '}
          *
        </Typography.Text>
      )}
      <Controller
        name={`${propertyKey}`}
        defaultValue={[]}
        rules={{
          ...required && { required: 'Thông tin bắt buộc' },
        }}
        render={({
          field: { value, onChange },
          fieldState: { error },
        }) => (
          <>
            <Select
              className="u-mt-8"
              size="large"
              style={{ width: '100%' }}
              labelInValue
              value={value}
              onChange={(newValue) => {
                onChange([...newValue].map((ele) => ({
                  text: ele.label,
                  value: ele.value
                })));
              }}
              mode="multiple"
              allowClear
              placeholder={`${t('system.select')} ${t(`formManagement.${propertyKey}FormField`)}`}
              dropdownRender={(menu) => DropDownRender(
                menu,
                listAvailable,
                handleAddItem
              )}
            >
              {(listAvailable).map((ele, idx) => (
                <Select.Option
                  key={`option-${propertyKey}-${idx.toString()}`}
                  value={ele.value}
                >
                  {ele.text}
                </Select.Option>
              ))}
            </Select>
            {
              error && (
                <ErrorText>
                  {error.message}
                </ErrorText>
              )
            }
          </>
        )}
      />
    </div>
  );
};

type RenderSelectValueFormFieldProps = {
  required?: boolean;
  propertyKey: string;
  multiple?: {
    allowClear?: boolean;
    defaultValue?: any;
  }
  optionList?: FormFieldItemType[];
};

export const RenderSelectValueFormField: React.FC<RenderSelectValueFormFieldProps> = ({
  required,
  propertyKey,
  multiple,
  optionList,
}) => {
  const { t } = useTranslation();
  const { getValues, setValue } = useFormContext();

  useEffect(() => {
    const currVal = getValues(`${propertyKey}`);
    if (Array.isArray(currVal)) {
      //* Case multiple value
      const listMultiple = optionList?.map((ele) => ele.value) || [];
      const newSelectValueList = [...currVal].filter((ele) => listMultiple.includes(ele));
      setValue(`${propertyKey}`, newSelectValueList);
    } else {
      //* Case single value
      const selectedOption = optionList?.find((ele) => ele.value === getValues(`${propertyKey}`));
      if (!selectedOption) {
        setValue(`${propertyKey}`, []);
      }
    }
  }, [getValues, multiple, optionList, propertyKey, setValue]);

  return (
    <div>
      <Typography.Text strong>
        {t(`formManagement.${propertyKey}FormField`)}
      </Typography.Text>
      {required && (
        <Typography.Text type="danger">
          {' '}
          *
        </Typography.Text>
      )}
      <Controller
        name={`${propertyKey}`}
        defaultValue={multiple ? [] : ''}
        rules={{
          ...required && { required: 'Thông tin bắt buộc' },
        }}
        render={({
          field: { value, onChange },
          fieldState: { error },
        }) => (
          <>
            <Select
              className="u-mt-8"
              size="large"
              style={{ width: '100%' }}
              value={value}
              onChange={onChange}
              placeholder={`${t('system.select')} ${t(`formManagement.${propertyKey}FormField`)}`}
              {...multiple && {
                mode: 'multiple',
                allowClear: multiple.allowClear,
                defaultValue: multiple.defaultValue,
              }}
            >
              {
                (optionList || []).map((option, idx) => (
                  <Select.Option
                    value={option.value}
                    key={`option-${propertyKey}-${idx.toString()}`}
                  >
                    {option.text}
                  </Select.Option>
                ))
              }
            </Select>
            {
              error && (
                <ErrorText>
                  {error.message}
                </ErrorText>
              )
            }
          </>
        )}
      />
    </div>
  );
};

type RenderDateTimePickerFormFieldProps = {
  labelKey?: string;
  propertyKey: string;
  showTime?: {
    format?: string;
    use12Hours?: boolean;
  };
};

export const RenderDateTimePickerFormField: React.FC<RenderDateTimePickerFormFieldProps> = ({
  labelKey,
  propertyKey,
  showTime,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <Controller
        name={`${propertyKey}`}
        defaultValue={false}
        render={({
          field: { value, onChange },
          fieldState: { error },
        }) => (
          <>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Typography.Text strong>
                {t(`formManagement.${labelKey || propertyKey}FormField`)}
              </Typography.Text>
              <DatePicker
                style={{ width: '100%' }}
                value={value ? moment(value) : value}
                onChange={onChange}
                size="large"
                showTime={showTime}
                placeholder={`${t('system.select')} ${t(`formManagement.${labelKey || propertyKey}FormField`)}`}
              />
            </Space>
            {
              error && (
                <ErrorText>
                  {error.message}
                </ErrorText>
              )
            }
          </>
        )}
      />
    </div>
  );
};

type DropdownFieldProps = {
  placeholder?: string;
  value: any;
  onChange: (...event: any[]) => void;
};

export function getDropdownTypeKey(value: string) {
  return Object.entries(FormFieldEnum).find(([, val]) => val === value)?.[0];
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const dropdownOptions = useMemo(() => Array.from(enumToMap(
    FormFieldEnum
  ).entries())
    .map((ele) => ({
      label: t(`formManagement.${ele[0]}TypeLabel`),
      value: ele[1],
    })), [t]);

  return (
    <Select
      className="u-mt-8"
      size="large"
      style={{ width: '100%' }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    >
      {
        dropdownOptions.map((option, idx) => (
          <Select.Option value={option.value} key={`dropdownField-${idx.toString()}`}>
            {option.label}
          </Select.Option>
        ))
      }
    </Select>
  );
};

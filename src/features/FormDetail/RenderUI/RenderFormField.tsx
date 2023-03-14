import {
  Space, Spin,
} from 'antd';
import moment from 'moment';
import React, {
  useEffect, forwardRef, useImperativeHandle, useState,
} from 'react';
import {
  FormProvider, useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormFieldEnum, FormField,
} from '../types';

import {
  RenderCheckboxFormField,
  RenderDateTimePickerFormField,
  RenderInputFormField,
  RenderLanguageInputFormField,
  RenderMultipleItemsFormField,
  RenderSelectValueFormField,
} from './RenderFormElement';
import { generateDefaultFormValue } from './helper';

import { useAppSelector } from 'app/store';
import { EMAIL_REGEX, PHONE_REGEX } from 'common/utils/constant';
import { delay } from 'common/utils/functions';

type RenderFormFieldProps = {
  fieldType: FormFieldEnum;
  defaultFormField?: FormField[FormFieldEnum];
};

export type RenderFormFieldRef = {
  handleSubmit: () => Promise<FormField[FormFieldEnum] | undefined>;
  handleReset: () => void;
  isFormDirty: () => boolean;
};

const RenderFormField = forwardRef<
  RenderFormFieldRef, RenderFormFieldProps
>(({
  fieldType,
  defaultFormField,
}, ref) => {
  /* Hooks */
  const { t } = useTranslation();

  /* States */
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState(fieldType);

  /* React hook form */
  const formFieldMethod = useForm<FormField[FormFieldEnum]>();

  /* Selectors */
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);

  /* Imperative Handle */
  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      const result = await formFieldMethod.trigger();
      if (result) {
        //* Check if type date
        if (fieldType === FormFieldEnum.date) {
          const data = formFieldMethod.getValues() as FormField[typeof fieldType];
          const transformData: FormField[typeof fieldType] = {
            ...data,
            ...(data.defaultValue && {
              defaultValue: moment(data.defaultValue).format('YYYY-MM-DD')
            })
          };
          return transformData;
        }

        //* Check if type datetime
        if (fieldType === FormFieldEnum.dateTime) {
          const data = formFieldMethod.getValues() as FormField[typeof fieldType];
          const transformData: FormField[typeof fieldType] = {
            ...data,
            ...(data.defaultValue && {
              defaultValue: moment(data.defaultValue).format('YYYY-MM-DDTHH:mm:ssZZ')
            })
          };
          return transformData;
        }

        return formFieldMethod.getValues();
      }
      return undefined;
    },
    handleReset: () => formFieldMethod.reset(
      generateDefaultFormValue(languageOptions, defaultWebsiteLanguage)[fieldType]
    ),
    isFormDirty: () => formFieldMethod.formState.isDirty,
  }));

  useEffect(() => {
    async function reloadForm() {
      setLoading(true);
      setFormType(fieldType);
      if (defaultFormField) {
        formFieldMethod.reset(defaultFormField);
      } else {
        formFieldMethod.reset(
          generateDefaultFormValue(languageOptions, defaultWebsiteLanguage)[fieldType]
        );
      }
      await delay(1000);
      setLoading(false);
    }

    reloadForm();
  }, [fieldType, formFieldMethod, languageOptions, defaultWebsiteLanguage, defaultFormField]);

  if (loading) {
    return (
      <div className="renderFormField_loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <FormProvider {...formFieldMethod}>
      {(() => {
        switch (formType) {
          case FormFieldEnum.text:
          case FormFieldEnum.url:
          case FormFieldEnum.textarea: {
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Label */}
                  <RenderLanguageInputFormField propertyKey="label" />
                  {/* Placeholder */}
                  <RenderLanguageInputFormField propertyKey="placeholder" />
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* required */}
                  <RenderCheckboxFormField propertyKey="required" />
                  {/* defaultValue */}
                  <RenderInputFormField propertyKey="defaultValue" />
                </Space>
              </div>
            );
          }
          case FormFieldEnum.email: {
            const pattern = new RegExp(EMAIL_REGEX);
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Label */}
                  <RenderLanguageInputFormField propertyKey="label" />
                  {/* Placeholder */}
                  <RenderLanguageInputFormField propertyKey="placeholder" />
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* required */}
                  <RenderCheckboxFormField propertyKey="required" />
                  {/* defaultValue */}
                  <RenderInputFormField
                    propertyKey="defaultValue"
                    pattern={{
                      value: pattern,
                      message: 'Email không đúng format'
                    }}
                  />
                </Space>
              </div>
            );
          }
          case FormFieldEnum.phone: {
            const pattern = new RegExp(PHONE_REGEX);
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Label */}
                  <RenderLanguageInputFormField propertyKey="label" />
                  {/* Placeholder */}
                  <RenderLanguageInputFormField propertyKey="placeholder" />
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* required */}
                  <RenderCheckboxFormField propertyKey="required" />
                  {/* defaultValue */}
                  <RenderInputFormField
                    type="number"
                    propertyKey="defaultValue"
                    pattern={{
                      value: pattern,
                      message: 'Số điện thoại không đúng format'
                    }}
                  />
                </Space>
              </div>
            );
          }
          case FormFieldEnum.number: {
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Label */}
                  <RenderLanguageInputFormField propertyKey="label" />
                  {/* Placeholder */}
                  <RenderLanguageInputFormField propertyKey="placeholder" />
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* required */}
                  <RenderCheckboxFormField propertyKey="required" />
                  {/* defaultValue */}
                  <RenderInputFormField type="number" propertyKey="defaultValue" />
                </Space>
              </div>
            );
          }
          case FormFieldEnum.hidden: {
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* defaultValue */}
                  <RenderInputFormField propertyKey="defaultValue" />
                </Space>
              </div>
            );
          }
          case FormFieldEnum.selectSingle: {
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Label */}
                  <RenderLanguageInputFormField propertyKey="label" />
                  {/* Placeholder */}
                  <RenderLanguageInputFormField propertyKey="placeholder" />
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* required */}
                  <RenderCheckboxFormField propertyKey="required" />
                  {/* items */}
                  <RenderMultipleItemsFormField required propertyKey="items" />
                  {/* defaultValue */}
                  <RenderSelectValueFormField
                    propertyKey="defaultValue"
                    optionList={formFieldMethod.watch('items')}
                  />
                </Space>
              </div>
            );
          }
          case FormFieldEnum.selectMultiple: {
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Label */}
                  <RenderLanguageInputFormField propertyKey="label" />
                  {/* Placeholder */}
                  <RenderLanguageInputFormField propertyKey="placeholder" />
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* required */}
                  <RenderCheckboxFormField propertyKey="required" />
                  {/* items */}
                  <RenderMultipleItemsFormField required propertyKey="items" />
                  {/* defaultValue */}
                  <RenderSelectValueFormField
                    propertyKey="defaultValue"
                    optionList={formFieldMethod.watch('items')}
                    multiple={{
                      allowClear: true
                    }}
                  />
                </Space>
              </div>
            );
          }
          case FormFieldEnum.checkbox: {
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Label */}
                  <RenderLanguageInputFormField propertyKey="label" />
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* required */}
                  <RenderCheckboxFormField propertyKey="required" />
                  {/* items */}
                  <RenderMultipleItemsFormField required propertyKey="items" />
                  {/* defaultValue */}
                  <RenderSelectValueFormField
                    propertyKey="defaultValue"
                    optionList={formFieldMethod.watch('items')}
                    multiple={{
                      allowClear: true
                    }}
                  />
                </Space>
              </div>
            );
          }
          case FormFieldEnum.radio: {
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Label */}
                  <RenderLanguageInputFormField propertyKey="label" />
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* required */}
                  <RenderCheckboxFormField propertyKey="required" />
                  {/* items */}
                  <RenderMultipleItemsFormField required propertyKey="items" />
                  {/* defaultValue */}
                  <RenderSelectValueFormField
                    required
                    propertyKey="defaultValue"
                    optionList={formFieldMethod.watch('items')}
                  />
                </Space>
              </div>
            );
          }
          case FormFieldEnum.file: {
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Label */}
                  <RenderLanguageInputFormField propertyKey="label" />
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* required */}
                  <RenderCheckboxFormField propertyKey="required" />
                  {/* defaultValue */}
                  <RenderInputFormField propertyKey="defaultValue" />
                  {/* accept */}
                  <RenderInputFormField
                    propertyKey="accept"
                    placeholder={`${t('formManagement.acceptFormFieldPlaceholder')}`}
                  />
                </Space>
              </div>
            );
          }
          case FormFieldEnum.date: {
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Label */}
                  <RenderLanguageInputFormField propertyKey="label" />
                  {/* Placeholder */}
                  <RenderLanguageInputFormField propertyKey="placeholder" />
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* required */}
                  <RenderCheckboxFormField propertyKey="required" />
                  {/* defaultValue */}
                  <RenderDateTimePickerFormField propertyKey="defaultValue" />
                </Space>
              </div>
            );
          }
          case FormFieldEnum.dateTime: {
            return (
              <div className="u-mt-16">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* Label */}
                  <RenderLanguageInputFormField propertyKey="label" />
                  {/* Placeholder */}
                  <RenderLanguageInputFormField propertyKey="placeholder" />
                  {/* inputName */}
                  <RenderInputFormField required propertyKey="inputName" />
                  {/* htmlId */}
                  <RenderInputFormField propertyKey="htmlId" />
                  {/* htmlClass */}
                  <RenderInputFormField propertyKey="htmlClass" />
                  {/* required */}
                  <RenderCheckboxFormField propertyKey="required" />
                  {/* defaultValue */}
                  <RenderDateTimePickerFormField
                    propertyKey="defaultValue"
                    showTime={{}}
                  />
                </Space>
              </div>
            );
          }
          default:
            return null;
        }
      })()}

    </FormProvider>
  );
});

export default RenderFormField;

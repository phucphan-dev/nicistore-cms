import {
  Modal, Typography
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormFieldEnum, FormFieldType } from '../types';

import { DropdownField } from './RenderFormElement';
import RenderFormField, { RenderFormFieldRef } from './RenderFormField';

interface FormFieldModalProps {
  open: boolean;
  defaultForm?: FormFieldType;
  handleClose: () => void;
  handleAddField: (data: FormFieldType) => void;
  handleUpdateField: (data: FormFieldType) => void;
}

const FormFieldModal: React.FC<FormFieldModalProps> = ({
  open,
  defaultForm,
  handleClose,
  handleAddField,
  handleUpdateField,
}) => {
  /* Hooks */
  const { t } = useTranslation();

  /* States */
  const [fieldType, setFieldType] = useState<FormFieldEnum>();

  /* Refs */
  const formRef = useRef<RenderFormFieldRef>(null);

  /* Functions */
  const handleSubmitForm = async () => {
    const formData = await formRef.current?.handleSubmit();
    if (formData && fieldType) {
      if (defaultForm) {
        //* Case update
        handleUpdateField({
          type: fieldType,
          data: formData
        });
      } else {
        //* Case create
        formRef.current?.handleReset();
        handleAddField({
          type: fieldType,
          data: formData
        });
      }
      handleClose();
    }
  };

  useEffect(() => {
    if (defaultForm?.type) {
      setFieldType(defaultForm.type);
    }
  }, [defaultForm]);

  return (
    <Modal
      title={<Typography.Title level={3}>{t('formManagement.formModal')}</Typography.Title>}
      visible={open}
      centered
      onCancel={handleClose}
      width={800}
      maskClosable={false}
      onOk={handleSubmitForm}
      okText={defaultForm?.data ? t('system.update') : t('system.addNew')}
    >
      {/* Field type */}
      <Typography.Text strong>
        {t('formManagement.typeFormField')}
        {' '}
      </Typography.Text>
      <DropdownField
        placeholder={`${t('system.select')} ${t('formManagement.typeFormField')}`}
        value={fieldType}
        onChange={setFieldType}
      />
      {/* Render fields */}
      {fieldType && (
        <RenderFormField
          ref={formRef}
          fieldType={fieldType}
          defaultFormField={defaultForm?.data}
        />
      )}
    </Modal>
  );
};

export default FormFieldModal;

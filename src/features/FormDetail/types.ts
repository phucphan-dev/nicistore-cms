export enum FormFieldEnum {
  text = 'text',
  url = 'url',
  textarea = 'textarea',
  email = 'email',
  phone = 'phone',
  number = 'number',
  hidden = 'hidden',
  selectSingle = 'selectSingle',
  selectMultiple = 'selectMultiple',
  checkbox = 'checkbox',
  radio = 'radio',
  file = 'file',
  date = 'date',
  dateTime = 'datetime',
}

export type FormFieldEnumCode = keyof typeof FormFieldEnum;

export type FormField = {
  [T in FormFieldEnum]: {
    [FormFieldEnum.text]: FormFieldText,
    [FormFieldEnum.url]: FormFieldUrl,
    [FormFieldEnum.textarea]: FormFieldTextarea,
    [FormFieldEnum.email]: FormFieldEmail,
    [FormFieldEnum.phone]: FormFieldPhone,
    [FormFieldEnum.number]: FormFieldNumber,
    [FormFieldEnum.hidden]: FormFieldHidden,
    [FormFieldEnum.selectSingle]: FormFieldSelectSingle,
    [FormFieldEnum.selectMultiple]: FormFieldSelectMultiple,
    [FormFieldEnum.checkbox]: FormFieldCheckbox,
    [FormFieldEnum.radio]: FormFieldRadio,
    [FormFieldEnum.file]: FormFieldFile,
    [FormFieldEnum.date]: FormFieldDate,
    [FormFieldEnum.dateTime]: FormFieldDateTime,
  }[T]
};

//* Form Field Type
export type FormFieldInput = {
  label: {
    [lang: string]: string;
  };
  placeholder: {
    [lang: string]: string;
  };
  inputName: string;
  htmlId: string;
  htmlClass: string;
  required: boolean;
  defaultValue: string;
};

export type FormFieldItemType = {
  value: string;
  text: string;
};

export type FormFieldText = FormFieldInput;

export type FormFieldUrl = FormFieldInput;

export type FormFieldTextarea = FormFieldInput;

export type FormFieldEmail = FormFieldInput;

export type FormFieldPhone = FormFieldInput;

export type FormFieldNumber = Omit<FormFieldInput, 'defaultValue'> & {
  defaultValue: number;
};

export type FormFieldHidden = Omit<FormFieldInput, 'label' | 'placeholder' | 'required' | 'defaultValue'> & {
  defaultValue: number;
};

export type FormFieldSelectSingle = FormFieldInput & {
  items: FormFieldItemType[];
};

export type FormFieldSelectMultiple = Omit<FormFieldInput, 'defaultValue'> & {
  items: FormFieldItemType[];
  defaultValue: string[];
};

export type FormFieldCheckbox = Omit<FormFieldInput, 'placeholder' | 'required' | 'defaultValue'> & {
  items: FormFieldItemType[];
  defaultValue: string[];
};

export type FormFieldRadio = Omit<FormFieldInput, 'placeholder' | 'required'> & {
  items: FormFieldItemType[];
};

export type FormFieldFile = Omit<FormFieldInput, 'placeholder'> & {
  accept: string;
};

export type FormFieldDate = FormFieldInput;

export type FormFieldDateTime = FormFieldInput;

//* Hook form
export type FormFieldType = {
  type: FormFieldEnum;
  data: FormField[FormFieldEnum];
};

export type FormDetailType = {
  name: string;
  htmlId: string;
  htmlClass: string;
  buttons: {
    [type: string]: {
      htmlId: string;
      htmlClass: string;
      text: {
        [lang: string]: string;
      }
    }
  };
  fields?: FormFieldType[];
};

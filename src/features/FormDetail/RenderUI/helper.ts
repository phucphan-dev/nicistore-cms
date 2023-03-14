import { FormField } from '../types';

export const generateLangObject = (langs: string[]) => langs.reduce((prevVal, currVal) => ({
  ...prevVal,
  [currVal]: '',
}), {});

export const generateDefaultFormInputValue = (langs: string[]) => ({
  label: generateLangObject(langs),
  placeholder: generateLangObject(langs),
  inputName: '',
  htmlId: '',
  htmlClass: '',
  required: false,
  defaultValue: '',
});

export const generateDefaultFormValue = (
  langOptions: OptionType[],
  defaultLang?: string
): FormField => {
  const languages: string[] = langOptions.map((ele) => (ele.value?.toString() || defaultLang || 'vi'));

  //* Note: 'string' as any to force number -> string for defaultValue of react-hook-form
  return ({
    text: generateDefaultFormInputValue(languages),
    url: generateDefaultFormInputValue(languages),
    textarea: generateDefaultFormInputValue(languages),
    email: generateDefaultFormInputValue(languages),
    phone: generateDefaultFormInputValue(languages),
    number: {
      ...generateDefaultFormInputValue(languages),
      defaultValue: '' as any,
    },
    hidden: {
      inputName: '',
      htmlId: '',
      htmlClass: '',
      defaultValue: '' as any,
    },
    selectSingle: {
      ...generateDefaultFormInputValue(languages),
      items: [],
    },
    selectMultiple: {
      label: generateLangObject(languages),
      placeholder: generateLangObject(languages),
      inputName: '',
      htmlId: '',
      htmlClass: '',
      required: false,
      items: [],
      defaultValue: [],
    },
    checkbox: {
      label: generateLangObject(languages),
      inputName: '',
      htmlId: '',
      htmlClass: '',
      items: [],
      defaultValue: [],
    },
    radio: {
      label: generateLangObject(languages),
      inputName: '',
      htmlId: '',
      htmlClass: '',
      defaultValue: '',
      items: [],
    },
    file: {
      label: generateLangObject(languages),
      inputName: '',
      htmlId: '',
      htmlClass: '',
      required: false,
      defaultValue: '',
      accept: '',
    },
    date: generateDefaultFormInputValue(languages),
    datetime: generateDefaultFormInputValue(languages),
  });
};

export const placeholder = '';

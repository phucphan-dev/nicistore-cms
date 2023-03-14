export const targetDummy = [
  {
    label: 'Mở liên kết trong tab hiện tại',
    value: '_self',
  },
  {
    label: 'Mở liên kết trong tab mới',
    value: '_blank',
  },
];

export const convertDefaultVal = (type: string) => {
  switch (type) {
    case 'text':
    case 'textarea':
    case 'ckeditor':
    case 'simpleCkeditor': {
      return {
        type,
        data: ''
      };
    }
    case 'link': {
      return {
        type,
        data: {
          text: '',
          url: '',
          target: '_self',
        }
      };
    }
    case 'boolean': {
      return {
        type,
        data: false
      };
    }
    case 'numeric':
    case 'integer': {
      return {
        type,
        data: 0
      };
    }
    case 'uploadImages': {
      return {
        type,
        data: []
      };
    }
    case 'googleMapApi':
    case 'uploadFile':
    case 'uploadImage':
    case 'video':
    case 'banner':
    case 'newsList': {
      return {
        type,
        data: undefined
      };
    }
    default: {
      return null;
    }
  }
};

export const generateDefaultVal = (element: ElementBlockType) => {
  const objArr = Object.entries(element);
  return objArr.reduce((o, key) => {
    if (key[1].type !== 'repeater') {
      return Object.assign(o, {
        [key[0]]: convertDefaultVal(key[1].type)
      });
    }
    return o;
  }, {});
};

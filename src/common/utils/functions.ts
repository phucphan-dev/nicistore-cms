import moment from 'moment';

import { MediaSocialTypes } from 'common/components/SeoSection/types';
import { BASE_URL, TARGET_LIST_LABEL, TARGET_LIST_OPTIONS } from 'common/utils/constant';

function mapModifiers(
  baseClassName: string,
  ...modifiers: (string | string[] | false | undefined)[]
): string {
  return modifiers
    .reduce<string[]>(
      (acc, m) => (!m ? acc : [...acc, ...(typeof m === 'string' ? [m] : m)]),
      [],
    )
    .map((m) => `-${m}`)
    .reduce<string>(
      (classNames, suffix) => `${classNames} ${baseClassName}${suffix}`,
      baseClassName,
    );
}

export default mapModifiers;

/*!
 * Scroll down to next block element
 */
export function scrollDownNextSection(ref: React.RefObject<HTMLDivElement>) {
  if (ref && ref.current) {
    window.scrollTo({ behavior: 'smooth', top: ref.current.offsetTop - 68 });
  }
}

/*!
 * getMousePosition(event) - cross browser normalizing of:
 * clientX, clientY, screenX, screenY, offsetX, offsetY, pageX, pageY
 * HTMLElement
 */
export function getMousePosition(
  evt:
    | React.MouseEvent<SVGPathElement, MouseEvent>
    | React.MouseEvent<SVGRectElement, MouseEvent>,
  item: HTMLDivElement,
) {
  let { pageX } = evt;
  let { pageY } = evt;
  if (pageX === undefined) {
    pageX = evt.clientX
      + document.body.scrollLeft
      + document.documentElement.scrollLeft;
    pageY = evt.clientY
      + document.body.scrollTop
      + document.documentElement.scrollTop;
  }

  const rect = item.getBoundingClientRect();
  const offsetX = evt.clientX - rect.left;
  const offsetY = evt.clientY - rect.top;

  return {
    client: { x: evt.clientX, y: evt.clientY }, // relative to the viewport
    screen: { x: evt.screenX, y: evt.screenY }, // relative to the physical screen
    offset: { x: offsetX, y: offsetY }, // relative to the event target
    page: { x: pageX, y: pageY }, // relative to the html document
  };
}

export function getDimensions(ele: HTMLDivElement) {
  const { height } = ele.getBoundingClientRect();
  const { offsetTop } = ele;
  const offsetBottom = offsetTop + height;

  return {
    height,
    offsetTop,
    offsetBottom,
  };
}

export function scrollStop(callback: (value: any) => void, time = 2000) {
  // Make sure a valid callback was provided
  if (!callback || typeof callback !== 'function') return;

  // Setup scrolling variable
  let isScrolling: any;

  // Listen for scroll events
  window.addEventListener(
    'scroll',
    () => {
      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling);

      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(callback, time);
    },
    false,
  );
}

export const downloadFile = (path: string, name?: string) => {
  const a = document.createElement('a');
  a.target = '_blank';
  a.download = name || `${Date.now()}`;
  a.href = path;
  a.click();
  URL.revokeObjectURL(path);
  a.remove();
};

export const formatDateTime = (time?: string): string | undefined => {
  if (!time) return undefined;

  const dateData = new Date(time);
  const hours = dateData.getHours() < 10 ? `0${dateData.getHours()}` : dateData.getHours();
  const minutes = dateData.getMinutes() < 10 ? `0${dateData.getMinutes()}` : dateData.getMinutes();
  const date = dateData.getDate() < 10 ? `0${dateData.getDate()}` : dateData.getDate();
  const months = dateData.getMonth() + 1 < 10
    ? `0${dateData.getMonth() + 1}` : dateData.getMonth() + 1;
  const year = dateData.getFullYear().toString();

  return `${date}/${months}/${year} ${hours}:${minutes}`;
};

export const formatHHmm = (time?: string) => {
  if (!time) return '';
  const dateData = new Date(time);
  const hours = dateData.getHours() < 10 ? `0${dateData.getHours()}` : dateData.getHours();
  const minutes = dateData.getMinutes() < 10 ? `0${dateData.getMinutes()}` : dateData.getMinutes();
  return `${hours}:${minutes}`;
};

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const formatDateYYYYMMDD = (date?: any) => {
  if (!date) return '';
  const dateFormat = typeof (date) === 'string' ? new Date(date) : date;
  let day: string | number = moment(dateFormat).date();
  let month: string | number = moment(dateFormat).month() + 1;
  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  return `${moment(dateFormat).year()}-${month}-${day}`;
};

export const formatDateHHMMSS = () => {
  const dateFormat = new Date();
  let hours: string | number = dateFormat.getHours();
  let minutes: string | number = dateFormat.getMinutes();
  let seconds: string | number = dateFormat.getSeconds();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${hours}${minutes}${seconds}`;
};

export const getImageURL = (imgUrl?: string) => `${BASE_URL || ''}${imgUrl || ''}`;

export const generateImageFileName = () => `OREO_SCAN_BILL_${formatDateYYYYMMDD()}_${formatDateHHMMSS()}.jpeg`;

export const compressImage = async (url: string): Promise<string> => {
  const canvas = document.createElement('canvas');

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }
  const image = new Image();
  image.src = url;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const maxSize = 100;
  let { width, height } = image;
  if (width > height) {
    if (width > maxSize) {
      height *= maxSize / width;
      width = maxSize;
    }
  } else if (height > maxSize) {
    width *= maxSize / height;
    height = maxSize;
  }
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  canvas.toBlob((b) => {
    if (b) {
      const fileResize = new File([b], generateImageFileName(), { type: 'image/jpeg' });
      return URL.createObjectURL(fileResize);
    }
    return '';
  }, 'image/jpeg');
  return '';
};

export const formatDateDDMMYYYY = (date?: string | Date) => {
  if (!date) return '';
  const dateFormat = typeof (date) === 'string' ? new Date(date) : date;
  let day: string | number = dateFormat.getDate();
  let month: string | number = dateFormat.getMonth() + 1;
  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  return `${day}-${month}-${dateFormat.getFullYear()}`;
};

export function numberWithPrefix(x?: number, prefix?: string) {
  if (!x) return '-';
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, prefix || ',');
}

export const checkExternalUrl = (str?: string) => {
  if (!str) return false;
  const tareaRegex = /^(http|https|tel)/;
  return tareaRegex.test(String(str).toLowerCase());
};

export const toBase64 = (file: File) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

export const languageConvertToCode = (code?: string) => {
  switch (code) {
    case 'vi':
      return 1;
    case 'en':
      return 2;

    default:
      return 0;
  }
};

export const languageConvertToString = (code: number) => {
  switch (code) {
    case 1:
      return 'vi';
    case 2:
      return 'en';

    default:
      return '';
  }
};

export const convertTargetToNumber = (str: string) => {
  const currVal = TARGET_LIST_LABEL.find((f) => f.label === str)?.value;
  return TARGET_LIST_OPTIONS.find((f) => f.value === currVal)?.value;
};
export const convertTargetToString = (code: number) => {
  const currVal = TARGET_LIST_OPTIONS.find((f) => f.value === code)?.value;
  return TARGET_LIST_LABEL.find((f) => f.value === currVal)?.label;
};
// Recursive Menu

export const generateSlug = (_text: string) => _text.toLowerCase().normalize('NFD').trim()
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D')
  .replaceAll(' ', '-');

export const mappingURLToExternal = (path?: string) => (path ? new URL(path, window.location.origin).href : '');
export const convertDateTimeStringMoment = (date: moment.Moment, time: moment.Moment) => `${moment(date).format('DD/MM/YYYY')} ${moment(time).format('HH:mm')}`;

const returnTypeOG = (key: string) => (key === 'facebook' ? 1 : 2);

export const returnDefaultOG = (og: any, language: string): any[] => {
  const result: any[] = [];
  if (!og) return result;
  Object.keys(og).forEach((element) => {
    if (og[`${element}`][`${language}`]) {
      result.push({
        ogType: og[`${element}`][`${language}`] && returnTypeOG(element),
        ogTitle: og[`${element}`][`${language}`]?.title || '',
        ogDescription: og[`${element}`][`${language}`]?.description || '',
        ogImage: og[`${element}`][`${language}`]?.image || '',
      });
    }
  });
  return result;
};

export const returnOgData = (
  language: string,
  ogSeo?: MediaSocialTypes[]
): OgDataTypes | undefined => {
  const fbOg = ogSeo?.find((item) => item.ogType === 1);
  const twOg = ogSeo?.find((item) => item.ogType === 2);
  if (!fbOg && !twOg) return undefined;
  return {
    facebook: fbOg ? {
      [`${language}`]: {
        title: fbOg.ogTitle,
        description: fbOg.ogDescription,
        image: fbOg.ogImage
      }
    } : null,
    twitter: twOg ? {
      [`${language}`]: {
        title: twOg.ogTitle,
        description: twOg.ogDescription,
        image: twOg.ogImage
      }
    } : null,
  };
};

export function replaceNull(someObj: object, replaceValue = '') {
  const replacer = (key: string, value: any) => (String(value) === 'null' || String(value) === 'undefined' ? replaceValue : value);
  // ^ because you seem to want to replace (strings) "null" or "undefined" too

  return JSON.parse(JSON.stringify(someObj, replacer));
}

export function formatBytes(a: number, b = 2) {
  if (!+a) return '0 Bytes'; const c = b < 0 ? 0 : b; const
    d = Math.floor(Math.log(a) / Math.log(1024)); return `${parseFloat((a / 1024 ** d).toFixed(c))} ${['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]}`;
}

const getFirstChar = (text: string) => text.charAt(0);

export const getFirstLetters = (str: string) => {
  const strSplit = str.split(' ');
  if (strSplit.length > 1) {
    const firstLetter = getFirstChar(strSplit[0]);
    const lastLetter = getFirstChar(strSplit[strSplit.length - 1]);
    return firstLetter + lastLetter;
  }
  return strSplit.map((word) => word[0]).join('').toUpperCase();
};

export const dateInCurrentMonth = () => {
  const date = new Date();
  const month = date.getMonth();
  date.setDate(1);
  const allDate = [];
  while (date.getMonth() === month) {
    const d = date.getDate().toString().padStart(2, '');
    allDate.push(d);
    date.setDate(date.getDate() + 1);
  }
  return allDate;
};

export const dateRangeFromTo = (dFrom: string, dTo: string, format = 'YYYY-MM-DD') => {
  const dateFrom = new Date(dFrom);
  const dateTo = new Date(dTo);
  const diff = dateTo.getTime() - dateFrom.getTime();
  const result = diff / (1000 * 60 * 60 * 24);

  const allDate = [moment(new Date(dateFrom)).format(format)];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < result; i++) {
    const date = dateFrom.setDate(dateFrom.getDate() + 1);
    const formatResult = moment(new Date(date)).format(format);
    allDate.push(formatResult);
  }

  return allDate;
  // TODO: example: dateRangeFromTo('2022-09-05', '2022-10-20', 'DD/MM');
};

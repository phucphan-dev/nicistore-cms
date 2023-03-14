const LOCAL_STORAGE = {
  ACCESS_TOKEN: 'ONECMS_AccessToken',
  REFRESH_TOKEN: 'ONECMS_RefreshToken',
  ABILITIES: 'ONECMS_Abilities',
  LANGUAGE: 'ONECMS_Language',
  PREVIEW_DATA: 'ONECMS_PreviewData'
};

export const BASE_URL = process.env.REACT_APP_BASE_URL;

export const COLORS = {
  COOL_BLACK: '#002b60'
};

export const DEFAULT_QUERY_OPTION = {
  retry: 0,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

export const URL_CONST = {
  MEDIA_FILE_UPLOAD_CHUNK: 'api/v1/media-files/upload-chunk',
  MEDIA_FILE_MERGE_CHUNK: 'api/v1/media-files/merge-chunk'
};

export const TARGET_LIST_OPTIONS = [
  {
    label: 'Mở liên kết trong tab hiện tại',
    value: 1
  },
  {
    label: 'Mở liên kết trong tab mới',
    value: 2
  },
];
export const TARGET_LIST_LABEL = [
  {
    label: '_self',
    value: 1
  },
  {
    label: '_blank',
    value: 2
  },
];

export const socialList: OptionType[] = [
  {
    label: 'Facebook',
    value: 1,
  },
  {
    label: 'Twitter',
    value: 2,
  },
];

export const newsListSortBy: OptionType[] = [
  {
    label: 'Thứ tự hiển thị',
    value: 'displayOrder',
  },
  {
    label: 'Ngày đăng',
    value: 'displayOrder',
  },
];

export const newsListSortType: OptionType[] = [
  {
    label: 'Ascending',
    value: 'asc',
  },
  {
    label: 'Descending',
    value: 'desc',
  },
];

export default LOCAL_STORAGE;

export const INTEGER_REGEX = /^[+-]?((\d*\.?\d+(?:[Ee][+-]?\d+)?)|(\d+\.))$/;
export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PHONE_REGEX = /^0[1-9][0-9]{8}$/;

export const ROUTE_PATHS = {
  /* BLOCK TEMPLATE */
  PAGE_TEMPLATE_MANAGEMENT: '/page-templates',
  /* PAGE */
  PAGE_MANAGEMENT: '/page-management',
  PAGE_DETAIL: '/page',
  /* FILE */
  FILE_MANAGEMENT: '/files-management',
  /* MENU */
  MENU_MANAGEMENT: '/menu-management',
  MENU_DETAIL: '/menu',
  /* NEWS */
  NEWS_MANAGEMENT: '/news-management',
  NEWS_DETAIL: '/news',
  NEWS_CATEGORY_MANAGEMENT: '/news-category-management',
  NEWS_CATEGORY_DETAIL: '/news-category',
  /* BANNER */
  BANNER_MANAGEMENT: '/banner-management',
  BANNER_DETAIL: '/banner',
  /* TRANSLATIONS */
  FE_TRANSLATION_MANAGEMENT: '/fe-translation',
  CMS_TRANSLATION_MANAGEMENT: '/cms-translation',
  /* REDIRECT */
  REDIRECT_MANAGEMENT: '/redirect',
  REDIRECT_IMPORT: '/redirect-import',
  /* ACTIVITY */
  ACTIVITY_MANAGEMENT: '/activity-logs',
  /* ROLES */
  ROLES_MANAGEMENT: '/roles',
  ROLES_DETAIL: '/role-detail',
  /* USERS */
  USERS_MANAGEMENT: '/users-management',
  USERS_DETAIL: '/user',
  /* FAQ */
  FAQ_MANAGEMENT: '/faq-management',
  FAQ_DETAIL: '/faq',
  FAQ_CATEGORY_MANAGEMENT: '/faq-category-management',
  FAQ_CATEGORY_DETAIL: '/faq-category',
  /* CONFIG */
  SYSTEM_MANAGEMENT: '/system',
  SYSTEM_CONFIG_MANAGEMENT: '/config-management',
  ERRORS_MANAGEMENT: '/errors-management',
  /* AUTH */
  LOGIN: '/login',
  /* CONTACT */
  CONTACT_MANAGEMENT: '/contact-management',
  CONTACT_PROBLEM_MANAGEMENT: '/contact-problem-management',
  CONTACT_PROBLEM_DETAIL: '/contact-problem-detail',
  /* EMAIL TEMPLATE */
  EMAIL_TEMPLATE_MANAGEMENT: '/email-template-management',
  EMAIL_TEMPLATE_DETAIL: '/email-template-detail',
  /* FORM */
  FORM_MANAGEMENT: '/form-management',
  FORM_DETAIL: '/form-detail',
  /* STATIC BLOCK */
  STATIC_BLOCK_MANAGEMENT: '/static-block-management',
  STATIC_BLOCK_DETAIL: '/static-block-detail',
};

export const videoTypes: OptionType[] = [
  {
    label: 'Upload',
    value: 'upload'
  },
  {
    label: 'Youtube',
    value: 'youtube'
  },
  {
    label: 'Vimeo',
    value: 'vimeo'
  },
];

export const defaultSessionsCode = {
  hanoiCode: '1028580',
  sontayCode: '9074107',
  saigonCode: '1028581',
  danangCode: '1028809',
};
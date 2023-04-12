declare module 'fine-uploader/lib/core'

type ErrorResponse = {
  code: string;
  field: string;
  message: string;
};

type BaseFilterParams = {
  keyword?: string;
  limit?: number;
  page?: number;
  ids?: string;
  slugs?: string;
};

type PaginationLinks = {
  self: string;
  first: string;
  prev?: any;
  next?: any;
  last: string;
};

type PaginationMeta = {
  totalPages: number;
  limit: number;
  total: number;
  page: number;
};

type APIPaginationResponse<T> = {
  data: T;
  meta: PaginationMeta;
  links: PaginationLinks;
};

type Translation = {
  name: string;
  slug: string;
  description: string;
};

type SectionBlockType = {
  label: string;
  noOrder: number;
  elements: ElementBlockType;
};

type BlocksType = {
  [x: string]: SectionBlockType;
};

type CoreBlockType = {
  type: string;
  label: string;
  noOrder: number;
  elements?: ElementBlockType;
};

type Thumbnail = {
  alt?: string;
  path?: string;
  title?: string;
};

type TagTypes = {
  id: number;
  slug: string;
  text: string;
};

type ElementBlockType = {
  [x: string]: CoreBlockType;
};

type LanguageCodeTypes = 'vi' | 'en';

type TokenDecodeTypes = {
  jti: string;
  iat: number;
  exp: number;
  uhp: string[];
};

type ErrorStatusCode = 401 | 404 | 403 | 503 | 400;

type CreatorType = {
  email: string;
  name: string;
  avatar?: string;
  bgAvatar: string;
};

type OgDataTypes = {
  [type: string]: {
    [language: string]: {
      title?: string;
      description?: string;
      image?: string;
    }
  } | null
};

type SeoDataTypes = {
  [key: string]: {
    title?: string;
    description?: string;
    keywords?: string;
    metaRobot?: string;
    structureData?: string;
    metaViewport?: string;
    canonicalUrl?: string;
    image?: string;
  }
};

type BannerType = 'basic' | 'video';

type VideoBannerType = 'upload' | 'youtube' | 'vimeo';

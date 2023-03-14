export type GetBannersParamsTypes = {
  locale?: string;
  keyword?: string;
  limit?: string;
  page?: string;
};

export type DeleteMultipleBannerParamsTypes = {
  ids: number[];
};

export interface BannerData {
  id: number;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export type BannerTranslations = {
  [locale: string]: Translation;
};

export type GetAllBannersTypes = {
  bannerData: BannerData;
  translations: BannerTranslations;
};

export type BannerLangItemTypes = {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
};

export type BannerItemTypes = {
  id: number;
  title: string;
  updatedAt: string;
  locale: {
    [k: string]: BannerLangItemTypes,
  };
};

export type BannerItemsParamsTypes = {
  type: BannerType;
  data: {
    title?: string;
    subTitle?: string;
    link?: string;
    imageDesktop?: string;
    imageTabLet?: string;
    imageMobile?: string;
    videoType?: string;
    videoUrl?: string;
    videoThumbnail?: string;
  }
};

export type CreateBannerParamsTypes = {
  translations: {
    [locale: string]: {
      bannerData: {
        name: string;
        items: BannerItemsParamsTypes[];
      }
    }
  }
};

export type GetBannerByIdTypes = {
  bannerData: BannerData;
  translations: {
    [locale: string]: {
      name: string;
      locale: string;
      items: BannerItemsParamsTypes[];
    }
  };
  creator: CreatorType;
  updater: CreatorType;
};

export type BannerCommentData = {
  id: number;
  banner: {
    id: number;
    title?: string;
    slug?: string;
  }
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type BannerCommentType = {
  bannerCommentData: BannerCommentData;
  creator: CreatorType;
  updater: CreatorType;
};

export type GetBannerCommentParams = {
  bannerId?: number;
  locale?: string;
  keyword?: string;
  limit?: number;
  page?: number;
};

export type CreateBannerCommentParams = {
  bannerId: number;
  comment: string;
};

export type CreateBannerCommentType = {
  id: number;
};

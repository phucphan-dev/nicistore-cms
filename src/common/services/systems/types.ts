export type ConfigHeaderTypes = {
  elements: BlocksType;
  data: any;
};

export type ConfigHeaderParams = {
  translations: {
    [language: string]: {
      blocks: any;
    }
  }
};

export type SeoGeneralTypes = {
  seoData: SeoDataTypes;
  ogData: OgDataTypes;
};

export interface SEOData {
  [language: string]: SEODataEn;
}

export interface SEODataEn {
  title?: string;
  description?: string;
  keywords?: string;
}

export interface OgData {
  facebook?: Facebook;
}

export interface Facebook {
  en?: FacebookEn;
  vi?: FacebookEn;
}

export interface FacebookEn {
  title?: string;
  description?: string;
  image?: string;
}

export type SeoGeneralParamsTypes = {
  seoData?: SeoDataTypes;
  ogData?: OgDataTypes;
};

export type InitialSystemData = {
  googleRecaptchaKey?: string;
  passportPublicKey?: string;
  websiteLocales: {
    [language: string]: {
      isDefault: boolean;
      icon?: string;
      active: boolean;
      text: string;
    }
  };
  media: {
    image?: {
      uploadMaxSize?: number;
    }
  }
  paginationOptions: {
    numbersOfRows: {
      numbers: number;
      isDefault: boolean;
    }[];
  };
  importTemplates: {
    redirect: string;
  }
};

export type SystemLocaleItemType = {
  id: string;
  icon: string;
  active: boolean;
  text: string;
};

export type SystemLocalesData = {
  [language: string]: SystemLocaleItemType;
};

export type UpdateSystemLocalesParams = {
  locales: {
    [language: string]: {
      elements: {
        icon: string;
        active: boolean;
        text: string;
      }
    }
  }
};

export type SystemGeneralData = {
  gaId?: string;
  gtmId?: string;
  gMapId?: string;
  favicon?: string;
};

export type UpdateSystemGeneralParams = {
  gaId?: string;
  gtmId?: string;
  gMapId?: string;
  fileFavicon?: File;
};

export type SaveErrorConfigParams = {
  translations: {
    [language: string]: {
      blocks: any;
    }
  }
};

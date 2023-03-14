export type MediaSocialTypes = {
  ogTitle: string;
  ogDescription: string;
  ogType?: number | null;
  ogImage: string;
};

export type SeoFormTypes = {
  seoTitle?: string;
  seoIntro?: string;
  seoKeyword?: string;
  ogImage?: string;
  mediaSocial: MediaSocialTypes[];
  metaViewPort?: string;
  metaRobot?: string;
  canonicalURL?: string;
  structuredData?: string;
};

export type OthersFormType = {
  comment?: string;
};

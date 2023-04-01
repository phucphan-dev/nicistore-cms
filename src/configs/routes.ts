import roles from './roles';

import { ROUTE_PATHS } from 'common/utils/constant';
import OrderDetail from 'extends/Orders/Detail';
import OrdersManagement from 'extends/Orders/Management';
import ProductCategoriesDetail from 'extends/ProductCategories/Detail';
import ProductCategoriesManagement from 'extends/ProductCategories/Management';
import ProductColorsDetail from 'extends/ProductColors/Detail';
import ProductColorsManagement from 'extends/ProductColors/Management';
import ProductSizesDetail from 'extends/ProductSizes/Detail';
import ProductSizesManagement from 'extends/ProductSizes/Management';
import ProductDetail from 'extends/Products/Detail';
import ProductManagement from 'extends/Products/Management';
import ActivityLogsManagement from 'features/ActivityLogsManagement';
import BannerManagement from 'features/BannerManagement';
import CMSTranslationsManagement from 'features/CMSTranslationsManagement';
import CategoryFaq from 'features/CategoriesFaqManagement';
import ContactManagement from 'features/ContactManagement';
import ContactProblemDetail from 'features/ContactProblemDetail';
import ContactProblemManagement from 'features/ContactProblemManagement';
import EditBanner from 'features/EditBanner';
import EditCategoryFaq from 'features/EditCategoryFaq';
import EditFaq from 'features/EditFaq';
import EditMenu from 'features/EditMenu';
import EditNews from 'features/EditNews';
import EditNewsCategory from 'features/EditNewsCategory';
import EditPageTemplate from 'features/EditPageTemplate';
import EditStaticBlocks from 'features/EditStaticBlocks';
import EmailTemplateDetail from 'features/EmailTemplateDetail';
import EmailTemplateManagement from 'features/EmailTemplateManagement';
import ErrorsManagement from 'features/ErrorsManagement';
import FETranslationsManagement from 'features/FETranslationsManagement';
import FaqManagement from 'features/FaqManagement';
import FilesManagement from 'features/FilesManagement';
import FormDetail from 'features/FormDetail';
import FormManagement from 'features/FormManagement';
import MenuManagement from 'features/MenuManagement';
import NewsCategoryManagement from 'features/NewsCategoryManagement';
import NewsManagement from 'features/NewsManagement';
import PageManagement from 'features/PageManagement';
import PageTemplate from 'features/PageTemplate';
import RedirectImport from 'features/RedirectImport';
import RedirectManagement from 'features/RedirectManagement';
import RoleDetail from 'features/RoleDetail';
import RoleManagement from 'features/RoleManagement';
import StaticBlockManagement from 'features/StaticBlockManagement';
import SystemConfigsManagement from 'features/SystemConfigsManagement';
import SystemManagement from 'features/SystemManagement';
import UserDetail from 'features/UserDetail';
import UserManagement from 'features/UserManagement';

export type RolesRoute = {
  index?: string;
  create?: string;
  update?: string;
  delete?: string;
  view?: string;
  other?: string[];
};

type RouteProps = {
  id: number;
  name: string;
  path: string;
  element: React.FC<ActiveRoles>;
  roles?: RolesRoute;
};

const routes: RouteProps[] = [
  {
    id: 1,
    name: 'Page Template',
    path: ROUTE_PATHS.PAGE_TEMPLATE_MANAGEMENT,
    element: PageTemplate,
    roles: {
      index: roles.TEMPLATE_INDEX,
      update: roles.TEMPLATE_UPDATE
    }
  },
  {
    id: 2,
    name: 'Page Management',
    path: ROUTE_PATHS.PAGE_MANAGEMENT,
    element: PageManagement,
    roles: {
      index: roles.PAGE_INDEX,
      create: roles.PAGE_STORE,
      update: roles.PAGE_UPDATE,
      delete: roles.PAGE_DESTROY,
      other: [
        roles.PAGE_APPROVED,
        roles.PAGE_COMMENT_INDEX,
        roles.PAGE_COMMENT_STORE,
      ]
    }
  },
  {
    id: 3,
    name: 'Page Detail',
    path: ROUTE_PATHS.PAGE_DETAIL,
    element: EditPageTemplate,
    roles: {
      index: roles.PAGE_INDEX,
      create: roles.PAGE_STORE,
      update: roles.PAGE_UPDATE,
      other: [roles.PAGE_APPROVED]
    }
  },
  {
    id: 4,
    name: 'Files Management',
    path: ROUTE_PATHS.FILE_MANAGEMENT,
    element: FilesManagement,
    // roles: {
    //   index: roles.FOLDER_VIEWALL,
    //   other: [
    //     roles.FOLDER_STORE,
    //     roles.FOLDER_UPDATE,
    //     roles.FOLDER_DESTROY,
    //     roles.FOLDER_GETITEMS,
    //     roles.FILE_DESTROY,
    //     roles.FILE_UPDATE,
    //     roles.FILE_UPLOAD,
    //     roles.TRASH_EMPTY,
    //     roles.TRASH_INDEX,
    //     roles.TRASH_RESTORE,
    //     roles.TRASH_FORCEDELETE,
    //   ]
    // }
  },
  {
    id: 5,
    name: 'Menu Management',
    path: ROUTE_PATHS.MENU_MANAGEMENT,
    element: MenuManagement,
    roles: {
      index: roles.MENU_INDEX,
      create: roles.MENU_STORE,
      update: roles.MENU_MANAGE,
      delete: roles.MENU_DESTROY
    }
  },
  {
    id: 6,
    name: 'Menu Detail',
    path: ROUTE_PATHS.MENU_DETAIL,
    element: EditMenu,
    roles: {
      index: roles.MENU_INDEX,
      create: roles.MENU_STORE,
      update: roles.MENU_MANAGE,
      delete: roles.MENU_DESTROY
    }
  },
  {
    id: 7,
    name: 'News Management',
    path: ROUTE_PATHS.NEWS_MANAGEMENT,
    element: NewsManagement,
    roles: {
      index: roles.NEWS_INDEX,
      create: roles.NEWS_STORE,
      update: roles.NEWS_UPDATE,
      delete: roles.NEWS_DESTROY
    }
  },
  {
    id: 8,
    name: 'News Detail',
    path: ROUTE_PATHS.NEWS_DETAIL,
    element: EditNews,
    roles: {
      index: roles.NEWS_INDEX,
      update: roles.NEWS_UPDATE,
      create: roles.NEWS_STORE,
      other: [roles.NEWS_APPROVED]
    }
  },
  {
    id: 9,
    name: 'News Category Management',
    path: ROUTE_PATHS.NEWS_CATEGORY_MANAGEMENT,
    element: NewsCategoryManagement,
    roles: {
      index: roles.NEWS_CATE_INDEX,
      create: roles.NEWS_CATE_STORE,
      delete: roles.NEWS_CATE_DESTROY,
      update: roles.NEWS_CATE_UPDATE
    }
  },
  {
    id: 10,
    name: 'News Category Detail',
    path: ROUTE_PATHS.NEWS_CATEGORY_DETAIL,
    element: EditNewsCategory,
    roles: {
      index: roles.NEWS_CATE_INDEX,
      create: roles.NEWS_CATE_STORE,
      update: roles.NEWS_CATE_UPDATE,
      other: [roles.NEWS_CATE_APPROVED]
    }
  },
  {
    id: 11,
    name: 'Banner Management',
    path: ROUTE_PATHS.BANNER_MANAGEMENT,
    element: BannerManagement,
    roles: {
      index: roles.BANNER_INDEX,
      create: roles.BANNER_STORE,
      delete: roles.BANNER_DESTROY,
      update: roles.BANNER_UPDATE
    }
  },
  {
    id: 12,
    name: 'Banner Detail',
    path: ROUTE_PATHS.BANNER_DETAIL,
    element: EditBanner,
    roles: {
      index: roles.BANNER_INDEX,
      create: roles.BANNER_STORE,
      update: roles.BANNER_UPDATE,
    }
  },
  {
    id: 13,
    name: 'System Management',
    path: ROUTE_PATHS.SYSTEM_MANAGEMENT,
    element: SystemManagement,
    roles: {
      index: roles.SYSTEM_INDEX,
      other: [
        roles.SYSTEM_INDEX,
        roles.SYSTEM_STORE,
        roles.SEO_GENERAL_INDEX,
        roles.SEO_GENERAL_STORE,
        roles.SYSTEM_LOCALE_INDEX,
        roles.SYSTEM_LOCALE_STORE
      ]
    }
  },
  {
    id: 14,
    name: 'System Config Management',
    path: ROUTE_PATHS.SYSTEM_CONFIG_MANAGEMENT,
    element: SystemConfigsManagement,
    roles: {
      index: roles.CONFIG_HEADER_INDEX || roles.CONFIG_FOOTER_INDEX,
      other: [
        roles.CONFIG_HEADER_STORE,
        roles.CONFIG_FOOTER_STORE,
      ]
    }
  },
  {
    id: 16,
    name: 'FE Translation Management',
    path: ROUTE_PATHS.FE_TRANSLATION_MANAGEMENT,
    element: FETranslationsManagement,
    roles: {
      index: roles.FE_TRANSLATION_INDEX,
      create: roles.FE_TRANSLATION_STORE,
      delete: roles.FE_TRANSLATION_DESTROY,
      update: roles.FE_TRANSLATION_UPDATE
    }
  },
  {
    id: 17,
    name: 'CMS Translation Management',
    path: ROUTE_PATHS.CMS_TRANSLATION_MANAGEMENT,
    element: CMSTranslationsManagement,
    roles: {
      index: roles.CMS_TRANSLATION_INDEX,
      create: roles.CMS_TRANSLATION_STORE,
      delete: roles.CMS_TRANSLATION_DESTROY,
      update: roles.CMS_TRANSLATION_UPDATE
    }
  },
  {
    id: 18,
    name: 'Redirect Management',
    path: ROUTE_PATHS.REDIRECT_MANAGEMENT,
    element: RedirectManagement,
    roles: {
      index: roles.REDIRECT_INDEX,
      create: roles.REDIRECT_STORE,
      update: roles.REDIRECT_UPDATE,
      delete: roles.REDIRECT_DESTROY,
    }
  },
  {
    id: 19,
    name: 'Redirect Import',
    path: ROUTE_PATHS.REDIRECT_IMPORT,
    element: RedirectImport,
    roles: {
      index: roles.REDIRECT_IMPORT,
    }
  },
  {
    id: 20,
    name: 'Activity Logs',
    path: ROUTE_PATHS.ACTIVITY_MANAGEMENT,
    element: ActivityLogsManagement,
    roles: {
      index: roles.ACTIVITYLOG_INDEX
    }
  },
  {
    id: 21,
    name: 'Roles Management',
    path: ROUTE_PATHS.ROLES_MANAGEMENT,
    element: RoleManagement,
  },
  {
    id: 22,
    name: 'Roles Detail',
    path: ROUTE_PATHS.ROLES_DETAIL,
    element: RoleDetail,
  },
  {
    id: 23,
    name: 'User Management',
    path: ROUTE_PATHS.USERS_MANAGEMENT,
    element: UserManagement,
  },
  {
    id: 23,
    name: 'User Detail',
    path: ROUTE_PATHS.USERS_DETAIL,
    element: UserDetail,
  },
  {
    id: 24,
    name: 'Faq Management',
    path: ROUTE_PATHS.FAQ_MANAGEMENT,
    element: FaqManagement,
    roles: {
      index: roles.FAQ_INDEX,
      create: roles.FAQ_STORE,
      update: roles.FAQ_UPDATE,
      delete: roles.FAQ_DESTROY
    }
  },
  {
    id: 25,
    name: 'Edit Faq',
    path: ROUTE_PATHS.FAQ_DETAIL,
    element: EditFaq,
    roles: {
      index: roles.FAQ_INDEX,
      update: roles.FAQ_UPDATE,
      create: roles.FAQ_STORE,
      other: [roles.FAQ_APPROVED]
    }
  },
  {
    id: 26,
    name: 'CategoriesFaq',
    path: ROUTE_PATHS.FAQ_CATEGORY_MANAGEMENT,
    element: CategoryFaq,
    roles: {
      index: roles.FAQ_CATEGORY_INDEX,
      create: roles.FAQ_CATEGORY_STORE,
      update: roles.FAQ_CATEGORY_UPDATE,
      delete: roles.FAQ_CATEGORY_DESTROY
    }
  },
  {
    id: 27,
    name: 'EditCategoryFaq',
    path: ROUTE_PATHS.FAQ_CATEGORY_DETAIL,
    element: EditCategoryFaq,
    roles: {
      index: roles.FAQ_CATEGORY_INDEX,
      update: roles.FAQ_CATEGORY_UPDATE,
      create: roles.FAQ_CATEGORY_STORE,
      other: [roles.FAQ_CATEGORY_APPROVED]
    }
  },
  {
    id: 28,
    name: 'ErrorsManagement',
    path: ROUTE_PATHS.ERRORS_MANAGEMENT,
    element: ErrorsManagement,
    roles: {
      index: roles.ERROR_PAGE_400
        || roles.ERROR_PAGE_403
        || roles.ERROR_PAGE_404
        || roles.ERROR_PAGE_429
        || roles.ERROR_PAGE_500
    }
  },
  {
    id: 29,
    name: 'ContactManagement',
    path: ROUTE_PATHS.CONTACT_MANAGEMENT,
    element: ContactManagement,
    roles: {
      index: roles.CONTACT_INDEX,
      update: roles.CONTACT_UPDATE,
      delete: roles.CONTACT_DESTROY,
    }
  },
  {
    id: 30,
    name: 'ContactProblemManagement',
    path: ROUTE_PATHS.CONTACT_PROBLEM_MANAGEMENT,
    element: ContactProblemManagement,
    roles: {
      index: roles.CONTACT_PROBLEM_INDEX,
      create: roles.CONTACT_PROBLEM_STORE,
      update: roles.CONTACT_PROBLEM_UPDATE,
      delete: roles.CONTACT_PROBLEM_DESTROY
    }
  },
  {
    id: 31,
    name: 'ContactProblemDetail',
    path: ROUTE_PATHS.CONTACT_PROBLEM_DETAIL,
    element: ContactProblemDetail,
    roles: {
      index: roles.CONTACT_PROBLEM_INDEX,
      update: roles.CONTACT_PROBLEM_UPDATE,
      create: roles.CONTACT_PROBLEM_STORE,
      other: [roles.CONTACT_PROBLEM_APPROVED]
    }
  },
  {
    id: 32,
    name: 'EmailTemplateManagement',
    path: ROUTE_PATHS.EMAIL_TEMPLATE_MANAGEMENT,
    element: EmailTemplateManagement,
    roles: {
      index: roles.EMAIL_TEMPLATE_INDEX,
      update: roles.EMAIL_TEMPLATE_UPDATE,
    }
  },
  {
    id: 33,
    name: 'EmailTemplateDetail',
    path: ROUTE_PATHS.EMAIL_TEMPLATE_DETAIL,
    element: EmailTemplateDetail,
    roles: {
      index: roles.EMAIL_TEMPLATE_INDEX,
      update: roles.EMAIL_TEMPLATE_UPDATE,
    }
  },
  {
    id: 34,
    name: 'FormManagement',
    path: ROUTE_PATHS.FORM_MANAGEMENT,
    element: FormManagement,
    roles: {
      index: roles.FORM_INDEX,
      create: roles.FORM_STORE,
      update: roles.FORM_UPDATE,
      delete: roles.FORM_DESTROY
    }
  },
  {
    id: 35,
    name: 'FormDetail',
    path: ROUTE_PATHS.FORM_DETAIL,
    element: FormDetail,
    roles: {
      index: roles.FORM_INDEX,
      update: roles.FORM_UPDATE,
      create: roles.FORM_STORE,
    }
  },
  {
    id: 36,
    name: 'StaticBlockManagement',
    path: ROUTE_PATHS.STATIC_BLOCK_MANAGEMENT,
    element: StaticBlockManagement,
    roles: {
      index: roles.STATIC_BLOCK_INDEX,
      update: roles.STATIC_BLOCK_UPDATE,
      create: roles.STATIC_BLOCK_STORE,
      delete: roles.STATIC_BLOCK_DESTROY
    }
  },
  {
    id: 37,
    name: 'StaticBlockDetail',
    path: ROUTE_PATHS.STATIC_BLOCK_DETAIL,
    element: EditStaticBlocks,
    roles: {
      index: roles.STATIC_BLOCK_INDEX,
      update: roles.STATIC_BLOCK_UPDATE,
      create: roles.STATIC_BLOCK_STORE
    }
  },
  /* Extends */
  {
    id: 38,
    name: 'ProductList',
    path: ROUTE_PATHS.PRODUCT_MANAGEMENT,
    element: ProductManagement,
  },
  {
    id: 39,
    name: 'ProductDetail',
    path: ROUTE_PATHS.PRODUCT_DETAIL,
    element: ProductDetail,
  },
  {
    id: 39,
    name: 'ProductCategories',
    path: ROUTE_PATHS.PRODUCT_CATEGORIES_MANAGEMENT,
    element: ProductCategoriesManagement,
  },
  {
    id: 40,
    name: 'ProductCategoriesDetail',
    path: ROUTE_PATHS.PRODUCT_CATEGORIES_DETAIL,
    element: ProductCategoriesDetail,
  },
  {
    id: 41,
    name: 'ProductColors',
    path: ROUTE_PATHS.PRODUCT_COLORS_MANAGEMENT,
    element: ProductColorsManagement,
  },
  {
    id: 42,
    name: 'ProductColorsDetail',
    path: ROUTE_PATHS.PRODUCT_COLORS_DETAIL,
    element: ProductColorsDetail,
  },
  {
    id: 43,
    name: 'ProductSizes',
    path: ROUTE_PATHS.PRODUCT_SIZES_MANAGEMENT,
    element: ProductSizesManagement,
  },
  {
    id: 44,
    name: 'ProductSizeDetail',
    path: ROUTE_PATHS.PRODUCT_SIZES_DETAIL,
    element: ProductSizesDetail,
  },
  {
    id: 45,
    name: 'Orders',
    path: ROUTE_PATHS.ORDERS_MANAGEMENT,
    element: OrdersManagement,
  },
  {
    id: 46,
    name: 'OrderDetail',
    path: ROUTE_PATHS.ORDERS_DETAIL,
    element: OrderDetail,
  },
];

export default routes;

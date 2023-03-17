/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DashboardOutlined,
  FileOutlined, MenuOutlined,
  LayoutOutlined,
  ContainerOutlined, SettingOutlined, CodeSandboxOutlined,
  ToolOutlined,
  BgColorsOutlined,
  ContactsOutlined,
  MailOutlined,
  FormOutlined,
  ProjectOutlined,
  GoldOutlined,
} from '@ant-design/icons';

import roles from './roles';

import { MenuItem } from 'common/components/Sidebar';
import { ROUTE_PATHS } from 'common/utils/constant';

const menuSidebar: MenuItem[] = [
  {
    key: 'dashboard',
    title: 'sidebar.dashboard',
    path: '/',
    icon: <DashboardOutlined />,
  },
  {
    key: 'products',
    title: 'sidebar.product',
    icon: <GoldOutlined />,
    items: [
      {
        key: 'product_list',
        title: 'sidebar.productList',
        path: ROUTE_PATHS.PRODUCT_MANAGEMENT,
        childrens: [ROUTE_PATHS.PRODUCT_DETAIL]
      },
      {
        key: 'product_categories',
        title: 'sidebar.productCategories',
        path: ROUTE_PATHS.PRODUCT_CATEGORIES_MANAGEMENT,
        childrens: [ROUTE_PATHS.PRODUCT_CATEGORIES_DETAIL]
      },
      {
        key: 'product_color',
        title: 'sidebar.productColor',
        path: ROUTE_PATHS.PRODUCT_COLORS_MANAGEMENT,
        childrens: [ROUTE_PATHS.PRODUCT_COLORS_DETAIL]
      },
      {
        key: 'product_size',
        title: 'sidebar.productSize',
        path: ROUTE_PATHS.PRODUCT_SIZES_MANAGEMENT,
        childrens: [ROUTE_PATHS.PRODUCT_SIZES_DETAIL]
      },
    ],
  },
  // {
  //   key: 'page_management',
  //   title: 'sidebar.page',
  //   icon: <CodeSandboxOutlined />,
  //   items: [
  //     {
  //       key: 'page_list',
  //       title: 'sidebar.pageList',
  //       path: ROUTE_PATHS.PAGE_MANAGEMENT,
  //       role: roles.PAGE_INDEX,
  //       childrens: [ROUTE_PATHS.PAGE_DETAIL]
  //     },
  //     {
  //       key: 'page_template',
  //       title: 'sidebar.pageTemplate',
  //       path: ROUTE_PATHS.PAGE_TEMPLATE_MANAGEMENT,
  //       role: roles.TEMPLATE_INDEX
  //     },
  //   ],
  // },
  // {
  //   key: 'news',
  //   title: 'sidebar.news',
  //   icon: <ContainerOutlined />,
  //   items: [
  //     {
  //       key: 'news_management',
  //       title: 'sidebar.newsList',
  //       path: ROUTE_PATHS.NEWS_MANAGEMENT,
  //       role: roles.NEWS_INDEX,
  //       childrens: [ROUTE_PATHS.NEWS_DETAIL]
  //     },
  //     {
  //       key: 'news_category',
  //       title: 'sidebar.newsCategory',
  //       path: ROUTE_PATHS.NEWS_CATEGORY_MANAGEMENT,
  //       role: roles.NEWS_CATE_INDEX,
  //       childrens: [ROUTE_PATHS.NEWS_CATEGORY_DETAIL]
  //     },
  //   ],
  // },
  {
    key: 'file',
    title: 'sidebar.file',
    icon: <FileOutlined />,
    path: ROUTE_PATHS.FILE_MANAGEMENT,
  },
  // {
  //   key: 'menu',
  //   title: 'sidebar.menu',
  //   icon: <MenuOutlined />,
  //   path: ROUTE_PATHS.MENU_MANAGEMENT,
  //   role: roles.MENU_INDEX,
  //   childrens: [ROUTE_PATHS.MENU_DETAIL]
  // },
  // {
  //   key: 'banner',
  //   title: 'sidebar.banner',
  //   icon: <LayoutOutlined />,
  //   path: ROUTE_PATHS.BANNER_MANAGEMENT,
  //   role: roles.BANNER_INDEX,
  //   childrens: [ROUTE_PATHS.BANNER_DETAIL]
  // },
  // {
  //   key: 'static_block',
  //   title: 'sidebar.staticBlocks',
  //   icon: <ProjectOutlined />,
  //   path: ROUTE_PATHS.STATIC_BLOCK_MANAGEMENT,
  //   role: roles.STATIC_BLOCK_INDEX,
  //   childrens: [ROUTE_PATHS.STATIC_BLOCK_DETAIL]
  // },
  // {
  //   key: 'faq',
  //   title: 'sidebar.faqs',
  //   icon: <ContainerOutlined />,
  //   items: [
  //     {
  //       key: 'faq_management',
  //       title: 'sidebar.faqsList',
  //       path: ROUTE_PATHS.FAQ_MANAGEMENT,
  //       role: roles.FAQ_INDEX,
  //       childrens: [ROUTE_PATHS.FAQ_DETAIL]
  //     },
  //     {
  //       key: 'faq_category_management',
  //       title: 'sidebar.faqCategory',
  //       path: ROUTE_PATHS.FAQ_CATEGORY_MANAGEMENT,
  //       role: roles.FAQ_CATEGORY_INDEX,
  //       childrens: [ROUTE_PATHS.FAQ_CATEGORY_DETAIL]
  //     },
  //   ],
  // },
  // {
  //   key: 'contact',
  //   title: 'sidebar.contact',
  //   icon: <ContactsOutlined />,
  //   items: [
  //     {
  //       key: 'contact_management',
  //       title: 'sidebar.contactList',
  //       path: ROUTE_PATHS.CONTACT_MANAGEMENT,
  //       role: roles.CONTACT_INDEX
  //     },
  //     {
  //       key: 'contact_problem',
  //       title: 'sidebar.contactProblem',
  //       path: ROUTE_PATHS.CONTACT_PROBLEM_MANAGEMENT,
  //       role: roles.CONTACT_PROBLEM_INDEX,
  //       childrens: [ROUTE_PATHS.CONTACT_PROBLEM_DETAIL]
  //     },
  //   ],
  // },
  // {
  //   key: 'email_template',
  //   title: 'sidebar.emailTemplate',
  //   icon: <MailOutlined />,
  //   path: ROUTE_PATHS.EMAIL_TEMPLATE_MANAGEMENT,
  //   role: roles.EMAIL_TEMPLATE_INDEX,
  //   childrens: [ROUTE_PATHS.EMAIL_TEMPLATE_DETAIL]
  // },
  // {
  //   key: 'form',
  //   title: 'sidebar.forms',
  //   icon: <FormOutlined />,
  //   path: ROUTE_PATHS.FORM_MANAGEMENT,
  //   role: roles.FORM_INDEX,
  //   childrens: [ROUTE_PATHS.FORM_DETAIL]
  // },
  // {
  //   key: 'tools',
  //   title: 'sidebar.tools',
  //   icon: <ToolOutlined />,
  //   items: [
  //     {
  //       key: 'fe_translation',
  //       title: 'sidebar.feTranslations',
  //       path: ROUTE_PATHS.FE_TRANSLATION_MANAGEMENT,
  //       role: roles.FE_TRANSLATION_INDEX
  //     },
  //     {
  //       key: 'cms_translation',
  //       title: 'sidebar.cmsTranslations',
  //       path: ROUTE_PATHS.CMS_TRANSLATION_MANAGEMENT,
  //       role: roles.CMS_TRANSLATION_INDEX
  //     },
  //     {
  //       key: 'redirect',
  //       title: 'sidebar.redirect',
  //       path: ROUTE_PATHS.REDIRECT_MANAGEMENT,
  //       role: roles.REDIRECT_INDEX
  //     },
  //   ]
  // },
  // {
  //   key: 'appearance',
  //   title: 'sidebar.appearance',
  //   icon: <BgColorsOutlined />,
  //   items: [
  //     {
  //       key: 'config-management',
  //       title: 'sidebar.headerFooter',
  //       path: ROUTE_PATHS.SYSTEM_CONFIG_MANAGEMENT,
  //       role: roles.CONFIG_HEADER_INDEX || roles.CONFIG_FOOTER_INDEX,
  //     },
  //     {
  //       key: 'errors_management',
  //       title: 'sidebar.errorsManagement',
  //       path: ROUTE_PATHS.ERRORS_MANAGEMENT,
  //     }
  //   ]
  // },
  // {
  //   key: 'system',
  //   title: 'sidebar.system',
  //   icon: <SettingOutlined />,
  //   items: [
  //     {
  //       key: 'system_management',
  //       title: 'sidebar.general',
  //       path: ROUTE_PATHS.SYSTEM_MANAGEMENT,
  //       role: roles.SYSTEM_INDEX
  //     },
  //     {
  //       key: 'user_management',
  //       title: 'sidebar.users',
  //       path: ROUTE_PATHS.USERS_MANAGEMENT,
  //       role: '*',
  //     },
  //     {
  //       key: 'roles',
  //       title: 'sidebar.roles',
  //       path: ROUTE_PATHS.ROLES_MANAGEMENT,
  //       role: '*',
  //     },
  //     {
  //       key: 'activity_logs',
  //       title: 'sidebar.activityLogs',
  //       path: ROUTE_PATHS.ACTIVITY_MANAGEMENT,
  //       role: roles.ACTIVITYLOG_INDEX,
  //     },
  //   ],
  // },
];

export default menuSidebar;

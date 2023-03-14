import { LeftSquareOutlined, RightSquareOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Menu, Select, Space,
} from 'antd';
import React, {
  useCallback, useEffect, useMemo, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { ChangePasswordModal, EditProfileModal, GenerateSecretTOtp } from './ProfileModals';

import { useAppDispatch, useAppSelector } from 'app/store';
import Icon from 'common/components/Icon';
import { logoutService } from 'common/services/authenticate';
import { removeAccessToken, removeRefreshAccessToken } from 'common/services/common/storage';
import { ROUTE_PATHS } from 'common/utils/constant';
import mapModifiers, { getFirstLetters } from 'common/utils/functions';
import { logout } from 'features/Login/authenticateSlice';
import { getCurrentLanguage, i18ChangeLanguage } from 'i18n';

export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  title: string;
  path?: string;
  items?: MenuItem[];
  role?: string;
  childrens?: string[];
}

interface SidebarProps {
  menuItems: MenuItem[];
  collapsed?: boolean;
  handleCollapsed?: () => void;
}

const { Option } = Select;

const Sidebar: React.FC<SidebarProps> = ({ menuItems, collapsed, handleCollapsed }) => {
  /* Hooks */
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigator = useNavigate();
  const queryClient = useQueryClient();

  const location = useLocation();
  const { roles, profileData } = useAppSelector((state) => state.auth);

  /* States */
  const [valueLanguage, setValueLanguage] = useState(getCurrentLanguage());
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openGenTOtpModal, setOpenGenTOtpModal] = useState(false);

  const isAdmin = useMemo(() => roles.includes('*'), [roles]);

  /* Functions */
  const logoutAction = async () => {
    try {
      await logoutService();
    } catch {
      // empty
    } finally {
      dispatch(logout());
      removeAccessToken();
      removeRefreshAccessToken();
      queryClient.clear();
      navigator(`${ROUTE_PATHS.LOGIN}`);
    }
  };

  const handleEditProfile = () => {
    setOpenEditProfileModal(true);
  };

  const handleChangePassword = () => {
    setOpenChangePasswordModal(true);
  };

  const changeLanguage = (value: string) => {
    setValueLanguage(value);
    i18ChangeLanguage(value);
  };

  const activeMenu = useCallback(() => {
    menuItems.every((ele) => {
      if (ele.path === location.pathname || ele.childrens?.includes(location.pathname)) {
        setSelectedKeys([ele.key]);
        return false;
      }

      if (ele.items?.length) {
        return ele.items.every((item) => {
          if (item.path === location.pathname || item.childrens?.includes(location.pathname)) {
            setOpenKeys((prevOpenKeys) => [...prevOpenKeys, ele.key]);
            setSelectedKeys([item.key]);
            return false;
          }
          return true;
        });
      }
      return true;
    });
  }, [location, menuItems]);

  useEffect(() => {
    activeMenu();
  }, [activeMenu]);

  const useMenu = () => (
    <Menu>
      <Menu.Item onClick={handleEditProfile}>{t('system.editProfile')}</Menu.Item>
      <Menu.Item onClick={handleChangePassword}>{t('system.changePassword')}</Menu.Item>
      <Menu.Item onClick={() => setOpenGenTOtpModal(true)}>
        {
          profileData?.hasTotp ? t('system.inActiveTotp') : t('system.activeTotp')
        }
      </Menu.Item>
      <Menu.Item onClick={logoutAction}>{t('system.logout')}</Menu.Item>
    </Menu>
  );

  const renderMenuSub = (menu: MenuItem) => {
    const hasChildren = menu.items?.some(((item) => item.role && roles.includes(item.role)));
    if ((!hasChildren && !isAdmin) || !menu.items) {
      return null;
    }
    return (
      <Menu.SubMenu
        title={t(menu.title)}
        icon={menu.icon}
        key={menu.key}
      >
        {menu.items.map((item) => (
          !item.role || isAdmin || (item.role && roles.includes(item.role))) && (
            <Menu.Item key={item.key}>
              <Link to={item.path || ''}>
                <span>{t(item.title)}</span>
              </Link>
            </Menu.Item>
          ))}
      </Menu.SubMenu>
    );
  };

  return (
    <div className="sideBar_wrapper">
      <Menu
        className="sideBar_menus"
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={(listKeys) => {
          setOpenKeys(listKeys);
        }}
      >
        {menuItems.map((menu) => (menu.items && menu.items.length
          ? renderMenuSub(menu)
          : (!menu.role || isAdmin || (menu.role && roles.includes(menu.role))) && (
            <Menu.Item key={menu.key}>
              <Link to={menu.path || ''}>
                {menu.icon}
                <span>{t(menu.title)}</span>
              </Link>
            </Menu.Item>
          )))}
      </Menu>
      <div className={mapModifiers('sideBar_action', collapsed && 'collapsed')}>
        <div className="sideBar_language">
          {!collapsed && t('system.language')}
          <Select
            defaultValue="vi"
            className="sideBar_languagePulldown"
            placement="topLeft"
            value={valueLanguage}
            onChange={changeLanguage}
          >
            <Option value="vi">
              <div className="sideBar_languagePulldown_option">
                <span role="img" aria-label="vi">
                  <Icon iconName="vietnam" size="20" />
                </span>
                {
                  !collapsed && t('system.languageVi')
                }
              </div>
            </Option>
            <Option value="en">
              <div className="sideBar_languagePulldown_option">
                <span role="img" aria-label="en">
                  <Icon iconName="english" size="20" />
                </span>
                {
                  !collapsed && t('system.languageEn')
                }
              </div>
            </Option>
          </Select>
        </div>
        {/* <div className="sideBar_theme">
          {
            !collapsed && 'Chế độ'
          }
          <Switch
            style={{ width: 64 }}
            checked={theme === 'dark'}
            onChange={changeTheme}
            checkedChildren="Tối"
            unCheckedChildren="Sáng"
          />
        </div> */}
        <Divider className="sidebar_divider" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <div className="sideBar_profile">
          <Dropdown overlay={useMenu} placement="bottomRight" arrow>
            <Space size={8}>
              {profileData?.avatar ? (
                <Avatar src={profileData.avatar} size={36} alt={profileData?.name} />
              ) : (
                <Avatar
                  style={{ backgroundColor: profileData?.bgAvatar || '#012B61' }}
                  size={36}
                  alt={profileData?.name}
                >
                  {getFirstLetters(profileData?.name || '')}
                </Avatar>
              )}
              {
                !collapsed && (profileData?.name || '')
              }
            </Space>
          </Dropdown>

          <Button className="sideBar_buttonCollapse" onClick={handleCollapsed}>
            {collapsed ? (
              <RightSquareOutlined style={{
                color: 'white',
                fontSize: 20,
                lineHeight: 0,
                borderRadius: 10,
              }}
              />
            ) : (
              <LeftSquareOutlined style={{
                color: 'white',
                fontSize: 20,
                lineHeight: 0,
                borderRadius: 10,
              }}
              />
            )}
          </Button>
        </div>
      </div>
      <EditProfileModal
        isOpen={openEditProfileModal}
        handleClose={() => setOpenEditProfileModal(false)}
      />
      <ChangePasswordModal
        isOpen={openChangePasswordModal}
        handleClose={() => setOpenChangePasswordModal(false)}
      />
      <GenerateSecretTOtp
        isOpen={openGenTOtpModal}
        handleClose={() => setOpenGenTOtpModal(false)}
      />
    </div>
  );
};

export default Sidebar;

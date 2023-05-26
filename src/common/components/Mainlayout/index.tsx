import {
  Image,
} from 'antd';
import Sider from 'antd/lib/layout/Sider';
import Layout from 'antd/lib/layout/layout';
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { LayoutContext } from './context';

import IconLogo from 'common/assets/images/logo.svg';
import Sidebar, { MenuItem } from 'common/components/Sidebar';
// import mapModifiers from 'common/utils/functions';

// const { Title } = Typography;

type Props = {
  menus: MenuItem[];
};

const Mainlayout: React.FC<Props> = ({ menus }) => {
  const { collapsed, setCollapsed } = useContext(LayoutContext);

  return (
    <Layout>
      <Sider width={collapsed ? 80 : 250}>
        <div className="t-mainlayout_sidebar_header">
          <Image width={60} src={IconLogo} preview={false} />
          {/* <Title className={mapModifiers('t-mainlayout_sidebar_branch', collapsed && 'hidden')}>
            NiCi Store
          </Title> */}
        </div>
        <div className="t-mainlayout_sidebar_menu">
          <Sidebar
            menuItems={menus}
            collapsed={collapsed}
            handleCollapsed={setCollapsed}
          />
        </div>
      </Sider>
      <Layout className="t-mainlayout_content">
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default Mainlayout;

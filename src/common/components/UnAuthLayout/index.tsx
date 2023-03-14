import { Col, Layout, Row } from 'antd';
import React from 'react';

import mapModifiers from 'common/utils/functions';

interface UnAuthLayoutProps {
  children?: React.ReactNode;
  imgSrc?: string;
  className?: string;
}

const UnAuthLayout: React.FC<UnAuthLayoutProps> = ({ children, imgSrc, className }) => (
  <Layout style={{ background: '#fff' }} className={mapModifiers('t-unauthlayout', className)}>
    <Row className="t-unauthlayout_row">
      <Col span={24} lg={14}>
        <div className="t-unauthlayout_background">
          <img src={imgSrc || 'https://source.unsplash.com/random'} alt="background" />
        </div>
      </Col>
      <Col span={24} lg={10}>
        {children}
      </Col>
    </Row>
  </Layout>

);

export default UnAuthLayout;

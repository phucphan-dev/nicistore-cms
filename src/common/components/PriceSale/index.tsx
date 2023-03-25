import { Typography } from 'antd';
import React from 'react';

import { renderPrice } from 'common/utils/functions';

interface PriceSaleProps {
  promo?: number;
  price: number;
  unit: string;
}

const roundingPrice = (price: number) => (price % 1000 >= 500
  ? ((Math.floor(price / 1000) + 1) * 1000) : Math.floor(price / 1000) * 1000);

const PriceSale: React.FC<PriceSaleProps> = ({ promo, price, unit }) => (
  <div className="m-priceSale">
    <div className="m-priceSale_original">
      <Typography.Text delete={!!promo}>
        {promo ? renderPrice(price, true, unit) : <strong>{renderPrice(price, true, unit)}</strong>}
      </Typography.Text>
    </div>
    {promo && (
      <div className="m-priceSale_sale">
        <Typography.Text>
          <strong>{renderPrice(roundingPrice(price * (100 - promo) / 100), true, unit)}</strong>
          {' '}
          (
          {promo}
          %)
        </Typography.Text>
      </div>
    )}
  </div>
);

PriceSale.defaultProps = {
  promo: undefined,
};

export default PriceSale;

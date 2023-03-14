import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from 'common/components/Icon';
import Link from 'common/components/Link';
import { checkExternalUrl } from 'common/utils/functions';

export interface SubjectCounterProps {
  title: string;
  number: string;
  backgroundColor: string;
  backgroundColorButton: string;
  href?: string;
  target?: string;
  buttonText?: string;
}

const SubjectCounter: React.FC<SubjectCounterProps> = ({
  title,
  number,
  backgroundColor,
  backgroundColorButton,
  href,
  target,
  buttonText,
}) => {
  const { t } = useTranslation();
  return (
    <div className="m-subjectCounter" style={{ '--background': backgroundColor } as CSSProperties}>
      <div className="m-subjectCounter_wrap">
        <p className="m-subjectCounter_title">
          {t(title)}
        </p>
        <p className="m-subjectCounter_number">
          {number}
        </p>
        <Link
          href={href}
          target={target}
          useExternal={checkExternalUrl(href)}
        >
          <span
            className="m-subjectCounter_button"
            style={{ backgroundColor: backgroundColorButton }}
          >
            <span>
              {buttonText || t('system.seeAll')}
            </span>
            <span className="m-subjectCounter_button_icon">
              <Icon iconName="next" size="16" />
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SubjectCounter;

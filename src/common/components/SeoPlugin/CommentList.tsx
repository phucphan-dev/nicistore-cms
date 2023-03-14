import {
  Typography,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useScrollInfinite from 'common/hooks/useScrollInfinite';
import { formatDateTime } from 'common/utils/functions';

export type CommentItem = {
  id: number;
  content: string;
  commentName?: string;
  time?: string;
};

export interface CommentListProps {
  commentList?: CommentItem[];
  handleSeeMoreComment?: () => void;
}

const CommentList: React.FC<CommentListProps> = ({
  commentList,
  handleSeeMoreComment,
}) => {
  const { t } = useTranslation();

  /* Components */
  const { setNode } = useScrollInfinite(handleSeeMoreComment);

  return (
    <div className="seoPlugin_comments">
      {commentList && commentList.length > 0 && (
        <div className="u-mt-16">
          <Typography.Text strong>{t('system.comments')}</Typography.Text>
          <div className="seoPlugin_comment">
            {commentList.map((item, idx) => (
              <>
                <Typography.Paragraph type="secondary" key={`comment-${idx.toString()}`}>
                  -
                  {' '}
                  {item.content}
                </Typography.Paragraph>
                <Typography.Paragraph className="seoPlugin_comment_author" italic type="secondary" key={`comment-author-${idx.toString()}`}>
                  {item.commentName || ''}
                  {' '}
                  -
                  {' '}
                  {formatDateTime(item.time) || ''}
                </Typography.Paragraph>
              </>
            ))}
            <div ref={(suggest) => setNode(suggest)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentList;

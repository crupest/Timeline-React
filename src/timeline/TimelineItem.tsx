import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { TimelinePostInfo } from '../data/timeline';
import { Row, Col } from 'reactstrap';

export interface TimelineItemProps {
  post: TimelinePostInfo;
  showDeleteButton?: boolean;
  current?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

const TimelineItem: React.FC<TimelineItemProps> = props => {
  const { i18n } = useTranslation();

  const current = props.current === true;

  return (
    <Row
      className={clsx('d-flex position-relative', current && 'current')}
      onClick={props.onClick}
    >
      <Col className="timeline-line-area">
        <div className="timeline-line start"></div>
        <div className="timeline-line-node"></div>
        <div className="timeline-line end"></div>
        {current && <div className="timeline-line current-end" />}
      </Col>
      <Col className="pt-4">
        <Row>
          <span className="text-primary">
            {props.post.time.toLocaleString(i18n.languages)}
          </span>
          <span className="ml-3">{props.post.author.nickname}</span>
        </Row>
        <p className="row d-block timeline-content">
          <img
            src={props.post.author._links.avatar}
            className="avatar rounded float-right float-sm-left mx-2"
          />
          {(() => {
            const { content } = props.post;
            if (content.type === 'text') {
              return content.text;
            } else {
              return <img src={content.url} className="timeline-content-image"/>;
            }
          })()}
        </p>
      </Col>
      {props.showDeleteButton ? (
        <i
          className="fas fa-trash text-danger position-absolute position-rb"
          onClick={props.onDelete}
        />
      ) : (
        undefined
      )}
    </Row>
  );
};

export default TimelineItem;

import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { TimelinePostInfo } from '../data/timeline';
import { Row, Col } from 'reactstrap';

export interface TimelineItemProps {
  post: TimelinePostInfo;
  avatarKey?: string | number;
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
        <Row>
          <Col sm="auto">
            <img
              key={props.avatarKey}
              src={props.post.author._links.avatar}
              className="avatar rounded"
            />
          </Col>
          <Col>
            <p className="timeline-content">{props.post.content}</p>
          </Col>
        </Row>
      </Col>
      {props.showDeleteButton ? (
        <i
          className="fas fa-trash text-danger position-absolute position-rb"
          onClick={props.onDelete}
        />
      ) : (
        false
      )}
    </Row>
  );
};

export default TimelineItem;

import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import { TimelinePostInfo } from '../data/timeline';
import { useAvatarUrlWithGivenVersion } from '../user/api';

export interface TimelineItemProps {
  post: TimelinePostInfo;
  showDeleteButton?: boolean;
  current?: boolean;
  toggleMore?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  avatarVersion?: number;
}

const TimelineItem: React.FC<TimelineItemProps> = (props) => {
  const { i18n } = useTranslation();

  const current = props.current === true;

  const { toggleMore: toggleDelete } = props;

  const avatarUrl = useAvatarUrlWithGivenVersion(
    props.avatarVersion,
    props.post.author._links.avatar
  );

  const onOpenMore = React.useMemo<
    React.MouseEventHandler<HTMLElement> | undefined
  >(() => {
    if (toggleDelete == null) {
      return undefined;
    } else {
      return (e) => {
        toggleDelete();
        e.stopPropagation();
      };
    }
  }, [toggleDelete]);

  return (
    <Row
      className={clsx('position-relative flex-nowrap', current && 'current')}
      onClick={props.onClick}
    >
      <Col className="timeline-line-area">
        <div className="timeline-line start"></div>
        <div className="timeline-line-node-container">
          <div className="timeline-line-node"></div>
        </div>
        <div className="timeline-line end"></div>
        {current && <div className="timeline-line current-end" />}
      </Col>
      <Col className="timeline-pt-start">
        <Row className="flex-nowrap">
          <div className="col-auto flex-shrink-1 px-0">
            <Row className="ml-n3 mr-0 align-items-center">
              <span className="ml-3 text-primary white-space-no-wrap">
                {props.post.time.toLocaleString(i18n.languages)}
              </span>
              <small className="text-dark ml-3">
                {props.post.author.nickname}
              </small>
            </Row>
          </div>
          {props.toggleMore != null ? (
            <div className="col-auto px-2 d-flex justify-content-center align-items-center">
              <i
                className="fas fa-chevron-circle-down text-info icon-button"
                onClick={onOpenMore}
              />
            </div>
          ) : null}
        </Row>
        <p className="row d-block timeline-content">
          <Link
            className="float-right float-sm-left mx-2"
            to={'/users/' + props.post.author.username}
          >
            <img src={avatarUrl} className="avatar rounded" />
          </Link>
          {(() => {
            const { content } = props.post;
            if (content.type === 'text') {
              return content.text;
            } else {
              return (
                <img src={content.url} className="timeline-content-image" />
              );
            }
          })()}
        </p>
      </Col>
      {props.showDeleteButton ? (
        <div
          className="position-absolute position-lt w-100 h-100 mask d-flex justify-content-center align-items-center"
          onClick={props.toggleMore}
        >
          <i
            className="fas fa-trash text-danger large-icon"
            onClick={props.onDelete}
          />
        </div>
      ) : undefined}
    </Row>
  );
};

export default TimelineItem;

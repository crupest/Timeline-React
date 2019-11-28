import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import { Color } from 'csstype';

import { TimelinePostInfo } from '../data/timeline';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { generateAvatarUrl } from '../data/user';

const timelineColor: Color = 'deepskyblue';
const timelineWidth: string = '8px';
const timelineNodeRadius: string = '35px';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex'
  },
  lineArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '0 0 auto',
    width: '70px'
  },
  line: {
    width: timelineWidth,
    background: timelineColor
  },
  lineStart: {
    height: '10px'
  },
  lineEnd: {
    flex: '1 1 auto'
  },
  node: {
    width: timelineNodeRadius,
    height: timelineNodeRadius,
    flex: '0 0 auto',
    borderRadius: '50%',
    border: `${timelineWidth} solid ${timelineColor}`,
    boxSizing: 'border-box'
  },
  contentArea: {
    padding: '15px 0'
  },
  contentAreaTop: {
    display: 'flex'
  },
  nickname: {
    margin: `0 ${theme.spacing(1)}px`
  },
  contentAreaBody: {
    display: 'flex'
  },
  avatar: {
    height: '50px'
  }
}));

export interface TimelineItemProps {
  post: TimelinePostInfo;
}

const TimelineItem: React.FC<TimelineItemProps> = props => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  return (
    <div className={classes.container}>
      <div className={classes.lineArea}>
        <div className={clsx(classes.line, classes.lineStart)}></div>
        <div className={classes.node}></div>
        <div className={clsx(classes.line, classes.lineEnd)}></div>
      </div>
      <div className={classes.contentArea}>
        <div className={classes.contentAreaTop}>
          <Typography variant="subtitle2" color="primary">
            {props.post.time.toLocaleString(i18n.languages)}
          </Typography>
          <Typography variant="body2" className={classes.nickname}>
            {props.post.author}
          </Typography>
        </div>
        <div className={classes.contentAreaBody}>
          <img
            src={generateAvatarUrl(props.post.author)}
            className={classes.avatar}
          />
          <Typography variant="body1">{props.post.content}</Typography>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;

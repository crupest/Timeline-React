import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Color from 'color';

import { generateAvatarUrl } from '../data/user';
import { TimelinePostInfo } from '../data/timeline';

const timelineColor = Color('#0089ff');
const timelineCurrentColor = Color('#4f4dff');
const timelineHaloColor = Color('white');
const timelineWidth = '8px';
const timelineNodeRadius = '35px';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex'
  },
  lineArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '0 0 auto',
    width: '60px'
  },
  line: {
    width: timelineWidth,
    background: timelineColor.string()
  },
  lineStart: {
    height: '20px',
    flex: '0 0 auto'
  },
  lineEnd: {
    flex: '1 1 auto'
  },
  '@keyframes halo': {
    to: {
      boxShadow: `0 0 5px 3px ${timelineHaloColor.string()}`
    }
  },
  '@keyframes halo-noncurrent': {
    from: {
      borderColor: timelineColor.string()
    },
    to: {
      borderColor: timelineColor.fade(0.2).string()
    }
  },
  '@keyframes halo-current': {
    from: {
      borderColor: timelineCurrentColor.string()
    },
    to: {
      borderColor: timelineCurrentColor.fade(0.2).string()
    }
  },
  node: {
    width: timelineNodeRadius,
    height: timelineNodeRadius,
    flex: '0 0 auto',
    borderRadius: '50%',
    border: `${timelineWidth} solid ${timelineColor.string()}`,
    boxSizing: 'border-box',
    zIndex: 1,
    animation: '0.6s infinite alternate',
    animationName: '$halo , $halo-noncurrent'
  },
  contentArea: {
    padding: '22px 0 5px 0'
  },
  contentAreaTop: {
    display: 'flex'
  },
  nickname: {
    margin: `0 ${theme.spacing(1)}px`,
    color: theme.palette.grey[700]
  },
  contentAreaBody: {
    display: 'flex',
    margin: `${theme.spacing(1)}px 0`
  },
  avatar: {
    height: '50px',
    borderRadius: '5px'
  },
  trueContent: {
    margin: `0 ${theme.spacing(1)}px`,
    whiteSpace: 'pre-line'
  },
  currentEnd: {
    height: '20px',
    flex: '0 0 auto',
    background: `linear-gradient(${timelineCurrentColor.string()}, transparent)`
  },
  current: {
    '& $contentArea': {
      paddingBottom: '22px'
    },
    '& $lineStart': {
      background: `linear-gradient(${timelineColor.string()}, ${timelineCurrentColor.string()})`
    },
    '& $node': {
      borderColor: timelineCurrentColor.string(),
      animationName: '$halo , $halo-current'
    },
    '& $lineEnd': {
      background: timelineCurrentColor.string()
    }
  }
}));

export interface TimelineItemProps {
  post: TimelinePostInfo;
  current?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = props => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const current = props.current === true;

  return (
    <div className={clsx(classes.container, current && classes.current)}>
      <div className={classes.lineArea}>
        <div className={clsx(classes.line, classes.lineStart)}></div>
        <div className={classes.node}></div>
        <div className={clsx(classes.line, classes.lineEnd)}></div>
        {current && <div className={clsx(classes.line, classes.currentEnd)} />}
      </div>
      <div className={classes.contentArea}>
        <div className={classes.contentAreaTop}>
          <Typography variant="body2" color="primary">
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
          <Typography className={classes.trueContent} variant="body1">{props.post.content}</Typography>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;

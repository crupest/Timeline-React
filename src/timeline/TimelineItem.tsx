import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Color from 'color';

import { generateAvatarUrl } from '../data/user';
import { TimelinePostInfo } from '../data/timeline';

const timelineColor: string = Color('#0089ff').hex();
const timelineCurrentColor: string = Color('#4f4dff').hex();
const timelineHaloColor: string = Color('white').hex();
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
    background: timelineColor
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
      boxShadow: `0 0 5px 3px ${timelineHaloColor}`
    }
  },
  '@keyframes halo-noncurrent': {
    from: {
      borderColor: timelineColor
    },
    to: {
      borderColor: Color(timelineColor)
        .lighten(0.2)
        .hex()
    }
  },
  '@keyframes halo-current': {
    from: {
      borderColor: timelineCurrentColor
    },
    to: {
      borderColor: Color(timelineCurrentColor)
        .lighten(0.2)
        .hex()
    }
  },
  node: {
    width: timelineNodeRadius,
    height: timelineNodeRadius,
    flex: '0 0 auto',
    borderRadius: '50%',
    border: `${timelineWidth} solid ${timelineColor}`,
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
    margin: `0 ${theme.spacing(1)}px`
  },
  contentAreaBody: {
    display: 'flex'
  },
  avatar: {
    height: '50px'
  },
  currentEnd: {
    height: '20px',
    flex: '0 0 auto',
    background: `linear-gradient(${timelineCurrentColor}, transparent)`
  },
  current: {
    '& $contentArea': {
      paddingBottom: '22px'
    },
    '& $lineStart': {
      background: `linear-gradient(${timelineColor}, ${timelineCurrentColor})`
    },
    '& $node': {
      borderColor: timelineCurrentColor,
      animationName: '$halo , $halo-current'
    },
    '& $lineEnd': {
      background: timelineCurrentColor
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
          <Typography variant="body1">{props.post.content}</Typography>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;

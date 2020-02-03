import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import {
  Card,
  Typography,
  IconButton,
  Icon,
  Theme,
  makeStyles
} from '@material-ui/core';

import TimelineVisibilityIcon from '../timeline/TimelineVisibilityIcon';
import { PersonalTimelineInfo } from '../data/timeline';

export interface UserInfoCardProps {
  timeline: PersonalTimelineInfo;
  manageable: boolean;
  onManage: () => void;
  onMember: () => void;
  className?: string;
  avatarKey?: string | number;
  onHeight?: (height: number) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    height: 80
  },
  root: {
    display: 'flex'
  },
  body: {
    padding: theme.spacing(1),
    flexGrow: 1
  },
  nickname: {
    display: 'inline-block'
  },
  username: {
    display: 'inline-block',
    padding: `0 ${theme.spacing(1)}px`
  },
  visibilityIcon: {
    verticalAlign: 'text-top'
  },
  memberButton: {
    alignSelf: 'flex-start',
    color: 'skyblue'
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0
  }
}));

const UserInfoCard: React.FC<UserInfoCardProps> = props => {
  const classes = useStyles();
  const cardRef = useRef<HTMLElement>();

  useEffect(() => {
    if (props.onHeight && cardRef.current) {
      props.onHeight(cardRef.current.clientHeight);
    }
  });

  return (
    <Card
      ref={cardRef}
      classes={{
        root: clsx(classes.root, props.className)
      }}
    >
      <img
        key={props.avatarKey}
        className={classes.avatar}
        src={props.timeline.owner._links.avatar}
      />
      <div className={classes.body}>
        <Typography variant="h6" className={classes.nickname}>
          {props.timeline.owner.nickname}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          className={classes.username}
        >
          @{props.timeline.owner.username}
        </Typography>
        <TimelineVisibilityIcon
          className={classes.visibilityIcon}
          visibility={props.timeline.visibility}
        />
        <Typography variant="body2">{props.timeline.description}</Typography>
      </div>
      <IconButton
        classes={{ root: classes.memberButton }}
        onClick={props.onMember}
      >
        <Icon>group</Icon>
      </IconButton>
      {props.manageable ? (
        <IconButton
          color="secondary"
          classes={{ root: classes.editButton }}
          onClick={props.onManage}
        >
          <Icon>edit</Icon>
        </IconButton>
      ) : (
        undefined
      )}
    </Card>
  );
};

export default UserInfoCard;

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
import { TimelineVisibility } from '../data/timeline';

export interface UserInfoCardProps {
  username: string;
  nickname: string;
  description: string;
  avatarUrl: string;
  timelineVisibility: TimelineVisibility;
  editable: boolean;
  onEdit: () => void;
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
    padding: theme.spacing(1)
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
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0
  }
}));

const UserInfoCard: React.FunctionComponent<UserInfoCardProps> = props => {
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
        src={props.avatarUrl}
      />
      <div className={classes.body}>
        <Typography variant="h6" className={classes.nickname}>
          {props.nickname}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          className={classes.username}
        >
          @{props.username}
        </Typography>
        <TimelineVisibilityIcon
          className={classes.visibilityIcon}
          visibility={props.timelineVisibility}
        />
        <Typography variant="body2">{props.description}</Typography>
      </div>
      {props.editable ? (
        <IconButton
          color="secondary"
          classes={{ root: classes.editButton }}
          onClick={props.onEdit}
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

import React, { useState } from 'react';
import {
  Avatar,
  CircularProgress,
  Dialog,
  Divider,
  makeStyles,
  Theme,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@material-ui/core';
import SearchInput from '../common/SearchInput';

export interface UserInfo {
  username: string;
  nickname: string;
  avatarUrl: string;
}

export interface TimelineMemberProps {
  members: UserInfo[] | null;
  edit: {
    onCheckUser: (username: string) => Promise<UserInfo | null>;
    onAddUser: (username: string) => void;
    onRemoveUser: (username: string) => void;
  } | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  memberList: {
    minHeight: 100
  },
  addArea: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1)
  }
}));

const TimelineMember: React.FC<TimelineMemberProps> = props => {
  const classes = useStyles();

  const [userSearchText, setUserSearchText] = useState<string>('');

  const editable = props.edit != null;

  const members = props.members;
  if (members == null) {
    return <CircularProgress />;
  }

  return (
    <div className={classes.container}>
      <List classes={{ root: classes.memberList }} dense>
        {members.map(member => (
          <ListItem key={member.username} dense>
            <ListItemAvatar>
              <Avatar src={member.avatarUrl} />
            </ListItemAvatar>
            <ListItemText
              primary={member.nickname}
              secondary={'@' + member.username}
            />
          </ListItem>
        ))}
      </List>
      {editable ? (
        <>
          <Divider />
          <div className={classes.addArea}>
            <SearchInput
              value={userSearchText}
              onChange={v => {
                setUserSearchText(v);
              }}
              onButtonClick={() => {
                // TODO!!!
              }}
            />
          </div>
        </>
      ) : (
        undefined
      )}
    </div>
  );
};

export default TimelineMember;

export interface TimelineMemberDialogProps extends TimelineMemberProps {
  open: boolean;
  onClose: () => void;
}

const useDialogStyles = makeStyles((theme: Theme) => ({
  dialog: (props: { loading: boolean }) => ({
    minWidth: 500,
    minHeight: 200,
    [theme.breakpoints.down('sm')]: {
      minWidth: 250
    },
    display: 'flex',
    ...(props.loading
      ? {
          justifyContent: 'center',
          alignItems: 'center'
        }
      : {})
  })
}));

export const TimelineMemberDialog: React.FC<TimelineMemberDialogProps> = props => {
  const classes = useDialogStyles({ loading: props.members == null });

  return (
    <Dialog
      classes={{ paper: classes.dialog }}
      open={props.open}
      onClose={props.onClose}
    >
      <TimelineMember {...props} />
    </Dialog>
  );
};

import React, { useState } from 'react';
import {
  makeStyles,
  Theme,
  TextField,
  Icon,
  Button,
  CircularProgress
} from '@material-ui/core';

export interface TimelinePostEditProps {
  onPost: (content: string) => Promise<void>;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    boxSizing: 'border-box',
    background: theme.palette.grey[200]
  },
  input: {
    margin: theme.spacing(1)
  },
  sendArea: {
    display: 'flex',
    height: '50px',
    width: '50px',
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButton: {
    width: '100%',
    height: '100%',
    minWidth: 'unset'
  },
  progress: {}
}));

const TimelinePostEdit: React.FC<TimelinePostEditProps> = props => {
  const classes = useStyles();

  const [state, setState] = useState<'input' | 'process'>('input');

  return (
    <div className={classes.container}>
      <TextField fullWidth multiline classes={{ root: classes.input }} />
      <div className={classes.sendArea}>
        {(() => {
          if (state === 'input') {
            return (
              <Button
                color="primary"
                classes={{ root: classes.sendButton }}
                onClick={() => {
                  setState('process');
                  setTimeout(() => {
                    setState('input');
                  }, 3000);
                }}
              >
                <Icon>send</Icon>
              </Button>
            );
          } else {
            return <CircularProgress classes={{ root: classes.progress }} />;
          }
        })()}
      </div>
    </div>
  );
};

export default TimelinePostEdit;

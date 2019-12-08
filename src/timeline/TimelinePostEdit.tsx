import React, { useState } from 'react';
import {
  makeStyles,
  Theme,
  TextField,
  Icon,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  IconButton
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
  progress: {},
  sendErrorSnackbar: {
    backgroundColor: theme.palette.error.dark
  },
  sendErrorSnackbarMessage: {
    display: 'flex',
    alignItems: 'center'
  },
  sendErrorSnackbarMessageText: {
    marginLeft: theme.spacing(1)
  }
}));

const TimelinePostEdit: React.FC<TimelinePostEditProps> = props => {
  const classes = useStyles();

  const [state, setState] = useState<'input' | 'process'>('input');
  const [text, setText] = useState<string>('');

  const [errorSnackbar, setErrorSnackbar] = useState<null | (() => string)>(
    null
  );

  const closeErrorSnackbar = (): void => {
    setErrorSnackbar(null);
  };

  return (
    <div className={classes.container}>
      <TextField
        fullWidth
        multiline
        value={text}
        disabled={state === 'process'}
        classes={{ root: classes.input }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setText(event.currentTarget.value);
        }}
      />
      <div className={classes.sendArea}>
        {(() => {
          if (state === 'input') {
            return (
              <Button
                color="primary"
                classes={{ root: classes.sendButton }}
                onClick={() => {
                  setState('process');
                  props.onPost(text).then(
                    _ => {
                      setText('');
                      setState('input');
                    },
                    e => {
                      setErrorSnackbar(() => () =>
                        'Send failed! Error: ' + e.toString()
                      );
                      setState('input');
                    }
                  );
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
      {errorSnackbar && (
        <Snackbar open onClose={closeErrorSnackbar}>
          <SnackbarContent
            classes={{
              root: classes.sendErrorSnackbar,
              message: classes.sendErrorSnackbarMessage
            }}
            message={
              <>
                <Icon>error</Icon>
                <span className={classes.sendErrorSnackbarMessageText}>
                  {errorSnackbar()}
                </span>
              </>
            }
            action={
              <IconButton color="inherit" onClick={closeErrorSnackbar}>
                <Icon>close</Icon>
              </IconButton>
            }
          ></SnackbarContent>
        </Snackbar>
      )}
    </div>
  );
};

export default TimelinePostEdit;

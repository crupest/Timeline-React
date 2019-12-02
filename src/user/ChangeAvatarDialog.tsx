import React, { useState, useEffect } from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Theme,
  IconButton,
  Icon,
  Button
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    alignItems: 'flex-start'
  },
  imagePreview: {
    height: 200
  }
}));

export interface ChangeAvatarDialogProps {
  open: boolean;
  close: () => void;
}

const ChangeAvatarDialog: React.FC<ChangeAvatarDialogProps> = props => {
  const classes = useStyles();

  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [state, setState] = useState<'decode' | 'error' | 'ok'>('decode');

  useEffect(() => {
    if (file != null) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      fullScreen
      classes={{ paper: classes.container }}
    >
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={props.close}>
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h6">Change Avatar</Typography>
        </Toolbar>
      </AppBar>
      <Typography>Your image must be square.</Typography>
      <input
        type="file"
        onChange={e => {
          const files = e.target.files;
          setState('decode');
          if (files == null || files.length === 0) {
            setFile(null);
          } else {
            setFile(files[0]);
          }
        }}
        accept="image/*"
      />
      {(() => {
        if (file != null) {
          if (fileUrl != null) {
            return (
              <>
                <img
                  className={classes.imagePreview}
                  onLoad={e => {
                    const image = e.currentTarget;
                    setState(
                      image.naturalWidth === image.naturalHeight
                        ? 'ok'
                        : 'error'
                    );
                  }}
                  src={fileUrl}
                  alt="preview"
                />
                {(() => {
                  switch (state) {
                    case 'decode':
                      return <Typography>Decoding...</Typography>;
                    case 'error':
                      return (
                        <Typography color="error">
                          Not a square image.
                        </Typography>
                      );
                    case 'ok':
                      return <Button>Upload</Button>;
                  }
                })()}
              </>
            );
          } else {
            return <Typography>Loading file...</Typography>;
          }
        } else {
          return <Typography>Please select a file.</Typography>;
        }
      })()}
    </Dialog>
  );
};

export default ChangeAvatarDialog;

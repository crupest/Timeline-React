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
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    alignItems: 'center'
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '500px'
  },
  fileInput: {
    marginTop: theme.spacing(2)
  },
  imagePreview: {
    height: 200
  },
  bottomPrompt: {
    margin: `${theme.spacing(2)}px 0`
  },
  uploadButton: {
    alignSelf: 'flex-end',
    margin: `${theme.spacing(2)}px ${theme.spacing(2)}px`
  }
}));

export interface ChangeAvatarDialogProps {
  open: boolean;
  close: () => void;
}

const ChangeAvatarDialog: React.FC<ChangeAvatarDialogProps> = props => {
  const classes = useStyles();
  const { t } = useTranslation();

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
          <Typography variant="h6">
            {t('userPage.dialogChangeAvatar.title')}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.body}>
        <Typography variant="body1">
          {t('userPage.dialogChangeAvatar.prompt')}
        </Typography>
        <input
          type="file"
          className={classes.fileInput}
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
          const createBottomPrompt = (
            message: string,
            error = false
          ): React.ReactElement => {
            return (
              <Typography
                className={classes.bottomPrompt}
                color={error ? 'error' : undefined}
              >
                {message}
              </Typography>
            );
          };
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
                    alt={t('userPage.dialogChangeAvatar.previewImgAlt')}
                  />
                  {(() => {
                    switch (state) {
                      case 'decode':
                        return createBottomPrompt(
                          t('userPage.dialogChangeAvatar.imgPrompt.decoding')
                        );
                      case 'error':
                        return createBottomPrompt(
                          t(
                            'userPage.dialogChangeAvatar.imgPrompt.errorNotSquare'
                          ),
                          true
                        );
                      case 'ok':
                        return (
                          <Button
                            classes={{ root: classes.uploadButton }}
                            variant="contained"
                            color="secondary"
                          >
                            {t('userPage.dialogChangeAvatar.upload')}
                          </Button>
                        );
                    }
                  })()}
                </>
              );
            } else {
              return createBottomPrompt(
                t('userPage.dialogChangeAvatar.imgPrompt.loadingFile')
              );
            }
          } else {
            return createBottomPrompt(
              t('userPage.dialogChangeAvatar.imgPrompt.select')
            );
          }
        })()}
      </div>
    </Dialog>
  );
};

export default ChangeAvatarDialog;

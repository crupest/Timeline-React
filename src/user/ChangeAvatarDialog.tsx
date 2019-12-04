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
  Button,
  CircularProgress
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
  process: (file: File) => Promise<void>;
}

const ChangeAvatarDialog: React.FC<ChangeAvatarDialogProps> = props => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [imgState, setImgState] = useState<'decode' | 'error' | 'ok'>('decode');
  const [uploadState, setUploadState] = useState<
    { type: 'input'; error?: string } | { type: 'processing' }
  >({ type: 'input' });

  const uploading = uploadState.type === 'processing';

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
          {!uploading && (
            <IconButton edge="start" color="inherit" onClick={props.close}>
              <Icon>arrow_back</Icon>
            </IconButton>
          )}
          <Typography variant="h6">
            {t('userPage.dialogChangeAvatar.title')}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.body}>
        <Typography variant="body1">
          {t('userPage.dialogChangeAvatar.prompt')}
        </Typography>
        {!uploading && (
          <input
            type="file"
            className={classes.fileInput}
            onChange={e => {
              const files = e.target.files;
              setImgState('decode');
              if (files == null || files.length === 0) {
                setFile(null);
              } else {
                setFile(files[0]);
              }
            }}
            accept="image/*"
          />
        )}
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
                      setImgState(
                        image.naturalWidth === image.naturalHeight
                          ? 'ok'
                          : 'error'
                      );
                    }}
                    src={fileUrl}
                    alt={t('userPage.dialogChangeAvatar.previewImgAlt')}
                  />
                  {(() => {
                    switch (imgState) {
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
                      case 'ok': {
                        if (uploadState.type === 'input') {
                          const button = (
                            <Button
                              classes={{ root: classes.uploadButton }}
                              variant="contained"
                              color="secondary"
                              onClick={() => {
                                setUploadState({ type: 'processing' });
                                props.process(file).then(
                                  _ => {
                                    props.close();
                                  },
                                  e => {
                                    setUploadState({
                                      type: 'input',
                                      error: e.toString()
                                    });
                                  }
                                );
                              }}
                            >
                              {t('userPage.dialogChangeAvatar.upload')}
                            </Button>
                          );

                          if (uploadState.error) {
                            return (
                              <>
                                {createBottomPrompt(uploadState.error, true)}
                                {button}
                              </>
                            );
                          } else {
                            return button;
                          }
                        } else {
                          return (
                            <CircularProgress
                              classes={{ root: classes.uploadButton }}
                            />
                          );
                        }
                      }
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

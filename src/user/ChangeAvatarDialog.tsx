import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalHeader,
  Row,
  Button,
  Spinner,
  ModalBody,
  ModalFooter
} from 'reactstrap';

export interface ChangeAvatarDialogProps {
  open: boolean;
  close: () => void;
  process: (file: File) => Promise<void>;
}

const ChangeAvatarDialog: React.FC<ChangeAvatarDialogProps> = props => {
  const { t } = useTranslation();

  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [imageState, setImageState] = useState<'decode' | 'error' | 'ok'>(
    'decode'
  );
  const [uploadState, setUploadState] = useState<'no' | 'doing' | 'done'>('no');
  const [message, setMessage] = useState<{
    type: 'normal' | 'error';
    message: string | { type: 'custom'; text: string };
  } | null>({
    type: 'normal',
    message: 'userPage.dialogChangeAvatar.imgPrompt.select'
  });

  const state = (():
    | { type: 'input'; image: boolean; valid: boolean }
    | { type: 'process'; processType: 'readfile' | 'decode' | 'upload' }
    | { type: 'done' } => {
    if (file == null) {
      return {
        type: 'input',
        image: false,
        valid: false
      };
    } else {
      if (fileUrl == null) {
        return {
          type: 'process',
          processType: 'readfile'
        };
      } else {
        switch (imageState) {
          case 'decode':
            return {
              type: 'process',
              processType: 'decode'
            };
          case 'error':
            return {
              type: 'input',
              image: true,
              valid: false
            };
          case 'ok':
            switch (uploadState) {
              case 'no':
                return {
                  type: 'input',
                  image: true,
                  valid: true
                };
              case 'doing':
                return {
                  type: 'process',
                  processType: 'upload'
                };
              case 'done':
                return { type: 'done' };
            }
        }
      }
    }
  })();

  const trueProcess =
    state.type === 'process' && state.processType === 'upload';

  const toggle = (): void => {
    if (!trueProcess) {
      props.close();
    }
  };

  useEffect(() => {
    if (file != null) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setMessage({
        type: 'normal',
        message: 'userPage.dialogChangeAvatar.imgPrompt.decoding'
      });
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  return (
    <Modal isOpen={props.open} toggle={toggle}>
      <ModalHeader> {t('userPage.dialogChangeAvatar.title')}</ModalHeader>
      <ModalBody className="container">
        {state.type === 'done' ? (
          <Row className="p-4 text-success">{t('operationDialog.success')}</Row>
        ) : (
          <>
            <Row>{t('userPage.dialogChangeAvatar.prompt')}</Row>
            {!trueProcess && (
              <Row>
                <input
                  type="file"
                  onChange={e => {
                    const files = e.target.files;
                    setImageState('decode');
                    if (files == null || files.length === 0) {
                      setFile(null);
                      setMessage({
                        type: 'normal',
                        message: 'userPage.dialogChangeAvatar.imgPrompt.select'
                      });
                    } else {
                      setFile(files[0]);
                      setMessage({
                        type: 'normal',
                        message:
                          'userPage.dialogChangeAvatar.imgPrompt.loadingFile'
                      });
                    }
                  }}
                  accept="image/*"
                />
              </Row>
            )}
            {fileUrl != null && (
              <Row>
                <img
                  className="avatar large"
                  onLoad={e => {
                    const image = e.currentTarget;
                    const valid = image.naturalWidth === image.naturalHeight;
                    setImageState(valid ? 'ok' : 'error');
                    setMessage(
                      valid
                        ? null
                        : {
                            type: 'error',
                            message:
                              'userPage.dialogChangeAvatar.imgPrompt.errorNotSquare'
                          }
                    );
                  }}
                  src={fileUrl}
                  alt={t('userPage.dialogChangeAvatar.previewImgAlt')}
                />
              </Row>
            )}
            {(() => {
              if (message != null) {
                return (
                  <Row
                    className={
                      message.type === 'error' ? 'text-danger' : undefined
                    }
                  >
                    {typeof message.message === 'string'
                      ? t(message.message)
                      : message.message.text}
                  </Row>
                );
              }
            })()}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {(() => {
          if (state.type === 'done') {
            return (
              <Button color="success" onClick={toggle}>
                {t('operationDialog.ok')}
              </Button>
            );
          } else if (state.type === 'input' && state.valid) {
            return (
              <>
                <Button color="secondary" onClick={toggle}>
                  {t('operationDialog.cancel')}
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    setUploadState('doing');
                    props.process(file!).then(
                      () => {
                        setUploadState('done');
                      },
                      (e: unknown) => {
                        setUploadState('no');
                        setMessage({
                          type: 'error',
                          message: { type: 'custom', text: e as string }
                        });
                      }
                    );
                  }}
                >
                  {t('userPage.dialogChangeAvatar.upload')}
                </Button>
              </>
            );
          } else if (trueProcess) {
            return <Spinner color="primary" type="grow" />;
          } else {
            return (
              <Button color="secondary" onClick={toggle}>
                {t('operationDialog.cancel')}
              </Button>
            );
          }
        })()}
      </ModalFooter>
    </Modal>
  );
};

export default ChangeAvatarDialog;

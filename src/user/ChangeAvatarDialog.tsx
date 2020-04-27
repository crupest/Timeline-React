import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalHeader,
  Row,
  Button,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { AxiosError } from 'axios';

import ImageCropper, { Clip, applyClipToImage } from '../common/ImageCropper';

export interface ChangeAvatarDialogProps {
  open: boolean;
  close: () => void;
  process: (blob: Blob) => Promise<void>;
}

const ChangeAvatarDialog: React.FC<ChangeAvatarDialogProps> = (props) => {
  const { t } = useTranslation();

  const [file, setFile] = React.useState<File | null>(null);
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);
  const [clip, setClip] = React.useState<Clip | null>(null);
  const [
    cropImgElement,
    setCropImgElement,
  ] = React.useState<HTMLImageElement | null>(null);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);

  const [state, setState] = React.useState<
    | 'select'
    | 'crop'
    | 'processcrop'
    | 'preview'
    | 'uploading'
    | 'success'
    | 'error'
  >('select');

  const [message, setMessage] = useState<
    string | { type: 'custom'; text: string } | null
  >('userPage.dialogChangeAvatar.prompt.select');

  const trueMessage =
    message == null
      ? null
      : typeof message === 'string'
      ? t(message)
      : message.text;

  const closeDialog = props.close;

  const toggle = React.useCallback((): void => {
    if (!(state === 'uploading')) {
      closeDialog();
    }
  }, [state, closeDialog]);

  useEffect(() => {
    if (file != null) {
      const url = URL.createObjectURL(file);
      setClip(null);
      setFileUrl(url);
      setState('crop');
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setFileUrl(null);
      setState('select');
    }
  }, [file]);

  React.useEffect(() => {
    if (resultBlob != null) {
      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
      setState('preview');
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setResultUrl(null);
    }
  }, [resultBlob]);

  const onSelectFile = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const files = e.target.files;
      if (files == null || files.length === 0) {
        setFile(null);
      } else {
        setFile(files[0]);
      }
    },
    []
  );

  const onCropNext = React.useCallback(() => {
    if (
      cropImgElement == null ||
      clip == null ||
      clip.width === 0 ||
      file == null
    ) {
      throw new Error('Invalid state.');
    }

    setState('processcrop');
    applyClipToImage(cropImgElement, clip, file.type).then((b) => {
      setResultBlob(b);
    });
  }, [cropImgElement, clip, file]);

  const onCropPrevious = React.useCallback(() => {
    setFile(null);
    setState('select');
  }, []);

  const onPreviewPrevious = React.useCallback(() => {
    setResultBlob(null);
    setState('crop');
  }, []);

  const process = props.process;

  const upload = React.useCallback(() => {
    if (resultBlob == null) {
      throw new Error('Invalid state.');
    }

    setState('uploading');
    process(resultBlob).then(
      () => {
        setState('success');
      },
      (e: unknown) => {
        setState('error');
        setMessage({ type: 'custom', text: (e as AxiosError).message });
      }
    );
  }, [resultBlob, process]);

  const createPreviewRow = (): React.ReactElement => {
    if (resultUrl == null) {
      throw new Error('Invalid state.');
    }
    return (
      <Row className="justify-content-center">
        <img
          className="change-avatar-img"
          src={resultUrl}
          alt={t('userPage.dialogChangeAvatar.previewImgAlt')}
        />
      </Row>
    );
  };

  return (
    <Modal isOpen={props.open} toggle={toggle}>
      <ModalHeader> {t('userPage.dialogChangeAvatar.title')}</ModalHeader>
      {(() => {
        if (state === 'select') {
          return (
            <>
              <ModalBody className="container">
                <Row>{t('userPage.dialogChangeAvatar.prompt.select')}</Row>
                <Row>
                  <input type="file" accept="image/*" onChange={onSelectFile} />
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                  {t('operationDialog.cancel')}
                </Button>
              </ModalFooter>
            </>
          );
        } else if (state === 'crop') {
          if (fileUrl == null) {
            throw new Error('Invalid state.');
          }
          return (
            <>
              <ModalBody className="container">
                <Row className="justify-content-center">
                  <ImageCropper
                    clip={clip}
                    onChange={setClip}
                    imageUrl={fileUrl}
                    imageElementCallback={setCropImgElement}
                  />
                </Row>
                <Row>{t('userPage.dialogChangeAvatar.prompt.crop')}</Row>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                  {t('operationDialog.cancel')}
                </Button>
                <Button color="secondary" onClick={onCropPrevious}>
                  {t('operationDialog.previousStep')}
                </Button>
                <Button
                  color="primary"
                  onClick={onCropNext}
                  disabled={
                    cropImgElement == null || clip == null || clip.width === 0
                  }
                >
                  {t('operationDialog.nextStep')}
                </Button>
              </ModalFooter>
            </>
          );
        } else if (state === 'processcrop') {
          return (
            <>
              <ModalBody className="container">
                <Row>
                  {t('userPage.dialogChangeAvatar.prompt.processingCrop')}
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                  {t('operationDialog.cancel')}
                </Button>
                <Button color="secondary" onClick={onPreviewPrevious}>
                  {t('operationDialog.previousStep')}
                </Button>
              </ModalFooter>
            </>
          );
        } else if (state === 'preview') {
          return (
            <>
              <ModalBody className="container">
                {createPreviewRow()}
                <Row>{t('userPage.dialogChangeAvatar.prompt.preview')}</Row>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                  {t('operationDialog.cancel')}
                </Button>
                <Button color="secondary" onClick={onPreviewPrevious}>
                  {t('operationDialog.previousStep')}
                </Button>
                <Button color="primary" onClick={upload}>
                  {t('userPage.dialogChangeAvatar.upload')}
                </Button>
              </ModalFooter>
            </>
          );
        } else if (state === 'uploading') {
          return (
            <>
              <ModalBody className="container">
                {createPreviewRow()}
                <Row>{t('userPage.dialogChangeAvatar.prompt.uploading')}</Row>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          );
        } else if (state === 'success') {
          return (
            <>
              <ModalBody className="container">
                <Row className="p-4 text-success">
                  {t('operationDialog.success')}
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onClick={toggle}>
                  {t('operationDialog.ok')}
                </Button>
              </ModalFooter>
            </>
          );
        } else {
          return (
            <>
              <ModalBody className="container">
                {createPreviewRow()}
                <Row className="text-danger">{trueMessage}</Row>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                  {t('operationDialog.cancel')}
                </Button>
                <Button color="primary" onClick={upload}>
                  {t('operationDialog.retry')}
                </Button>
              </ModalFooter>
            </>
          );
        }
      })()}
    </Modal>
  );
};

export default ChangeAvatarDialog;

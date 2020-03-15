import React from 'react';
import clsx from 'clsx';
import { Container, Button, Spinner, Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { pushAlert } from '../common/alert-service';
import { CreatePostRequest } from '../data/timeline';

interface TimelinePostEditImageProps {
  onSelect: (blob: Blob | null) => void;
}

const TimelinePostEditImage: React.FC<TimelinePostEditImageProps> = props => {
  const { t } = useTranslation();

  const [file, setFile] = React.useState<File | null>(null);
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file != null) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    e => {
      const files = e.target.files;
      if (files == null || files.length === 0) {
        setFile(null);
        setFileUrl(null);
      } else {
        setFile(files[0]);
      }
      props.onSelect(null);
      setError(null);
    },
    []
  );

  const onImgLoad = React.useCallback(() => {
    props.onSelect(file);
  }, [props.onSelect, file]);

  const onImgError = React.useCallback(() => {
    setError('loadImageError');
  }, []);

  return (
    <>
      <input type="file" onChange={onInputChange} accept="image/*" />
      {fileUrl && error == null && (
        <img
          src={fileUrl}
          className="timeline-post-edit-image"
          onLoad={onImgLoad}
          onError={onImgError}
        />
      )}
      {error != null && <div className="text-danger">{t(error)}</div>}
    </>
  );
};

export type TimelinePostSendCallback = (
  content: CreatePostRequest
) => Promise<void>;

export interface TimelinePostEditProps {
  className?: string;
  onPost: TimelinePostSendCallback;
  onHeightChange?: (height: number) => void;
}

const TimelinePostEdit: React.FC<TimelinePostEditProps> = props => {
  const { t } = useTranslation();

  const [state, setState] = React.useState<'input' | 'process'>('input');
  const [kind, setKind] = React.useState<'text' | 'image'>('text');
  const [text, setText] = React.useState<string>('');
  const [imageBlob, setImageBlob] = React.useState<Blob | null>(null);

  const canSend = kind === 'text' || (kind === 'image' && imageBlob != null);

  React.useEffect(() => {
    if (props.onHeightChange) {
      props.onHeightChange(
        document.getElementById('timeline-post-edit-area')!.clientHeight
      );
    }
    return () => {
      if (props.onHeightChange) {
        props.onHeightChange(0);
      }
    };
  });

  const toggleKind = React.useCallback(() => {
    setKind(oldKind => (oldKind === 'text' ? 'image' : 'text'));
    setImageBlob(null);
  }, []);

  const onSend = React.useCallback(() => {
    setState('process');

    const req: CreatePostRequest =
      kind === 'text'
        ? {
            content: {
              type: 'text',
              text: text
            }
          }
        : {
            content: {
              type: 'image',
              data: imageBlob!
            }
          };

    props.onPost(req).then(
      _ => {
        if (kind === 'text') {
          setText('');
        }
        setState('input');
        setKind('text');
      },
      _ => {
        pushAlert({
          type: 'danger',
          message: t('timeline.sendPostFailed')
        });
        setState('input');
      }
    );
  }, [kind, text, imageBlob, props.onPost]);

  const onImageSelect = React.useCallback((blob: Blob | null) => {
    setImageBlob(blob);
  }, []);

  return (
    <Container
      id="timeline-post-edit-area"
      fluid
      className="fixed-bottom bg-light"
    >
      <Row>
        <Col className="px-0">
          {kind === 'text' ? (
            <textarea
              className="w-100 h-100"
              value={text}
              disabled={state === 'process'}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setText(event.currentTarget.value);
              }}
            />
          ) : (
            <TimelinePostEditImage onSelect={onImageSelect} />
          )}
        </Col>
        <Col sm="col-auto align-self-end m-1">
          {(() => {
            if (state === 'input') {
              return (
                <>
                  <i
                    className={clsx(
                      'fas d-block text-center large-icon mt-1 mb-2',
                      kind === 'text' ? 'fa-image' : 'fa-font'
                    )}
                    onClick={toggleKind}
                  />
                  <Button color="primary" onClick={onSend} disabled={!canSend}>
                    {t('timeline.send')}
                  </Button>
                </>
              );
            } else {
              return <Spinner />;
            }
          })()}
        </Col>
      </Row>
    </Container>
  );
};

export default TimelinePostEdit;

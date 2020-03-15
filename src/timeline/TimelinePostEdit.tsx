import React from 'react';
import { Container, Button, Spinner, Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { pushAlert } from '../common/alert-service';

export type TimelinePostSendCallback = (content: string) => Promise<void>;

export interface TimelinePostEditProps {
  className?: string;
  onPost: TimelinePostSendCallback;
  onHeightChange?: (height: number) => void;
}

const TimelinePostEdit: React.FC<TimelinePostEditProps> = props => {
  const { t } = useTranslation();

  const [state, setState] = React.useState<'input' | 'process'>('input');
  const [text, setText] = React.useState<string>('');

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

  const onSend = React.useCallback(() => {
    setState('process');
    props.onPost(text).then(
      _ => {
        setText('');
        setState('input');
      },
      _ => {
        pushAlert({
          type: 'danger',
          message: t('timeline.sendPostFailed')
        });
        setState('input');
      }
    );
  }, [text, props.onPost]);

  return (
    <Container
      id="timeline-post-edit-area"
      fluid
      className="fixed-bottom bg-light"
    >
      <Row>
        <Col className="px-0">
          <textarea
            className="w-100 h-100"
            value={text}
            disabled={state === 'process'}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setText(event.currentTarget.value);
            }}
          />
        </Col>
        <Col sm="col-auto align-self-end m-1">
          {(() => {
            if (state === 'input') {
              return (
                <>
                  <i className="fas fa-image d-block text-center large-icon mt-1 mb-2" />
                  <Button color="primary" onClick={onSend}>
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

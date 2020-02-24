import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';

export type TimelinePostSendCallback = (content: string) => Promise<void>;

export interface TimelinePostEditProps {
  className?: string;
  onPost: TimelinePostSendCallback;
  onHeightChange?: (height: number) => void;
}

const TimelinePostEdit: React.FC<TimelinePostEditProps> = props => {
  const { t } = useTranslation();

  const [state, setState] = useState<'input' | 'process'>('input');
  const [text, setText] = useState<string>('');

  useEffect(() => {
    if (props.onHeightChange) {
      props.onHeightChange(
        document.getElementById('timeline-post-edit-area')!.clientHeight
      );
    }
  });

  return (
    <Container
      fluid
      id="timeline-post-edit-area"
      className="fixed-bottom bg-light"
    >
      <Row>
        <textarea
          className="col"
          value={text}
          disabled={state === 'process'}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setText(event.currentTarget.value);
          }}
        />
        <Col sm="col-auto align-self-end m-1">
          {(() => {
            if (state === 'input') {
              return (
                <Button
                  color="primary"
                  onClick={() => {
                    setState('process');
                    props.onPost(text).then(
                      _ => {
                        setText('');
                        setState('input');
                      },
                      e => {
                        // TODO: Do something
                        setState('input');
                      }
                    );
                  }}
                >
                  {t('timeline.send')}
                </Button>
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

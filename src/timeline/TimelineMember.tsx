import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { User } from '../data/user';

import SearchInput from '../common/SearchInput';
import {
  Container,
  ListGroup,
  ListGroupItem,
  Modal,
  Row,
  Col,
  Button
} from 'reactstrap';

export interface TimelineMemberCallbacks {
  onCheckUser: (username: string) => Promise<User | null>;
  onAddUser: (user: User) => Promise<void>;
  onRemoveUser: (username: string) => void;
}

export interface TimelineMemberProps {
  members: User[];
  edit: TimelineMemberCallbacks | null | undefined;
}

const TimelineMember: React.FC<TimelineMemberProps> = props => {
  const { t } = useTranslation();

  const [userSearchText, setUserSearchText] = useState<string>('');
  const [userSearchState, setUserSearchState] = useState<
    | {
        type: 'user';
        data: User;
      }
    | { type: 'error'; data: string }
    | { type: 'loading' }
    | { type: 'init' }
  >({ type: 'init' });

  const members = props.members;

  return (
    <Container className="px-4">
      <ListGroup className="row my-3">
        {members.map((member, index) => (
          <ListGroupItem key={member.username} className="container">
            <Row>
              <Col className="col-auto">
                <img src={member._links.avatar} className="avatar" />
              </Col>
              <Col>
                <Row>{member.nickname}</Row>
                <Row>{'@' + member.username}</Row>
              </Col>
              {(() => {
                if (index === 0) {
                  return null;
                }
                const onRemove = props.edit?.onRemoveUser;
                if (onRemove == null) {
                  return null;
                }
                return (
                  <Button
                    className="align-self-center"
                    color="danger"
                    onClick={() => {
                      onRemove(member.username);
                    }}
                  >
                    Remove
                  </Button>
                );
              })()}
            </Row>
          </ListGroupItem>
        ))}
      </ListGroup>
      {(() => {
        const edit = props.edit;
        if (edit != null) {
          return (
            <Row>
              <SearchInput
                value={userSearchText}
                onChange={v => {
                  setUserSearchText(v);
                }}
                loading={userSearchState.type === 'loading'}
                onButtonClick={() => {
                  setUserSearchState({ type: 'loading' });
                  edit.onCheckUser(userSearchText).then(
                    u => {
                      if (u == null) {
                        setUserSearchState({
                          type: 'error',
                          data: 'timeline.userNotExist'
                        });
                      } else {
                        setUserSearchState({ type: 'user', data: u });
                      }
                    },
                    e => {
                      setUserSearchState({
                        type: 'error',
                        data: e.toString()
                      });
                    }
                  );
                }}
              />
              {(() => {
                if (userSearchState.type === 'user') {
                  const u = userSearchState.data;
                  const addable =
                    members.findIndex(m => m.username === u.username) === -1;
                  return (
                    <Container>
                      {!addable ? (
                        <p className="row">
                          {t('timeline.member.alreadyMember')}
                        </p>
                      ) : null}
                      <Row>
                        <Col className="col-auto">
                          <img src={u._links.avatar} className="avatar" />
                        </Col>
                        <Col>
                          <Row>{u.nickname}</Row>
                          <Row>{'@' + u.username}</Row>
                        </Col>
                        <Button
                          color="primary"
                          className="align-self-center"
                          disabled={!addable}
                          onClick={() => {
                            edit.onAddUser(u).then(_ => {
                              setUserSearchText('');
                              setUserSearchState({ type: 'init' });
                            });
                          }}
                        >
                          Add
                        </Button>
                      </Row>
                    </Container>
                  );
                } else if (userSearchState.type === 'error') {
                  return <p color="error">{t(userSearchState.data)}</p>;
                }
              })()}
            </Row>
          );
        } else {
          return null;
        }
      })()}
    </Container>
  );
};

export default TimelineMember;

export interface TimelineMemberDialogProps extends TimelineMemberProps {
  open: boolean;
  onClose: () => void;
}

export const TimelineMemberDialog: React.FC<TimelineMemberDialogProps> = props => {
  return (
    <Modal isOpen={props.open} toggle={props.onClose}>
      <TimelineMember {...props} />
    </Modal>
  );
};

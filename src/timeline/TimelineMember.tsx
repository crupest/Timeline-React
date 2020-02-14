import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { User } from '../data/user';

import SearchInput from '../common/SearchInput';
import { Container, ListGroup, ListGroupItem, Modal } from 'reactstrap';

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
    <Container>
      <ListGroup>
        {members.map((member, index) => (
          <ListGroupItem key={member.username}>
            <img src={member._links.avatar} />
            <p>{member.nickname}</p>
            <p>{'@' + member.username}</p>
            {(() => {
              if (index === 0) {
                return null;
              }
              const onRemove = props.edit?.onRemoveUser;
              if (onRemove == null) {
                return null;
              }
              return (
                <i
                  className="fas fa-minus"
                  onClick={() => {
                    onRemove(member.username);
                  }}
                />
              );
            })()}
          </ListGroupItem>
        ))}
      </ListGroup>
      {(() => {
        const edit = props.edit;
        if (edit != null) {
          return (
            <>
              <div>
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
                      <>
                        {!addable ? (
                          <p>{t('timeline.member.alreadyMember')}</p>
                        ) : null}
                        <Container>
                          <img src={u._links.avatar} />
                          <p>{u.nickname}</p>
                          <p>{'@' + u.username}</p>
                          <i
                            disabled={!addable}
                            onClick={() => {
                              edit.onAddUser(u).then(_ => {
                                setUserSearchText('');
                                setUserSearchState({ type: 'init' });
                              });
                            }}
                            color="primary"
                          />
                        </Container>
                      </>
                    );
                  } else if (userSearchState.type === 'error') {
                    return <p color="error">{t(userSearchState.data)}</p>;
                  }
                })()}
              </div>
            </>
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

import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Row, Container, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import AppBar from '../common/AppBar';
import SearchInput from '../common/SearchInput';
import { useUser } from '../data/user';
import TimelineBoardAreaWithoutUser from './TimelineBoardAreaWithoutUser';
import { apiBaseUrl } from '../config';
import { TimelineInfo } from '../data/timeline';
import TimelineBoardAreaWithUser from './TimelineBoardAreaWithUser';
import TimelineCreateDialog from './TimelineCreateDialog';

const Home: React.FC = _ => {
  const history = useHistory();

  const { t } = useTranslation();

  const user = useUser();

  const [navText, setNavText] = useState<string>('');

  const [dialog, setDialog] = React.useState<'create' | null>(null);

  const goto = (): void => {
    if (navText === '') {
      history.push('users/crupest');
    } else if (navText.startsWith('@')) {
      history.push(`users/${navText.slice(1)}`);
    } else {
      history.push(`timelines/${navText}`);
    }
  };

  return (
    <>
      <AppBar />
      <Container fluid style={{ marginTop: '56px' }}>
        {(() => {
          if (user != null) {
            return (
              <>
                <Row className="my-2 px-3 justify-content-end">
                  <Button
                    color="success"
                    outline
                    onClick={() => setDialog('create')}
                  >
                    Create Timeline
                  </Button>
                </Row>
                {dialog === 'create' && (
                  <TimelineCreateDialog open close={() => setDialog(null)} />
                )}
              </>
            );
          }
        })()}
        <Row className="justify-content-center">
          <SearchInput
            value={navText}
            onChange={v => {
              setNavText(v);
            }}
            onButtonClick={goto}
            buttonText={t('home.go')}
            placeholder="@crupest"
          />
        </Row>
        {(() => {
          if (user == null) {
            return (
              <TimelineBoardAreaWithoutUser
                fetch={() =>
                  axios
                    .get<TimelineInfo[]>(
                      `${apiBaseUrl}/timelines?visibility=public`
                    )
                    .then(res => res.data)
                }
              />
            );
          } else {
            return (
              <TimelineBoardAreaWithUser
                fetchOwn={() =>
                  axios
                    .get<TimelineInfo[]>(
                      `${apiBaseUrl}/timelines?relate=${user.username}&relateType=own`
                    )
                    .then(res => res.data)
                }
                fetchJoin={() =>
                  axios
                    .get<TimelineInfo[]>(
                      `${apiBaseUrl}/timelines?relate=${user.username}&relateType=join`
                    )
                    .then(res => res.data)
                }
              />
            );
          }
        })()}
      </Container>
    </>
  );
};

export default Home;

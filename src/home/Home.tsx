import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Row, Container } from 'reactstrap';
import axios from 'axios';

import AppBar from '../common/AppBar';
import SearchInput from '../common/SearchInput';
import { useUser } from '../data/user';
import TimelineBoardAreaWithoutUser from './TimelineBoardAreaWithoutUser';
import { apiBaseUrl } from '../config';
import { TimelineInfo } from '../data/timeline';
import TimelineBoardAreaWithUser from './TimelineBoardAreaWithUser';

const Home: React.FC = _ => {
  const history = useHistory();

  const user = useUser();

  const [navText, setNavText] = useState<string>('');

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
        <Row className="justify-content-center">
          <SearchInput
            value={navText}
            onChange={v => {
              setNavText(v);
            }}
            onButtonClick={goto}
          />
        </Row>
        {(() => {
          if (user == null) {
            return (
              <TimelineBoardAreaWithoutUser
                fetch={() =>
                  axios
                    .get<TimelineInfo[]>(`${apiBaseUrl}/timelines`)
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

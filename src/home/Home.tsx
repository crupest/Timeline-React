import React from 'react';
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

  const [navText, setNavText] = React.useState<string>('');

  const [publicTimelines, setPublicTimelines] = React.useState<
    TimelineInfo[] | undefined
  >(undefined);
  const [ownTimelines, setOwnTimelines] = React.useState<
    TimelineInfo[] | undefined
  >(undefined);
  const [joinTimelines, setJoinTimelines] = React.useState<
    TimelineInfo[] | undefined
  >(undefined);

  React.useEffect(() => {
    let subscribe = true;
    if (user == null) {
      setOwnTimelines(undefined);
      setJoinTimelines(undefined);
      axios
        .get<TimelineInfo[]>(`${apiBaseUrl}/timelines?visibility=public`)
        .then(res => {
          if (subscribe) {
            setPublicTimelines(res.data);
          }
        });
    } else {
      setPublicTimelines(undefined);
      axios
        .get<TimelineInfo[]>(
          `${apiBaseUrl}/timelines?relate=${user.username}&relateType=own`
        )
        .then(res => {
          if (subscribe) {
            setOwnTimelines(res.data);
          }
        });
      axios
        .get<TimelineInfo[]>(
          `${apiBaseUrl}/timelines?relate=${user.username}&relateType=join`
        )
        .then(res => {
          if (subscribe) {
            setJoinTimelines(res.data);
          }
        });
    }
    return () => {
      subscribe = false;
    };
  }, [user]);

  const [dialog, setDialog] = React.useState<'create' | null>(null);

  const goto = React.useCallback((): void => {
    if (navText === '') {
      history.push('users/crupest');
    } else if (navText.startsWith('@')) {
      history.push(`users/${navText.slice(1)}`);
    } else {
      history.push(`timelines/${navText}`);
    }
  }, [navText, history]);

  const openCreateDialog = React.useCallback(() => {
    setDialog('create');
  }, []);

  const closeDialog = React.useCallback(() => {
    setDialog(null);
  }, []);

  return (
    <>
      <AppBar />
      <Container fluid style={{ marginTop: '56px' }}>
        {(() => {
          if (user != null) {
            return (
              <>
                <Row className="my-2 px-3 justify-content-end">
                  <Button color="success" outline onClick={openCreateDialog}>
                    {t('home.createButton')}
                  </Button>
                </Row>
                {dialog === 'create' && (
                  <TimelineCreateDialog open close={closeDialog} />
                )}
              </>
            );
          }
        })()}
        <Row className="justify-content-center">
          <SearchInput
            value={navText}
            onChange={setNavText}
            onButtonClick={goto}
            buttonText={t('home.go')}
            placeholder="@crupest"
          />
        </Row>
        {(() => {
          if (user == null) {
            return (
              <TimelineBoardAreaWithoutUser publicTimelines={publicTimelines} />
            );
          } else {
            return (
              <TimelineBoardAreaWithUser
                ownTimelines={ownTimelines}
                joinTimelines={joinTimelines}
              />
            );
          }
        })()}
      </Container>
    </>
  );
};

export default Home;

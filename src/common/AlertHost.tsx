import React, { useCallback } from 'react';
import { Alert } from 'reactstrap';
import without from 'lodash/without';
import concat from 'lodash/concat';

import {
  alertService,
  AlertInfoEx,
  kAlertHostId,
  AlertInfo,
} from './alert-service';

interface AutoCloseAlertProps {
  alert: AlertInfo;
  close: () => void;
}

export const AutoCloseAlert: React.FC<AutoCloseAlertProps> = (props) => {
  const { alert } = props;

  React.useEffect(() => {
    const tag = window.setTimeout(props.close, 5000);
    return () => window.clearTimeout(tag);
  }, [props.close]);

  return (
    <Alert className="m-3" color={alert.type ?? 'primary'} toggle={props.close}>
      {alert.message}
    </Alert>
  );
};

// oh what a bad name!
interface AlertInfoExEx extends AlertInfoEx {
  close: () => void;
}

export const AlertHost: React.FC = () => {
  const [alerts, setAlerts] = React.useState<AlertInfoExEx[]>([]);

  // react guarantee that state setters are stable, so we don't need to add it to dependency list

  const consume = useCallback((alert: AlertInfoEx): void => {
    const alertEx: AlertInfoExEx = {
      ...alert,
      close: () => {
        setAlerts((oldAlerts) => {
          return without(oldAlerts, alertEx);
        });
      },
    };
    setAlerts((oldAlerts) => {
      return concat(oldAlerts, alertEx);
    });
  }, []);

  React.useEffect(() => {
    alertService.registerConsumer(consume);
    return () => {
      alertService.unregisterConsumer(consume);
    };
  }, [consume]);

  return (
    <div id={kAlertHostId} className="alert-container">
      {alerts.map((alert) => {
        return (
          <AutoCloseAlert key={alert.id} alert={alert} close={alert.close} />
        );
      })}
    </div>
  );
};

export default AlertHost;

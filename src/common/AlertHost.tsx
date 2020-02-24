import React from 'react';
import { Alert } from 'reactstrap';

import {
  alertService,
  AlertConsumer,
  AlertInfoEx,
  kAlertHostId
} from './alert-service';

export const AlertHost: React.FC = () => {
  const [alerts, setAlerts] = React.useState<AlertInfoEx[]>([]);

  const consumer: AlertConsumer = (alerts): void => {
    setAlerts(alerts);
  };

  React.useEffect(() => {
    alertService.registerConsumer(consumer);
    return () => {
      alertService.unregisterConsumer(consumer);
    };
  });

  return (
    <div id={kAlertHostId} className="alert-container">
      {alerts.map(alert => {
        return (
          <Alert
            key={alert.id}
            className="m-3"
            color={alert.type ?? 'primary'}
            toggle={alert.close.bind(alert)}
          >
            {alert.message}
          </Alert>
        );
      })}
    </div>
  );
};

export default AlertHost;

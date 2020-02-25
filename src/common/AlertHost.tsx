import React from 'react';
import { Alert } from 'reactstrap';

import { alertService, AlertInfoEx, kAlertHostId } from './alert-service';

export const AlertHost: React.FC = () => {
  const [alerts, setAlerts] = React.useState<AlertInfoEx[]>([]);

  React.useEffect(() => {
    alertService.registerConsumer(setAlerts);
    return () => {
      alertService.unregisterConsumer(setAlerts);
    };
  }, []); // react guarantee that state setters are stable, so we don't need to add it to dependency list

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

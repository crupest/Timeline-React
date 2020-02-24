import without from 'lodash/without';
import pull from 'lodash/pull';
import concat from 'lodash/concat';

export interface AlertInfo {
  type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  message: string;
}

export interface AlertInfoEx extends AlertInfo {
  id: number;
  timeoutTag?: number;
  close(): void;
}

export type AlertConsumer = (alerts: AlertInfoEx[]) => void;

export class AlertService {
  readonly alertTimeout = 5000;
  private consumers: AlertConsumer[] = [];
  private alerts: ReadonlyArray<AlertInfoEx> = [];
  private currentId = 1;

  private produce(alerts: AlertInfoEx[]): void {
    this.alerts = alerts;
    for (const consumer of this.consumers) {
      consumer(alerts);
    }
  }

  registerConsumer(consumer: AlertConsumer): void {
    this.consumers.push(consumer);
    consumer(this.alerts as AlertInfoEx[]);
  }

  unregisterConsumer(consumer: AlertConsumer): void {
    pull(this.consumers, consumer);
  }

  push(alert: AlertInfo): void {
    const newAlert = {
      ...alert,
      id: this.currentId++,
      timeoutTag: window.setTimeout(() => {
        newAlert.close();
      }, this.alertTimeout),
      close: (() => {
        clearTimeout(newAlert.timeoutTag);
        this.produce(without(this.alerts, newAlert));
      }).bind(this)
    };
    this.produce(concat(this.alerts, newAlert));
  }
}

export const alertService = new AlertService();

export function pushAlert(alert: AlertInfo): void {
  alertService.push(alert);
}

export const kAlertHostId = 'alert-host';

export function getAlertHost(): HTMLElement | null {
  return document.getElementById(kAlertHostId);
}

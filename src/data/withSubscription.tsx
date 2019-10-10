import React from "react";
import { Observable, Subscription } from "rxjs";
import { getDisplayName } from "../tools";

export function withSubscription<TBindResult, TValue, P extends TBindResult>(
  observable: Observable<TValue>,
  bind: (value: TValue) => TBindResult,
  defaultValue: TBindResult,
  c: React.ComponentType<P>
): React.ComponentClass<Omit<P, keyof TBindResult>> {
  const Component = c as any; // close fucking fucking fucking type check

  type Props = Omit<P, keyof TBindResult>;

  class withSubscription extends React.Component<Props, TBindResult> {
    static displayName = `WithSubscription(${getDisplayName(c)})`;

    state = defaultValue;

    private subscription?: Subscription;

    constructor(props: Props) {
      super(props);
    }

    componentDidMount() {
      this.subscription = observable.subscribe(value => {
        this.setState(bind(value));
      });
    }

    componentWillUnmount() {
      const s = this.subscription;
      if (s) s.unsubscribe();
    }

    render(): React.ReactNode {
      return <Component {...this.props} {...this.state} />;
    }
  }

  return withSubscription;
}

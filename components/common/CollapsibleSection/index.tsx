import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";

import * as styles from "./index.css";

interface Props {
  title: string | JSX.Element;
  count?: number | string;
  children?: JSX.Element;
  className?: string;
  isInitiallyCollapsed?: boolean;
}

class Store {
  @observable public isCollapsed: boolean;

  private props: Props;

  constructor(props: Props) {
    this.props = props;
    this.isCollapsed = this.props.isInitiallyCollapsed!;
  }

  @action
  public toggleSection() {
    this.isCollapsed = !this.isCollapsed;
  }
}

@observer
export class CollapsibleSection extends React.Component<Props> {
  private store: Store;

  public static defaultProps: Partial<Props> = {
    isInitiallyCollapsed: true,
  };

  constructor(props: Props) {
    super(props);
    this.store = new Store(props);
  }

  public render() {
    return (
      <div className={[styles.collapsibleSection, this.props.className].join(" ")}>
        <div
          className={[
            styles.titleBar,
            this.store.isCollapsed ? styles.isCollapsed : undefined,
          ].join(" ")}
          onClick={() => this.store.toggleSection()}
        >
          <span className={styles.title}>{this.props.title}</span>
          {this.renderCount()}
        </div>

        {this.renderContent()}
      </div>
    );
  }

  private renderCount() {
    if (this.props.count === undefined) {
      return;
    }

    return <span className={styles.count}>{this.props.count}</span>;
  }

  private renderContent() {
    if (this.store.isCollapsed) {
      return;
    }

    return <div className={styles.content}>{this.props.children}</div>;
  }
}

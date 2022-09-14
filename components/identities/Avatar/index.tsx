import * as React from "react";

import {Identity} from "models";

import * as styles from "./index.css";

interface Props {
  identity: Identity;
  className?: string;
}

// TODO: construct Avatar from identities.provider/identites.uid pair
export class Avatar extends React.PureComponent<Props> {
  public render() {
    const {identity, className} = this.props;
    const initials = `${identity.firstName[0]}${identity.lastName[0]}`;

    return <div className={[styles.avatar, className].join(" ")}>{initials}</div>;
  }
}

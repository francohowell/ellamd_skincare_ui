import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import {Context} from "entries/server";
import {ErrorMessage} from "utilities";

interface Props extends RouteComponentProps<any> {
  staticContext?: Context;
}

export class ServerErrorMessage extends React.Component<Props, {}> {
  public componentWillMount() {
    if (this.props.staticContext) {
      this.props.staticContext.statusCode = 500;
    }
  }

  public render() {
    return (
      <ErrorMessage
        pageTitle="server error"
        status="500"
        heading="There’s been a server error"
        description="The EllaMD team is working on it. In the meantime, you can return to the homepage."
      />
    );
  }
}

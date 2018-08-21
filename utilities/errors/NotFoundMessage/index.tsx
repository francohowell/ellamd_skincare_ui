import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import {Context} from "entries/server";
import {ErrorMessage} from "utilities";

interface Props extends RouteComponentProps<any> {
  staticContext?: Context;
}

export class NotFoundMessage extends React.Component<Props, {}> {
  public componentWillMount() {
    if (this.props.staticContext) {
      this.props.staticContext.statusCode = 404;
    }
  }

  public render() {
    return (
      <ErrorMessage
        pageTitle="page not found"
        status="404"
        heading="That page wasn’t found"
        description="Double-check the address entered, or return to the homepage."
      />
    );
  }
}

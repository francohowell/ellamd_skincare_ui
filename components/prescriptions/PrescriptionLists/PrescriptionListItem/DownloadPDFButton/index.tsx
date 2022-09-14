import {inject, observer} from "mobx-react";
import * as React from "react";

import {AnchorButton, Intent} from "@blueprintjs/core";
import {Toaster} from "utilities";

import {Prescription} from "models";
import {CustomerStore} from "stores";

const FETCH_DELAY_IN_SECONDS = 5;

interface Props {
  prescription: Prescription;
  customerStore?: CustomerStore;
}
interface State {
  isLoading: boolean;
  token?: string;
}

@inject("customerStore")
@observer
export class DownloadPDFButton extends React.Component<Props, {}> {
  public state: State = {
    isLoading: false
  };

  private handleDownload = async () => {
    this.setState({isLoading: true});

    const {prescription} = this.props;

    try {
      const token = await this.props.customerStore!.fetchOneTimeToken(prescription);

      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          Toaster.show({
            message: "Prescription downloaded.",
            intent: Intent.SUCCESS,
            iconName: "cloud-download",
          });

          this.props.customerStore!.fetchCustomers();
        }, FETCH_DELAY_IN_SECONDS * 1000);

        window.location.href = this.buildDownloadUrl(token);
      }
    } catch (e) {
      console.error(e);

      Toaster.show({
        message: e.message,
        intent: Intent.DANGER,
        iconName: "cloud-download",
      });
    } finally {
      this.setState({isLoading: false});
    }
  }

  private buildDownloadUrl(oneTimeToken: string) {
    return `${this.props.prescription.pdfUrl}?action_token=${oneTimeToken}`;
  }

  public render() {
    const {prescription} = this.props;
    const {isLoading} = this.state;

    return (
      <AnchorButton
        disabled={isLoading}
        className={
          !prescription.fulfilledAt ? "pt-intent-primary" : "pt-minimal pt-intent-primary"
        }
        onClick={this.handleDownload}
      >
        Download PDF
      </AnchorButton>
    );
  }
}

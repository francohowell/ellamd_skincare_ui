import {Button, Dialog, Intent, ProgressBar} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";

import {FadeTransitionGroup} from "components/common";
import {PhotosField} from "components/customers";
import {Customer} from "models";
import {CustomerStore} from "stores";
import {SubmitEvent, Toaster, uploadPhotos, UploadResponse} from "utilities";

import * as styles from "./index.css";

interface Props {
  customer: Customer;
  className?: string;
  customerStore?: CustomerStore;
}
interface State {
  isOpen: boolean;
  hasError: boolean;
  errorMessage?: string;
  isLoading: boolean;
  files: File[];
  uploadProgress?: number;
}

@inject("customerStore")
@observer
export class CreatePhotoForm extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    hasError: false,
    errorMessage: undefined,
    isLoading: false,
    files: [],
  };

  private toggleForm = () => {
    this.setState({isOpen: !this.state.isOpen});
  };

  private handleSubmitProgress = (uploadProgress?: number) => {
    if (uploadProgress) this.setState({uploadProgress});
  };

  private handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const customerId = this.props.customer.id;

    const formData = new FormData();
    this.state.files.forEach(file => {
      formData.append("images[]", file);
    });

    this.setState({isLoading: true, hasError: false});

    const upload = uploadPhotos(`customers/${customerId}/photos/create`, formData);

    upload.onProgress(this.handleSubmitProgress);

    try {
      const {photos} = (await upload.start()) as UploadResponse;

      this.props.customer.addPhotos(photos);

      Toaster.show({message: "Photos updated!", intent: Intent.SUCCESS, iconName: "tick"});

      this.setState({
        isLoading: false,
        isOpen: false,
        files: [],
        uploadProgress: undefined,
      });
    } catch (err) {
      this.setState({
        isLoading: false,
        hasError: true,
        errorMessage: "An error ocurred trying to upload images. Please try again later",
      });
    }
  };

  private handleFilesChange = (files: File[]) => {
    this.setState({files});
  };

  private renderError() {
    if (!this.state.hasError) {
      return;
    }

    return (
      <div className={styles.errorWrapper}>
        <div className="pt-callout pt-intent-danger">{this.state.errorMessage}</div>
      </div>
    );
  }

  private renderActions() {
    if (this.state.files.length > 0) {
      return (
        <div className="pt-dialog-footer-actions">
          <Button onClick={this.toggleForm}>Cancel</Button>
          <Button
            onClick={this.handleSubmit}
            loading={this.state.isLoading}
            className="pt-intent-primary"
            type="submit"
          >
            Add photos
          </Button>
        </div>
      );
    } else {
      return (
        <div className="pt-dialog-footer-actions">
          <Button onClick={this.toggleForm} className="pt-intent-primary">
            Done
          </Button>
        </div>
      );
    }
  }

  private renderProgressBar() {
    if (!this.state.uploadProgress) return;

    const value = this.state.uploadProgress;

    return <ProgressBar value={value} />;
  }

  private renderForm() {
    return (
      <Dialog isOpen={this.state.isOpen} onClose={this.toggleForm} title="Add photos">
        <form onSubmit={this.handleSubmit}>
          <div className="pt-dialog-body">
            <PhotosField
              customer={this.props.customer}
              files={this.state.files}
              onChange={this.handleFilesChange}
            />

            <FadeTransitionGroup>{this.renderError()}</FadeTransitionGroup>

            {this.renderProgressBar()}
          </div>
          <div className="pt-dialog-footer">{this.renderActions()}</div>
        </form>
      </Dialog>
    );
  }

  public render() {
    return (
      <div className={[styles.wrapper, this.props.className].join(" ")}>
        <Button className="pt-large" iconName="camera" onClick={this.toggleForm}>
          Add new photos
        </Button>

        {this.renderForm()}
      </div>
    );
  }
}

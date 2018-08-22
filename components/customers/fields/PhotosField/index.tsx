import {observer} from "mobx-react";
import * as React from "react";
import Dropzone from "react-dropzone";

import {SetPhoneField} from "components/customers";
import {Customer, Photo} from "models";
import {Method, request, Status} from "utilities";

import * as styles from "./index.css";

const POLL_INTERVAL_IN_MS = 5000;

interface Props {
  customer: Customer;
  files: File[];
  onChange: (newFiles: File[]) => void;
}
interface State {
  mountedAt?: number;
  existingPhotos: Photo[];
}

@observer
export class PhotosField extends React.Component<Props, State> {
  public state: State = {
    existingPhotos: [],
  };

  private timeoutId: NodeJS.Timer | number | undefined;

  public componentDidMount() {
    this.setState({mountedAt: Math.round(new Date().getTime() / 1000)});
    this.queueFetchExistingPhotos();
  }

  public componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId as any);
    }
  }

  private queueFetchExistingPhotos() {
    this.timeoutId = setTimeout(this.fetchExistingPhotos, POLL_INTERVAL_IN_MS);
  }

  private fetchExistingPhotos = async () => {
    const response = await request(`customers/${this.props.customer.id}/photos`, Method.POST, {
      createdAfter: this.state.mountedAt,
    });

    if (response.status === Status.Success) {
      const {photos} = response.data! as {photos: Photo[]};
      this.setState({existingPhotos: photos});
    }

    this.queueFetchExistingPhotos();
  };

  private handleDrop = (files: File[]) => {
    this.props.onChange(this.props.files.concat(files));
  };

  public render() {
    return (
      <div className={styles.photoForm}>
        <p>
          A good set of front/left/right pictures of your face are REQUIRED for your treatment and
          personalized EllaMD cream.<br />
          Don't be shy, they'll only be seen by your dermatologist.
        </p>

        <div className={[styles.columns, styles.suggestions].join(" ")}>
          <div className={styles.suggestion}>
            <img src={require("assets/images/photos/closeUp.svg")} />
            Close up
          </div>

          <div className={styles.suggestion}>
            <img src={require("assets/images/photos/noMakeUp.svg")} />
            No makeup
          </div>

          <div className={styles.suggestion}>
            <img src={require("assets/images/photos/naturalLight.svg")} />
            Good lighting
          </div>
        </div>

        <hr />

        <div className={[styles.columns, styles.examples].join(" ")}>
          <div>
            <h3>Examples: bad</h3>

            <a
              target="_blank"
              href={require("assets/images/photos/examples/bad_left.jpg")}
              className="pt-card pt-elevation-1 pt-interactive"
            >
              <img src={require("assets/images/photos/examples/bad_left.jpg")} />
            </a>

            <a
              target="_blank"
              href={require("assets/images/photos/examples/bad_front.jpg")}
              className="pt-card pt-elevation-1 pt-interactive"
            >
              <img src={require("assets/images/photos/examples/bad_front.jpg")} />
            </a>

            <a
              target="_blank"
              href={require("assets/images/photos/examples/bad_right.jpg")}
              className="pt-card pt-elevation-1 pt-interactive"
            >
              <img src={require("assets/images/photos/examples/bad_right.jpg")} />
            </a>
          </div>

          <div>
            <h3>Examples: good</h3>

            <a
              target="_blank"
              href={require("assets/images/photos/examples/good_left.jpg")}
              className="pt-card pt-elevation-1 pt-interactive"
            >
              <img src={require("assets/images/photos/examples/good_left.jpg")} />
            </a>

            <a
              target="_blank"
              href={require("assets/images/photos/examples/good_front.jpg")}
              className="pt-card pt-elevation-1 pt-interactive"
            >
              <img src={require("assets/images/photos/examples/good_front.jpg")} />
            </a>

            <a
              target="_blank"
              href={require("assets/images/photos/examples/good_right.jpg")}
              className="pt-card pt-elevation-1 pt-interactive"
            >
              <img src={require("assets/images/photos/examples/good_right.jpg")} />
            </a>
          </div>
        </div>

        <hr />

        <p>Please upload three photos of your face: front, left, and right.</p>

        <div className={styles.columns}>
          <div>
            <h3>Upload photos</h3>

            <Dropzone accept="image/*" className={styles.dropZone} onDrop={this.handleDrop}>
              Drop one or more photos here, or{" "}
              <a className="pt-button pt-intent-primary">click to select</a>
            </Dropzone>
          </div>

          <div className={styles.or}>
            <span>or</span>
          </div>

          <div>
            <h3>Text in photos</h3>
            <p>Reply to our text with photos. It's super easy!</p>
            <SetPhoneField customer={this.props.customer} />
            <p className={styles.labelDescription}>
              <strong>Don’t worry</strong> — we will ONLY use your phone number for uploading
              photos.
            </p>
          </div>
        </div>

        {this.state.existingPhotos.map((photo, index) => (
          <div key={index} className={["pt-card", styles.photo].join(" ")}>
            <img src={photo.thumbnailUrl} />
          </div>
        ))}

        {this.props.files.map((file, index) => (
          <div key={index} className={["pt-card", styles.photo].join(" ")}>
            <img src={(file as any).preview} />
          </div>
        ))}
      </div>
    );
  }
}

import {observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";

import {CreatePhotoForm} from "components/photos";
import {Customer, Photo} from "models";

import * as styles from "./index.css";

interface Props {
  customer: Customer;
  canCreate?: boolean;
  className?: string;
}
interface State {}

@observer
export class PhotosSection extends React.Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    canCreate: true,
  };

  private renderPhoto(photo: Photo) {
    return (
      <a
        className={["pt-card", "pt-interactive", styles.photo].join(" ")}
        key={photo.id}
        href={photo.largeUrl}
        target="_blank"
      >
        <img src={photo.thumbnailUrl} />

        <span className={styles.date}>{moment(photo.createdAt).format("M/D/YYYY")}</span>
      </a>
    );
  }

  public render() {
    const {customer} = this.props;

    return (
      <section className={[this.props.className, styles.photosSection].join(" ")}>
        {this.props.canCreate ? (
          <CreatePhotoForm className={styles.actions} customer={this.props.customer} />
        ) : (
          undefined
        )}

        <h3>Photos</h3>

        <div className={styles.photos}>
          {customer.photos.length === 0
            ? "Customer has no photos."
            : customer.photos.filter(photo => !photo.visitId).map(photo => this.renderPhoto(photo))}
        </div>
      </section>
    );
  }
}

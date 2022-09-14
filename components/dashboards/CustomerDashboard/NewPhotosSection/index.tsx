import {observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";

import {CreatePhotoForm} from "components/photos";
import {Customer, Photo} from "models";
import {flatMap} from "utilities";

import * as styles from "./index.css";

interface Props {
  customer: Customer;
  className?: string;
}
interface State {}

@observer
export class NewPhotosSection extends React.Component<Props, State> {
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

  private renderNewPhotos() {
    const {customer} = this.props;

    let newPhotos;

    if (customer.visits.length > 0) {
      newPhotos = customer.photos.filter(
        newPhoto =>
          !flatMap(customer.visits, visit => visit.photos.map(photo => photo.id)).includes(
            newPhoto.id
          )
      );
    } else {
      newPhotos = customer.photos;
    }

    if (newPhotos.length === 0) {
      return <p>You haven’t uploaded any photos since your last formulation.</p>;
    }

    return (
      <div className={styles.photos}>
        <div>{customer.photos.map(photo => this.renderPhoto(photo))}</div>
      </div>
    );
  }

  public render() {
    return (
      <div className={this.props.className}>
        <CreatePhotoForm customer={this.props.customer} className={styles.button} />

        <h2>Show us some skin</h2>

        {this.renderNewPhotos()}
      </div>
    );
  }
}

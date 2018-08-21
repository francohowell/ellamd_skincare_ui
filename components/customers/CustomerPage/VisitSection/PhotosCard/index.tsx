import * as React from "react";

import {Photo} from "models";

import * as styles from "./index.css";

interface Props {
  photos: Photo[];
}
interface State {}

export class PhotosCard extends React.Component<Props, State> {
  public render() {
    const {photos} = this.props;

    return (
      <div className={styles.photos}>
        {photos.map(photo => (
          <div className={[styles.photo, "pt-card", "pt-elevation-1"].join(" ")} key={photo.id}>
            <div className={styles.photoColumn}>
              <div className={styles.photoContainer}>
                <img src={photo.mediumUrl} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

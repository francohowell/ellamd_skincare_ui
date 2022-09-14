import {observer} from "mobx-react";
import * as React from "react";

import {Photo, PhotoGroup} from "models";

import * as styles from "./index.css";

interface Props {
  photoGroup: PhotoGroup;
}

@observer
export class PhotoGroupStoryItem extends React.Component<Props> {
  public render() {
    const {photos} = this.props.photoGroup;

    return (
      <div>
        <h1>
          You added {photos.length} photo{photos.length === 1 ? "" : "s"}.
        </h1>
        <div className={styles.photoGroup}>
          {photos.map((photo, index) => this.renderPhoto(photo, index))}
        </div>
      </div>
    );
  }

  private renderPhoto(photo: Photo, index: number) {
    return (
      <div key={index} className={styles.photo}>
        <img src={photo.mediumUrl} />
      </div>
    );
  }
}

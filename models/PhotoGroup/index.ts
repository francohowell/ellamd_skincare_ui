import {action, computed, observable} from "mobx";
import * as moment from "moment";

import {Photo} from "models";

const HOURS_INTERVAL = 24;

export class PhotoGroup {
  @observable public photos: Photo[];

  private referentialPhoto: Photo;

  constructor(photo: Photo) {
    this.referentialPhoto = photo;
    this.photos = [photo];
  }

  @computed
  get at(): moment.Moment {
    return this.referentialPhoto.createdAt;
  }

  @action
  public addPhoto(photo: Photo): boolean {
    if (!this.canConsumePhoto(photo)) {
      return false;
    }

    this.photos.push(photo);
    return true;
  }

  private canConsumePhoto(photo: Photo): boolean {
    return this.isInAcceptableInterval(photo);
  }

  private isInAcceptableInterval(photo: Photo): boolean {
    return this.hoursSinceReferentialPhoto(photo) < HOURS_INTERVAL;
  }

  private hoursSinceReferentialPhoto(photo: Photo): number {
    const photoAt = photo.createdAt;
    const referentialPhotoAt = this.referentialPhoto.createdAt;
    const timeBetweenPhotos = Math.abs(photoAt.diff(referentialPhotoAt));

    return moment.duration(timeBetweenPhotos).asHours();
  }
}

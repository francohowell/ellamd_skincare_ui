import {Photo, PhotoGroup} from "models";

export class PhotoGrouper {
  private photos: Photo[];

  constructor(photos: Photo[]) {
    this.photos = photos;
  }

  public toPhotoGroups(): PhotoGroup[] {
    const groups: PhotoGroup[] = [];

    if (this.photos.length === 0) {
      return groups;
    }

    let currentGroup = new PhotoGroup(this.photos[0]);

    for (let i = 1; i < this.photos.length; i++) {
      const photo = this.photos[i];
      const isSuccess = currentGroup.addPhoto(photo);

      if (!isSuccess) {
        groups.push(currentGroup);
        currentGroup = new PhotoGroup(photo);
      }
    }

    groups.push(currentGroup);

    return groups;
  }
}

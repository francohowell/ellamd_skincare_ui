import {computed} from "mobx";

import {MessageGrouper, PhotoGrouper} from "lib";
import {Customer, Story, StoryType} from "models";
import {
  MyCustomerStore,
  MyMedicalProfileAuditStore,
  MyMessageStore,
  MyPhotoStore,
} from "stores/customers";

interface Stores {
  myCustomerStore: MyCustomerStore;
  myMedicalProfileAuditStore: MyMedicalProfileAuditStore;
  myMessageStore: MyMessageStore;
  myPhotoStore: MyPhotoStore;
}

export class MyStoryStore {
  private stores: Stores;

  constructor(stores: Stores) {
    this.stores = stores;
  }

  @computed
  get isLoading(): boolean {
    return (
      this.stores.myCustomerStore.isLoading ||
      this.stores.myMedicalProfileAuditStore.isLoading ||
      this.stores.myMessageStore.isLoading ||
      this.stores.myPhotoStore.isLoading
    );
  }

  @computed
  get allOrderedStories(): Story[] {
    return this.allStories.sort((storyA, storyB) => -storyA.at.diff(storyB.at));
  }

  @computed
  get allStories(): Story[] {
    return [
      ...this.medicalProfileAuditStories,
      ...this.groupedMessageStories,
      ...this.groupedPhotoStories,
      ...this.visitStories,
    ];
  }

  // TODO: should we group this staff too?
  @computed
  get medicalProfileAuditStories(): Story[] {
    const onboardedAt = this.currentCustomer.onboardingCompletedAt;

    return this.stores.myMedicalProfileAuditStore.descendingMedicalProfileAudits
      .filter(audit => onboardedAt !== undefined && audit.createdAt.isAfter(onboardedAt))
      .map(audit => {
        return new Story({
          type: StoryType.MedicalProfileAudit,
          by: this.currentCustomer,
          at: audit.createdAt,
          object: audit,
        });
      });
  }

  @computed
  get groupedMessageStories(): Story[] {
    const messages = this.stores.myMessageStore.descendingMessages;
    const messageGroups = new MessageGrouper(messages).toMessageGroups();

    return messageGroups.map(messageGroup => {
      const by = messageGroup.fromCustomer ? this.currentCustomer : this.currentCustomer.physician;

      return new Story({
        type: StoryType.MessageGroup,
        by,
        at: messageGroup.at,
        object: messageGroup,
      });
    });
  }

  @computed
  get groupedPhotoStories(): Story[] {
    const photos = this.stores.myPhotoStore.descendingPhotos;
    const photoGroups = new PhotoGrouper(photos).toPhotoGroups();

    return photoGroups.map(photoGroup => {
      return new Story({
        type: StoryType.PhotoGroup,
        by: this.currentCustomer,
        at: photoGroup.at,
        object: photoGroup,
      });
    });
  }

  @computed
  get visitStories(): Story[] {
    const visits = this.currentCustomer.visits.filter(
      visit => !!visit.prescription || !!visit.diagnosis || !!visit.regimen
    );

    // TODO: correctly filter Visits and handle visit.updatedAt on serverside
    return visits.map(visit => {
      return new Story({
        type: StoryType.Visit,
        by: this.currentCustomer.physician,
        at: visit.updatedAt,
        object: visit,
      });
    });
  }

  @computed
  get currentCustomer(): Customer {
    return this.stores.myCustomerStore.currentCustomer;
  }
}

// activities.push({
//   date: customer.createdAt,
//   title: "Profile created",
//   description: "You created your profile.",
// });

// customer.diagnoses.forEach(diagnosis => {
//   activities.push({
//     date: diagnosis.createdAt,
//     title: "Diagnosis added",
//     description:
//       `Dr. ${customer.physician.firstName} ${customer.physician.lastName} added a ` +
//       "diagnosis to your profile.",
//   });
// });

// customer.prescriptions.forEach(prescription => {
//   activities.push({
//     date: prescription.createdAt,
//     title: "Prescription added",
//     description:
//       `Dr. ${customer.physician.firstName} ${customer.physician.lastName} added a ` +
//       "prescription to your profile.",
//   });
// });

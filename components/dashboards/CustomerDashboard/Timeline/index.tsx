import {Checkbox, Icon} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";

import {Spinner} from "components/common";
import {UpdateCustomerForm} from "components/customers";
import {MessagesDialog} from "components/messages";
import {CreatePhotoForm} from "components/photos";
import {StoryItem, StoryMeta} from "components/stories";
import {StoryType} from "models";
import {IdentityStore} from "stores";
import {MyStoryStore} from "stores/customers";
import {TimelineViewStore} from "stores/views/TimelineViewStore";

import {CallToAction} from "../CallToAction";

import * as storyStyles from "components/stories/index.css";
import * as styles from "./index.css";

interface Props {
  identityStore?: IdentityStore;
  myStoryStore?: MyStoryStore;
}

const STORY_TYPE_NAMES: {[ST: string]: string} = {
  "message-group": "Messages",
  "photo-group": "Photos",
  "medical-profile-audit": "Profile updates",
  visit: "Treatment Plans",
};

@inject("identityStore", "myStoryStore")
@observer
export class Timeline extends React.Component<Props> {
  private timelineViewStore: TimelineViewStore;

  constructor(props: Props, context: any) {
    super(props, context);
    this.timelineViewStore = new TimelineViewStore();
  }

  public render() {
    if (this.props.myStoryStore!.isLoading) {
      return <Spinner title="Loading timeline..." />;
    }

    return (
      <div className={styles.timelineWrapper}>
        {this.renderSearch()}
        {this.renderControls()}
        <CallToAction />
        {this.renderStoriesList()}
        {this.renderWelcome()}
      </div>
    );
  }

  private renderControls() {
    const {currentCustomer} = this.props.myStoryStore!;

    return (
      <div className={[storyStyles.container, storyStyles.addContainer].join(" ")}>
        <div className={storyStyles.meta}>
          <div className={storyStyles.timeAndFrom}>
            <br />
            <div className={storyStyles.timeAgo}>Today</div>
            <div className={storyStyles.date}>{moment().format("MMMM D")}</div>
          </div>

          <div className={storyStyles.avatar}>
            <div className={storyStyles.avatarImage}>
              <Icon iconName="plus" />
            </div>
          </div>
        </div>

        <div className={storyStyles.customerContent}>
          <h1>What’s next?</h1>

          <div className={styles.controlsContainer}>
            <div className={styles.controlWrapper}>
              <CreatePhotoForm customer={currentCustomer} />
              <p>
                Regular photos help both you and Dr. Blake keep track of the progress of your
                skincare.
              </p>
            </div>

            <div className={styles.controlWrapper}>
              <MessagesDialog customer={currentCustomer} />
              <p>
                Have a question about your skin? Having any issues with your latest formulation? Let
                Dr. Blake know.
              </p>
            </div>

            <div className={styles.controlWrapper}>
              <UpdateCustomerForm initialCustomer={currentCustomer} />
              <p>
                Has anything changed in your medical history? It’s important to keep your profile up
                to date.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderSearch() {
    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      this.timelineViewStore.setQuery(event.target.value);
    };

    const handleStoryVisibilityChange = (storyType: StoryType, isChecked: boolean): void => {
      this.timelineViewStore.setStoryTypeVisibility(storyType, isChecked);
    };

    return (
      <div className={styles.searchContainer}>
        <div className={styles.searchQueryInputWrapper}>
          <input
            type="text"
            className="pt-input"
            placeholder="Search your timeline"
            value={this.timelineViewStore.query}
            onChange={handleQueryChange}
          />
        </div>

        <span className={styles.filterLabel}>Show:</span>

        <div className={styles.searchStoryTypeVisibilitiesWrapper}>
          {[
            StoryType.PhotoGroup,
            StoryType.Visit,
            StoryType.MessageGroup,
            StoryType.MedicalProfileAudit,
          ].map((storyType, index) => {
            return (
              <div key={index} className={styles.searchVisibilityCheckboxWrapper}>
                <Checkbox
                  checked={this.timelineViewStore.storyTypeVisibilites.get(storyType)}
                  onChange={event =>
                    handleStoryVisibilityChange(storyType, (event.target as any).checked)
                  }
                >
                  {STORY_TYPE_NAMES[storyType]}
                </Checkbox>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private renderStoriesList() {
    return (
      <div>
        {this.props
          .myStoryStore!.allOrderedStories.filter(story =>
            this.timelineViewStore.visibleStoryTypes.includes(story.type)
          )
          .map((story, index) => <StoryItem key={index} story={story} />)}
      </div>
    );
  }

  private renderWelcome() {
    const {currentCustomer} = this.props.myStoryStore!;

    return (
      <div className={storyStyles.container}>
        <StoryMeta by={currentCustomer.physician} at={currentCustomer.createdAtMoment} />

        <div className={storyStyles.physicianContent}>
          <h1>Welcome to EllaMD, {currentCustomer.fullName}!</h1>
          <p>
            Great to see you decided to try out EllaMD. Thank you for supporting us as an early
            adopter.
          </p>
          <div className={storyStyles.signature}>
            <div>
              <span>Dr. Patrick Blake, M.D.</span>
              <img src={currentCustomer.physician.signatureImageUrl} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

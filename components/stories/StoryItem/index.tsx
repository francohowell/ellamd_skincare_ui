import {inject, observer} from "mobx-react";
import * as React from "react";

import {StoryMeta} from "components/stories";
import {Audit, MedicalProfile, MessageGroup, PhotoGroup, Story, Visit} from "models";
import {IdentityStore} from "stores";

import {MedicalProfileAuditStoryItem} from "./MedicalProfileAuditStoryItem";
import {MessageGroupStoryItem} from "./MessageGroupStoryItem";
import {PhotoGroupStoryItem} from "./PhotoGroupStoryItem";
import {VisitStoryItem} from "./VisitStoryItem";

import * as styles from "../index.css";

interface Props {
  identityStore?: IdentityStore;
  story: Story;
}

@inject("identityStore")
@observer
export class StoryItem extends React.Component<Props> {
  public render() {
    const {story} = this.props;
    const style = story.byCustomer ? styles.customerContent : styles.physicianContent;

    return (
      <div className={styles.container}>
        <StoryMeta by={story.by} at={story.at} />
        <div className={style}>{this.renderStory(story)}</div>
      </div>
    );
  }

  private renderStory(story: Story) {
    const {object} = story;

    switch (story.type) {
      case "message-group":
        return <MessageGroupStoryItem messageGroup={object as MessageGroup} />;
      case "photo-group":
        return <PhotoGroupStoryItem photoGroup={object as PhotoGroup} />;
      case "medical-profile-audit":
        return <MedicalProfileAuditStoryItem audit={object as Audit<MedicalProfile>} />;
      case "visit":
        return <VisitStoryItem visit={object as Visit} />;
      default:
        throw new Error(`StoryItem lacks implementation for StoryType ${story.type}`);
    }
  }
}

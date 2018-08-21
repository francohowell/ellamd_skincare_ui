import {action, computed, observable} from "mobx";

import {StoryType} from "models";

export class TimelineViewStore {
  @observable public query: string = "";
  @observable public storyTypeVisibilites: Map<StoryType, boolean>;

  constructor() {
    this.storyTypeVisibilites = new Map();
    Object.values(StoryType).forEach(storyType => this.storyTypeVisibilites.set(storyType, true));
  }

  @computed
  get visibleStoryTypes(): StoryType[] {
    return (Object.values(StoryType) as StoryType[]).filter(storyType => {
      return this.storyTypeVisibilites.get(storyType);
    });
  }

  @action
  public setQuery(newQuery: string): void {
    this.query = newQuery;
  }

  @action
  public setStoryTypeVisibility(storyType: StoryType, newValue: boolean): void {
    this.storyTypeVisibilites.set(storyType, newValue);
  }
}

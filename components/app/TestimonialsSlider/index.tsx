import * as React from "react";
import SwipeableViews from "react-swipeable-views";

import {TestimonialSlide} from "components/app/TestimonialSlide";
import {PageControl} from "components/common";

import * as styles from "./index.css";

interface Props {}

interface State {
  index: number;
}

export class TestimonialsSlider extends React.Component<Props> {
  public state: State = {
    index: 0,
  };

  public render() {
    return (
      <div className={styles.layout}>
        <SwipeableViews
          index={this.state.index}
          className={styles.content}
          enableMouseEvents={true}
          resistance={true}
          onChangeIndex={this.handleChangeIndex}
        >
          <TestimonialSlide />
          <TestimonialSlide />
          <TestimonialSlide />
        </SwipeableViews>
        <div className={styles.pageControl}>
          <PageControl index={this.state.index} dots={3} onChangeIndex={this.handleChangeIndex} />
        </div>
      </div>
    );
  }

  private handleChangeIndex = (index: number) => {
    this.setState({index});
  };
}

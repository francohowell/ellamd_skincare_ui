import * as React from "react";

import * as styles from "./index.css";

interface Props {}

export class TestimonialSlide extends React.Component<Props> {
  public render() {
    return (
      <div className={styles.layout}>
        <div className={styles.content}>
          <ul className={styles.transformation}>
            <li>
              <div className={styles.face} />
              Before
            </li>
            <li>
              <div className={styles.face} />
              After
            </li>
          </ul>
          <p className={styles.testimonial}>
            “Extremely happy for this change, it totally changed my whole life, will never get tired
            of spreading it actually works and for people to try it!”
          </p>
          <p className={styles.person}>Kate, 24</p>
        </div>
      </div>
    );
  }
}

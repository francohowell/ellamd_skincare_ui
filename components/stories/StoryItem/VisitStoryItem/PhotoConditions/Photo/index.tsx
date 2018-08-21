import {observer} from "mobx-react";
import * as React from "react";

import {Id, Photo as PhotoModel} from "models";

import * as styles from "../index.css";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 1600;

interface Props {
  photo: PhotoModel;
  selectedConditionId?: Id;
}

interface State {
  isCanvasVisible: boolean;
}

@observer
export class Photo extends React.Component<Props, State> {
  private canvas: HTMLCanvasElement | undefined = undefined;
  public state = {isCanvasVisible: false};

  public componentDidMount() {
    this.initializeCanvas(this.props.selectedConditionId);
  }

  public componentWillReceiveProps(newProps: Props) {
    if (this.props.selectedConditionId !== newProps.selectedConditionId) {
      this.initializeCanvas(newProps.selectedConditionId);
    }
  }

  private initializeCanvas(conditionId?: Id) {
    if (!this.canvas) return;

    const context = this.canvas.getContext("2d");
    if (!context) return;

    const photoCondition = this.props.photo.photoConditions.find(
      pc => pc.condition.id === conditionId
    );

    if (!photoCondition || !photoCondition.canvasData) {
      this.setState({isCanvasVisible: false});
    } else {
      this.setState({isCanvasVisible: true});
      const image = new Image();
      image.src = photoCondition.canvasData;
      image.onload = () => {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "#000000";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.globalCompositeOperation = "destination-out";
        context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      };
    }
  }

  public render() {
    return (
      <div className={styles.photo}>
        <canvas
          ref={element => {
            if (element) this.canvas = element;
          }}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={[
            styles.canvas,
            this.state.isCanvasVisible ? styles.isVisible : undefined,
          ].join(" ")}
        />

        <img width={CANVAS_WIDTH} src={this.props.photo.mediumUrl} />
      </div>
    );
  }
}

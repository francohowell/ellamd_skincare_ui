import {Button, Dialog, Intent, Slider} from "@blueprintjs/core";
import {action, observable, toJS} from "mobx";
import {inject, observer} from "mobx-react";
import * as React from "react";

import {Spinner} from "components/common";
import {Customer, Id, Photo, PhotoCondition, Visit} from "models";
import {ConditionStore, CustomerStore} from "stores";
import {Method, request, Status, SubmitEvent, Toaster} from "utilities";

import * as styles from "./index.css";

/**
 * HACK: This component is awful and needs refactoring.
 */

interface Props {
  customer: Customer;
  visit: Visit;
  className?: string;
  customerStore?: CustomerStore;
  conditionStore?: ConditionStore;
}

interface State {
  isOpen: boolean;
  photos: Photo[];
  selectedPhotoId?: Id;
  isLoading: boolean;
  selectedTool: "brush" | "eraser";
  toolSize: number;
  selectedPhotoConditionId?: Id;
  visiblePhotoConditionIds: Id[];
  selectedConditionId?: Id;
  isDrawing: boolean;
}

type Point = {x: number; y: number};

const COLORS = ["#2980b9", "#8e44ad", "#16a085", "#f39c12"];
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 2400;
const INITIALIZE_CANVAS_DELAY_IN_MS = 1000;

const flatMap = (f: any, xs: any) => xs.reduce((acc: any, x: any) => acc.concat(f(x)), []);

function isMouseEvent(
  event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
): event is React.MouseEvent<HTMLDivElement> {
  return typeof (event as React.MouseEvent<HTMLDivElement>).clientX !== "undefined";
}

@inject("customerStore", "conditionStore")
@observer
export class UpdateAnnotationsForm extends React.Component<Props, State> {
  private nextTemporaryId: Id = 0;
  @observable private canvases: {[photoConditionId: number]: HTMLCanvasElement | undefined} = {};
  @observable private canvasHistory: string[] = observable([]);
  @observable private canvasHistoryIndex: number | undefined = undefined;
  @observable private previousPoint: Point | undefined = undefined;

  public state: State = {
    isOpen: false,
    photos: [],
    selectedPhotoId:
      this.props.customer.photos.length > 0 ? this.props.customer.photos[0].id : undefined,
    isLoading: false,
    selectedTool: "brush",
    toolSize: 20,
    selectedPhotoConditionId: undefined,
    visiblePhotoConditionIds: flatMap(
      (photo: Photo) => photo.photoConditions.map(photoCondition => photoCondition.id),
      this.props.customer.photos
    ),
    selectedConditionId: undefined,
    isDrawing: false,
  };

  public componentDidMount() {
    this.initialize();
  }

  public initialize() {
    const photos = toJS(this.props.customer.photos);

    photos.forEach(photo => {
      photo.photoConditions = observable(photo.photoConditions);
    });

    this.setState({
      photos,
      visiblePhotoConditionIds: flatMap(
        (photo: Photo) => photo.photoConditions.map(photoCondition => photoCondition.id),
        photos
      ),
    });
    setTimeout(this.initializeCanvases, INITIALIZE_CANVAS_DELAY_IN_MS);
  }

  private initializeCanvases = () => {
    this.state.photos.forEach(photo => {
      photo.photoConditions.forEach(photoCondition => {
        if (!photoCondition.canvasData) return;

        const canvas = this.canvases[photoCondition.id];
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const image = new Image();
        image.src = photoCondition.canvasData;
        image.onload = () => {
          context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          context.drawImage(image, 0, 0);
          context.globalCompositeOperation = "source-in";
          context.fillStyle = COLORS[photoCondition.id % COLORS.length];
          context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        };
      });
    });
  };

  private toggleForm = () => {
    setTimeout(this.initializeCanvases, INITIALIZE_CANVAS_DELAY_IN_MS);
    this.setState({isOpen: !this.state.isOpen});
  };

  private get selectedPhoto() {
    return this.state.photos.find(photo => photo.id === this.state.selectedPhotoId);
  }

  @action
  private setSelectedPhotoId(photoId: number) {
    this.canvasHistory = observable([]);
    this.canvasHistoryIndex = undefined;
    this.setState({selectedPhotoId: photoId});
  }

  private get selectedPhotoCondition() {
    if (!this.selectedPhoto) return;
    return this.selectedPhoto.photoConditions.find(
      photoCondition => photoCondition.id === this.state.selectedPhotoConditionId
    );
  }

  @action
  private setSelectedPhotoConditionId(photoConditionId: number | undefined) {
    this.canvasHistory = observable([]);
    this.canvasHistoryIndex = undefined;
    this.setState({selectedPhotoConditionId: photoConditionId, selectedTool: "brush"});
  }

  @action
  private handleAddCondition = () => {
    if (!this.selectedPhoto) return;

    this.selectedPhoto.photoConditions.push({
      id: this.nextTemporaryId,
      condition: this.props.conditionStore!.conditions!.find(
        condition => condition.id === this.state.selectedConditionId
      )!,
      note: "",
    });

    this.setState({
      selectedConditionId: undefined,
      selectedPhotoConditionId: this.nextTemporaryId,
      visiblePhotoConditionIds: this.state.visiblePhotoConditionIds.concat([this.nextTemporaryId]),
    });
    this.nextTemporaryId += 1;
  };

  private handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const photos = this.state.photos.filter(photo => photo.photoConditions.length > 0);

    photos.forEach(photo => {
      photo.photoConditions = toJS(photo.photoConditions);
      photo.photoConditions.forEach(photoCondition => {
        const canvas = this.canvases[photoCondition.id];
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.globalCompositeOperation = "source-in";
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        photoCondition.canvasData = canvas.toDataURL();
      });
    });

    this.setState({isLoading: true});
    const response = await request(`visits/${this.props.visit.id}/photo-conditions`, Method.POST, {
      photos,
    });
    this.setState({isLoading: false});

    // tslint:disable-next-line switch-default
    switch (response.status) {
      case Status.Success:
        const {visit} = response.data! as {visit: Visit};

        this.props.customer.updateVisit(visit);
        this.props.customer.updatePhotos(visit.photos);
        this.initialize();

        Toaster.show({
          message: "Annotations saved.",
          intent: Intent.SUCCESS,
          iconName: "tick",
        });

        this.setState({isOpen: false});
        break;

      case Status.Error:
        Toaster.show({
          message: "There was an error saving your work.",
          intent: Intent.DANGER,
          iconName: "error",
        });
        break;
    }
  };

  @action private setPreviousPoint = (point?: Point) => (this.previousPoint = point);

  @action
  private startDrawing = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    this.setPreviousPoint(this.getCursorPosition(event));
    this.setState({isDrawing: true});
  };

  @action
  private stopDrawing = () => {
    this.captureHistory();
    this.setState({isDrawing: false});
  };

  @action
  private captureHistory = () => {
    if (this.state.selectedPhotoConditionId === undefined) return;

    const canvas = this.canvases[this.state.selectedPhotoConditionId];
    if (!canvas) return;

    if (!this.state.isDrawing) return;

    if (this.canvasHistoryIndex) {
      this.canvasHistory = this.canvasHistory.slice(0, this.canvasHistoryIndex + 1);
    }

    this.canvasHistory.push(canvas.toDataURL());
    this.canvasHistoryIndex = this.canvasHistory.length - 1;
  };

  private canUndo = () => {
    if (this.state.selectedPhotoConditionId === undefined) return false;
    if (this.canvasHistory === undefined) return false;
    if (this.canvasHistoryIndex === undefined) return false;

    return this.canvasHistoryIndex >= 0;
  };

  private canRedo = () => {
    if (this.state.selectedPhotoConditionId === undefined) return false;
    if (this.canvasHistory === undefined) return false;
    if (this.canvasHistoryIndex === undefined) return false;

    return this.canvasHistoryIndex < this.canvasHistory.length - 1;
  };

  @action
  private undo = () => {
    if (this.state.selectedPhotoConditionId === undefined) return;
    if (this.canvasHistoryIndex === undefined) return;

    const canvas = this.canvases[this.state.selectedPhotoConditionId];
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    this.canvasHistoryIndex -= 1;

    if (this.canvasHistoryIndex >= 0) {
      const image = new Image();
      image.src = this.canvasHistory[this.canvasHistoryIndex];
      image.onload = () => {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.drawImage(image, 0, 0);
      };
    } else {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  };

  @action
  private redo = () => {
    if (this.state.selectedPhotoConditionId === undefined) return;
    if (this.canvasHistoryIndex === undefined) return;

    const canvas = this.canvases[this.state.selectedPhotoConditionId];
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    this.canvasHistoryIndex += 1;

    const image = new Image();
    image.src = this.canvasHistory[this.canvasHistoryIndex];
    image.onload = () => {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context.drawImage(image, 0, 0);
    };
  };

  private drawLine = (point: Point) => {
    if (
      this.selectedPhotoCondition === undefined ||
      this.state.selectedPhotoConditionId === undefined
    ) {
      return;
    }

    if (this.previousPoint) {
      const canvas = this.canvases[this.state.selectedPhotoConditionId];
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      context.globalCompositeOperation = "source-in";
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      context.globalCompositeOperation =
        this.state.selectedTool === "brush" ? "source-over" : "destination-out";
      context.lineJoin = "round";
      context.lineCap = "round";
      context.beginPath();
      context.lineWidth = this.state.toolSize;
      context.strokeStyle = "#ffffff";
      context.moveTo(this.previousPoint.x, this.previousPoint.y);
      context.lineTo(point.x, point.y);
      context.closePath();
      context.stroke();

      context.globalCompositeOperation = "source-in";
      context.fillStyle = COLORS[this.state.selectedPhotoConditionId % COLORS.length];
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  };

  private getCursorPosition = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ): Point | undefined => {
    if (!this.canvases[this.state.selectedPhotoConditionId!]) return;

    const {top, left} = this.canvases[
      this.state.selectedPhotoConditionId!
    ]!.getBoundingClientRect();

    let clientX;
    let clientY;

    if (isMouseEvent(event)) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = event.targetTouches[0].clientX;
      clientY = event.targetTouches[0].clientY;
    }

    return {
      x: clientX - left,
      y: clientY - top,
    };
  };

  @action
  private deletePhotoCondition = (
    event: React.MouseEvent<HTMLButtonElement>,
    photoConditionId: number
  ) => {
    event.stopPropagation();
    if (!this.selectedPhoto) return;

    this.selectedPhoto.photoConditions = this.selectedPhoto.photoConditions.filter(
      existingPhotoCondition => existingPhotoCondition.id !== photoConditionId
    );

    this.setSelectedPhotoConditionId(
      this.state.selectedPhotoConditionId === photoConditionId
        ? undefined
        : this.state.selectedPhotoConditionId
    );
  };

  @action
  private updatePhotoConditionNote = (
    event: React.FormEvent<HTMLTextAreaElement>,
    photoCondition: PhotoCondition
  ) => {
    photoCondition.note = (event.target as any).value;
  };

  private renderForm() {
    if (this.props.conditionStore!.isLoading) {
      return <Spinner title="Loading form..." />;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="pt-dialog-body">
          {this.state.photos.length === 0 ? <p>Customer has no photos!</p> : undefined}

          {this.state.photos.map(photo => (
            <div
              className={[
                styles.photoThumbnail,
                "pt-card",
                "pt-elevation-0",
                "pt-interactive",
                this.state.selectedPhotoId === photo.id ? styles.isSelected : undefined,
              ].join(" ")}
              onClick={() => this.setSelectedPhotoId(photo.id)}
              key={photo.id}
            >
              <img src={photo.thumbnailUrl} />
            </div>
          ))}

          {this.selectedPhoto === undefined ? (
            undefined
          ) : (
            <div className={styles.photoAndConditions}>
              <div className={["pt-card", "pt-elevation-0", styles.selectedPhoto].join(" ")}>
                <div className={styles.toolbar}>
                  <div className={styles.leftTools}>
                    <div className="pt-button-group pt-large">
                      <Button
                        iconName="selection"
                        className={
                          this.state.selectedTool === "brush" ? styles.isSelected : undefined
                        }
                        onClick={() => this.setState({selectedTool: "brush"})}
                        disabled={this.state.selectedPhotoConditionId === undefined}
                      />
                      <Button
                        iconName="eraser"
                        className={
                          this.state.selectedTool === "eraser" ? styles.isSelected : undefined
                        }
                        onClick={() => this.setState({selectedTool: "eraser"})}
                        disabled={this.state.selectedPhotoConditionId === undefined}
                      />
                    </div>

                    <span className={styles.brushSample}>
                      <span style={{width: this.state.toolSize, height: this.state.toolSize}} />
                    </span>

                    <Slider
                      className={styles.slider}
                      min={1}
                      max={50}
                      renderLabel={false}
                      showTrackFill={false}
                      value={this.state.toolSize}
                      onChange={toolSize => this.setState({toolSize})}
                      disabled={this.state.selectedPhotoConditionId === undefined}
                    />
                  </div>

                  <div className={styles.rightTools}>
                    <div className="pt-button-group pt-large">
                      <Button iconName="undo" disabled={!this.canUndo()} onClick={this.undo} />
                      <Button iconName="redo" disabled={!this.canRedo()} onClick={this.redo} />
                    </div>
                  </div>
                </div>
                <div className={styles.photo}>
                  <img src={this.selectedPhoto.largeUrl} />

                  {this.state.photos.map(photo =>
                    photo.photoConditions.map(photoCondition => (
                      <canvas
                        ref={element => {
                          if (element) this.canvases[photoCondition.id] = element;
                        }}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className={
                          this.state.selectedPhotoId === photo.id &&
                          this.state.visiblePhotoConditionIds.includes(photoCondition.id)
                            ? styles.isVisible
                            : undefined
                        }
                      />
                    ))
                  )}

                  {this.selectedPhotoCondition ? (
                    <div
                      className={styles.captureCanvas}
                      onMouseDown={this.startDrawing}
                      onMouseUp={this.stopDrawing}
                      onMouseLeave={this.stopDrawing}
                      onMouseMove={event => {
                        const point = this.getCursorPosition(event);
                        if (point && this.state.isDrawing) this.drawLine(point);
                        this.setPreviousPoint(point);
                      }}
                      onTouchStart={this.startDrawing}
                      onTouchEnd={this.stopDrawing}
                      onTouchMove={event => {
                        event.preventDefault();
                        const point = this.getCursorPosition(event);
                        if (point && this.state.isDrawing) this.drawLine(point);
                        this.setPreviousPoint(point);
                      }}
                    />
                  ) : (
                    undefined
                  )}

                  <span
                    className={styles.cursor}
                    style={{
                      width: this.state.toolSize,
                      height: this.state.toolSize,
                      left: this.previousPoint ? this.previousPoint.x : undefined,
                      top: this.previousPoint ? this.previousPoint.y : undefined,
                    }}
                  />
                </div>
              </div>

              <div className={styles.photoConditions}>
                <div className={styles.top}>
                  <div className={styles.addCondition}>
                    <div className={[styles.select, "pt-select", "pt-large"].join(" ")}>
                      <select
                        onChange={event =>
                          this.setState({
                            selectedConditionId: parseInt(event.target.value, 10),
                          })
                        }
                        value={this.state.selectedConditionId}
                      >
                        <option value={undefined}>Select a condition…</option>

                        {this.props.conditionStore!.conditions
                          ? this.props.conditionStore!.conditions!.map(condition => (
                              <option key={condition.id} value={condition.id}>
                                {condition.name}
                              </option>
                            ))
                          : undefined}
                      </select>
                    </div>

                    <Button
                      iconName="plus"
                      text="Add"
                      onClick={this.handleAddCondition}
                      disabled={this.state.selectedConditionId === undefined}
                      className={styles.button}
                      intent={Intent.PRIMARY}
                    />
                  </div>

                  {this.selectedPhoto.photoConditions.map(photoCondition => (
                    <div
                      key={photoCondition.id}
                      className={[
                        styles.photoCondition,
                        "pt-card",
                        "pt-elevation-0",
                        "pt-interactive",
                        this.state.selectedPhotoConditionId === photoCondition.id
                          ? styles.isSelected
                          : undefined,
                      ].join(" ")}
                      onClick={() => this.setSelectedPhotoConditionId(photoCondition.id)}
                    >
                      <div className={styles.row}>
                        <span
                          className={styles.swatch}
                          style={{background: COLORS[photoCondition.id % COLORS.length]}}
                        />

                        <span className={styles.conditionName}>
                          {photoCondition.condition.name}
                        </span>

                        <Button
                          className={[styles.hideButton, "pt-minimal"].join(" ")}
                          intent={Intent.PRIMARY}
                          iconName={
                            this.state.visiblePhotoConditionIds.includes(photoCondition.id)
                              ? "eye-open"
                              : "eye-off"
                          }
                          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();

                            if (this.state.visiblePhotoConditionIds.includes(photoCondition.id)) {
                              this.setState({
                                visiblePhotoConditionIds: this.state.visiblePhotoConditionIds.filter(
                                  id => id !== photoCondition.id
                                ),
                              });
                            } else {
                              this.setState({
                                visiblePhotoConditionIds: this.state.visiblePhotoConditionIds.concat(
                                  [photoCondition.id]
                                ),
                              });
                            }
                          }}
                        />

                        <Button
                          className={[styles.deleteButton, "pt-minimal"].join(" ")}
                          intent={Intent.DANGER}
                          iconName="trash"
                          onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                            this.deletePhotoCondition(event, photoCondition.id)
                          }
                        />
                      </div>

                      <div className={styles.row}>
                        <textarea
                          placeholder="Notes…"
                          value={photoCondition.note}
                          className="pt-input pt-fill"
                          onChange={event => this.updatePhotoConditionNote(event, photoCondition)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.bottom}>
                  <Button onClick={this.toggleForm} className="pt-large">
                    Cancel
                  </Button>

                  <Button
                    onClick={this.handleSubmit}
                    className={[styles.submitButton, "pt-large"].join(" ")}
                    intent={Intent.PRIMARY}
                    loading={this.state.isLoading}
                    type="submit"
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    );
  }

  public render() {
    return (
      <div className={[styles.wrapper, this.props.className].join(" ")}>
        <Button className="pt-intent-primary pt-large" onClick={this.toggleForm}>
          Update photos &amp; annotations
        </Button>

        <Dialog
          isOpen={this.state.isOpen}
          onClose={this.toggleForm}
          className={styles.dialog}
          canOutsideClickClose={false}
        >
          {this.renderForm()}
        </Dialog>
      </div>
    );
  }
}

// import {Button, Checkbox, Dialog, Intent} from "@blueprintjs/core";
// import {toJS} from "mobx";
// import {inject, observer} from "mobx-react";
// import * as React from "react";

// import {FadeTransitionGroup, RiseTransitionGroup} from "components/common";
// import {Customer, Id, Photo, Visit} from "models";
// import {CustomerStore} from "stores";
// import {Method, request, Status, SubmitEvent, Toaster} from "utilities";

// import * as styles from "./index.css";

// interface Props {
//   customer: Customer;
//   visit: Visit;
//   className?: string;
//   customerStore?: CustomerStore;
// }
// interface State {
//   isOpen: boolean;
//   photos: Photo[];
//   hasError: boolean;
//   errorMessage?: string;
//   isLoading: boolean;
// }

// @inject("customerStore")
// @observer
// export class ObsoleteUpdateAnnotationsForm extends React.Component<Props, State> {
//   public state: State = {
//     isOpen: false,
//     photos: toJS(this.props.visit.photos),
//     hasError: false,
//     errorMessage: undefined,
//     isLoading: false,
//   };

//   private toggleForm = () => {
//     this.setState({isOpen: !this.state.isOpen});
//   };

//   private renderError() {
//     if (!this.state.hasError) {
//       return;
//     }

//     return (
//       <div className={styles.errorWrapper}>
//         <div className={styles.error}>{this.state.errorMessage}</div>
//       </div>
//     );
//   }

//   private handleSubmit = async (event: SubmitEvent) => {
//     event.preventDefault();

//     this.setState({isLoading: true, hasError: false});
//     const response = await request(`visits/${this.props.visit.id}/photos`, Method.POST, {
//       photos: this.state.photos,
//     });
//     this.setState({isLoading: false});

//     // tslint:disable-next-line switch-default
//     switch (response.status) {
//       case Status.Success:
//         const {visit} = response.data! as {visit: Visit};

//         this.props.customer.updateVisit(visit);
//         Toaster.show({
//           message: "Visit’s photos updated.",
//           intent: Intent.SUCCESS,
//           iconName: "tick",
//         });
//         this.setState({isOpen: false});
//         break;

//       case Status.Error:
//         this.setState({hasError: true, errorMessage: response.error});
//         break;
//     }
//   };

//   private isPhotoSelected = (photoId: Id) => {
//     return this.state.photos.map(photo => photo.id).includes(photoId);
//   };

//   private togglePhoto = (photoId: Id) => {
//     let {photos} = this.state;

//     if (this.isPhotoSelected(photoId)) {
//       photos = photos.filter(photo => photo.id !== photoId).slice();
//     } else {
//       photos.push(toJS(this.props.customer.photos.find(photo => photo.id === photoId)!));
//     }

//     this.setState({photos});
//   };

//   private addAnnotation = (photoId: Id, event: React.MouseEvent<HTMLDivElement>) => {
//     const rectangle = (event.target as HTMLDivElement).getBoundingClientRect();
//     const positionX = (event.clientX - rectangle.left) / rectangle.width;
//     const positionY = (event.clientY - rectangle.top) / rectangle.height;

//     const {photos} = this.state;
//     photos.find(photo => photo.id === photoId)!.annotations.push({positionX, positionY, note: ""});
//     this.setState({photos});
//   };

//   private updateAnnotationNote = (photoId: Id, annotationIndex: number, note: string) => {
//     const {photos} = this.state;
//     photos.find(photo => photo.id === photoId)!.annotations[annotationIndex].note = note;
//     this.setState({photos});
//   };

//   private removeAnnotation = (photoId: Id, annotationIndex: number) => {
//     const {photos} = this.state;
//     photos.find(photo => photo.id === photoId)!.annotations.splice(annotationIndex, 1);
//     this.setState({photos});
//   };

//   private renderForm() {
//     return (
//       <Dialog
//         isOpen={this.state.isOpen}
//         onClose={this.toggleForm}
//         title="Update photos/annotations"
//         className={styles.dialog}
//       >
//         <form onSubmit={this.handleSubmit}>
//           <div className="pt-dialog-body">
//             <h2>Select photos</h2>

//             {this.props.customer.photos.length === 0 ? <p>Customer has no photos!</p> : undefined}
//             {this.props.customer.photos.map(photo => (
//               <div
//                 className={[
//                   styles.photoThumbnail,
//                   "pt-card",
//                   "pt-elevation-0",
//                   "pt-interactive",
//                 ].join(" ")}
//                 onClick={() => this.togglePhoto(photo.id)}
//                 key={photo.id}
//               >
//                 <img src={photo.thumbnailUrl} />
//                 <Checkbox
//                   checked={this.isPhotoSelected(photo.id)}
//                   readOnly={true}
//                   onClick={event => {
//                     event.stopPropagation();
//                   }}
//                   label="Include"
//                 />
//               </div>
//             ))}

//             <h2>Add annotations</h2>

//             {this.state.photos.length === 0 ? <p>No photos selected!</p> : undefined}
//             {this.state.photos.map(photo => (
//               <div
//                 className={[styles.photoAnnotationRow, "pt-card", "pt-elevation-1"].join(" ")}
//                 key={photo.id}
//               >
//                 <div className={styles.photoColumn}>
//                   <p>
//                     Click anywhere on the photo to add an annotation.
//                     <a href={photo.largeUrl} target="_blank">
//                       View at original size.
//                     </a>
//                   </p>

//                   <div
//                     className={styles.photoContainer}
//                     onClick={event => this.addAnnotation(photo.id, event)}
//                   >
//                     <img src={photo.mediumUrl} />

//                     {photo.annotations.map((annotation, index) => (
//                       <div
//                         className={styles.annotationPin}
//                         style={{
//                           left: `${annotation.positionX * 100}%`,
//                           top: `${annotation.positionY * 100}%`,
//                         }}
//                         onClick={event => {
//                           event.preventDefault();
//                           event.stopPropagation();
//                         }}
//                         key={index}
//                       >
//                         <span>{index + 1}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className={styles.annotationsColumn}>
//                   {photo.annotations.map((annotation, index) => (
//                     <div
//                       className={[styles.annotation, "pt-card", "pt-elevation-1"].join(" ")}
//                       key={index}
//                     >
//                       <Button
//                         className={[styles.deleteLink, "pt-minimal", "pt-intent-danger"].join(" ")}
//                         iconName="trash"
//                         onClick={() => this.removeAnnotation(photo.id, index)}
//                       />

//                       <strong>{index + 1}</strong>
//                       <textarea
//                         className="pt-input pt-small"
//                         value={annotation.note}
//                         onChange={event =>
//                           this.updateAnnotationNote(photo.id, index, event.target.value)
//                         }
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             <FadeTransitionGroup>{this.renderError()}</FadeTransitionGroup>
//           </div>

//           <div className="pt-dialog-footer">
//             <div className="pt-dialog-footer-actions">
//               <Button onClick={this.toggleForm}>Cancel</Button>

//               <Button
//                 onClick={this.handleSubmit}
//                 className="pt-intent-primary"
//                 loading={this.state.isLoading}
//                 type="submit"
//               >
//                 Update photos/annotations
//               </Button>
//             </div>
//           </div>
//         </form>
//       </Dialog>
//     );
//   }

//   public render() {
//     return (
//       <div className={[styles.wrapper, this.props.className].join(" ")}>
//         <Button className="pt-intent-primary pt-large" onClick={this.toggleForm}>
//           Update photos/annotations
//         </Button>

//         <RiseTransitionGroup>{this.renderForm()}</RiseTransitionGroup>
//       </div>
//     );
//   }
// }

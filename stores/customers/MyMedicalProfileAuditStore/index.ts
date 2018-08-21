import {action, computed} from "mobx";
import {ILazyObservable, lazyObservable} from "mobx-utils";

import {Audit, MedicalProfile} from "models";
import {Method, request, Status as RequestStatus} from "utilities";

type MyMedicalProfileAuditsSinkT = (newValue: Array<Audit<MedicalProfile>>) => void;

export class MyMedicalProfileAuditStore {
  private _medicalProfileAuditsSink: MyMedicalProfileAuditsSinkT;
  private _medicalProfileAudits: ILazyObservable<Array<Audit<MedicalProfile>>>;

  constructor() {
    this._medicalProfileAudits = lazyObservable(sink => {
      this._medicalProfileAuditsSink = sink;
      this.fetchMedicalProfileAudits();
    });
  }

  @computed
  get isLoading(): boolean {
    return this._medicalProfileAudits.current() === undefined;
  }

  @computed
  get descendingMedicalProfileAudits(): Array<Audit<MedicalProfile>> {
    return this.medicalProfileAudits
      .slice()
      .sort((auditA, auditB) => -auditA.createdAt.diff(auditB.createdAt));
  }

  @computed
  get medicalProfileAudits(): Array<Audit<MedicalProfile>> {
    if (this.isLoading) {
      throw new Error(
        "Attempt to dereference medicalProfileAudits while MyMedicalProfileAuditsStore is loading"
      );
    }

    return this._medicalProfileAudits.current();
  }

  @action
  public refresh(): void {
    this.fetchMedicalProfileAudits();
  }

  private async fetchMedicalProfileAudits(): Promise<void> {
    const response = await request("my/medical-profile-audits", Method.GET);

    if (response.status === RequestStatus.Error) {
      throw new Error(`Error while fetching MedicalProfile audits: ${response.error}`);
    }

    const rawAudits = response.data.audits as Array<Audit<MedicalProfile>>;
    const audits = rawAudits.map(auditParams => new Audit<MedicalProfile>(auditParams));

    this._medicalProfileAuditsSink(audits);
  }
}

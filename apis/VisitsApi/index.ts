import {toJS} from "mobx";

import {Method, request} from "lib";
import {Regimen, Visit} from "models";

export namespace VisitsApi {
  export const syncRegimen = async (visit: Visit, regimen: Regimen) => {
    const response = await request(`visits/${visit.id}/regimen`, Method.POST, {
      regimen: toJS(regimen),
    });

    return instantiateVisit(response.data.visit);
  };

  function instantiateVisit(visitParams: any) {
    return new Visit(visitParams);
  }
}

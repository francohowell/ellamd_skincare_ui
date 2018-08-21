import {toJS} from "mobx";

import {Method, request} from "lib";
import {Regimen} from "models";

export namespace RegimensApi {
  export const setActualRegimen = async (regimen: Regimen): Promise<void> => {
    const response = await request(`my/regimens`, Method.POST, {
      regimen: toJS(regimen),
    });

    replaceRegimen(regimen, response.data.regimen);
  };

  function replaceRegimen(regimen: Regimen, regimenParams: any): void {
    regimen.setFields(regimenParams);
  }
}

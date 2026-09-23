import {formatDate, SDFT} from "../../../../../common/src/lib/helpers/date.helper";


export class VaultErrorModel {
  companyId: string;
  roleName: string;
  login: string;
  date: string;
  operation: string;
  vaultAction: string;
  vaultHttpCode: string;
  vaultErrorCode: string;
  errorMessage: string; // vaultErrorMessage
  bankErrorCode: string;
  bankErrorMessage: string;
}

export function convertJSONToVaultErrorModel(json): VaultErrorModel {
  const vaultErrorModel = Object.assign(new VaultErrorModel(), json);
  vaultErrorModel.date = json.date ? formatDate(json.date, SDFT) : null;
  return vaultErrorModel;
}



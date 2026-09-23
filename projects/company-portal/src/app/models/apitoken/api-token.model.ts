import { formatDate } from "../../../../../common/src/lib/helpers/date.helper";
import {SDFT} from "../../../../../common/src/lib/helpers/date.helper";

export class ApiTokenModel {
  id: string;
  name: string;
  lastUse: string;
  refreshToken: string;
  revoked: string;
  companyId: string;

  static toJSON(apiToken: ApiTokenModel) {
    return {
      name: apiToken.name
    }
  }

  static fromJSON(json): ApiTokenModel {
    const apiToken = Object.assign(new ApiTokenModel(), json);
    apiToken.lastUse = json.lastUse ? formatDate(json.lastUse, SDFT) : null;
    apiToken.revoked = json.revoked ? formatDate(json.revoked, SDFT) : null;
    return apiToken;
  }
}


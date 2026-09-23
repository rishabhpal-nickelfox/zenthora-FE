import { formatDate } from "../../../../../common/src/lib/helpers/date.helper";
import {SDFT} from "../../../../../common/src/lib/helpers/date.helper";

import {DateTime} from 'luxon';

export class AuditModel {
  id: number;
  timestamp: string;
  ip: string;
  login: string;
  entityId: string;
  entityLegalName: string;
  action: string;
  actionData: any;
  details: any[];
}

export function convertJSONToAuditRecord(json): AuditModel {
  const audit = new AuditModel();
  audit.timestamp = formatDate(json.timestamp, SDFT);
  audit.ip = json.ip;
  audit.login = json.login;
  audit.entityId = json.entityId;
  audit.entityLegalName = json.entityLegalName;
  audit.action = json.action;

  audit.actionData = safeParse(json.actionData, null);
  audit.details = json.details ? safeParse(json.details, []) : [];
  return audit;
}

// the backend stores an exception message instead of JSON when audit serialization fails,
// so a broken payload must not break the whole row
function safeParse(value, fallback) {
  if (value === null || value === undefined) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    console.warn('Unable to parse audit payload', value);
    return fallback;
  }
}

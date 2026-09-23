import {EventEmitter} from "@angular/core";
import {HermesEnum} from "../enums/utils/hermes.enum";

import * as hermes from '../../assets/hermes/hermes.min';

export abstract class BaseUiKeyService {
  readonly uiKeysChanged: EventEmitter<void> = new EventEmitter();

  protected constructor() {
    hermes.on(HermesEnum.LOGIN, () => {
      this.uiKeysChanged.emit();
    });
    hermes.on(HermesEnum.LOGOUT, () => {
      this.uiKeysChanged.emit();
    });
    hermes.on(HermesEnum.SELECT_ROLE, () => {
      this.uiKeysChanged.emit();
    });
    hermes.on(HermesEnum.UPDATE_CURRENT_ROLE, () => {
      this.uiKeysChanged.emit();
    });
    hermes.on(HermesEnum.COMPANY_ENABLE_DISABLE, () => {
      this.uiKeysChanged.emit();
    });
  }

  protected abstract userCurrentRoleContainsPermissions(...uiKeys);
}

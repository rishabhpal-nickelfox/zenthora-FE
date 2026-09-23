import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {alert_lifetime} from '../common-environment';

@Injectable({providedIn: 'root'})
export class AlertService {


  private readonly _defaultToastrConfig = {
    timeOut: alert_lifetime
  };

  toastrConfig;

  constructor(protected toasterService: ToastrService) {
    this.toastrConfig = this.defaultToastrConfig;
  }

  get defaultToastrConfig() {
    return {...this._defaultToastrConfig};
  }

  showError(title, body) {
    this.toasterService.error(body, title, this.toastrConfig);
  }

  notImplemented(methodName) {
    this.toasterService.warning(methodName, 'Not implemented', this.toastrConfig);
  }

  showSuccess(title, body, toastrConfig?) {
    this.toasterService.success(body, title, toastrConfig ?? this.toastrConfig);
  }

  showInfo(title, body, toastrConfig?) {
    this.toasterService.info(body, title, toastrConfig  ?? this.toastrConfig);
  }
}

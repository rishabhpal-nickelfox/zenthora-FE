import {Inject, Injectable} from '@angular/core';
import {COMMON_CONFIG, CommonConfig} from '../common-config.token';

@Injectable({providedIn: 'root'})
export class LogService {
  private showAdditionalLogs: boolean;

  constructor(@Inject(COMMON_CONFIG) config: CommonConfig) {
    this.showAdditionalLogs = !config.production;
  }


  info(msg: any, ...optionalParams: any[]) {
    if (this.showAdditionalLogs) {
      console.info(msg, ...optionalParams);
    }
  }

  error(msg: any, ...optionalParams: any[]) {
    console.error(msg, ...optionalParams);
  }

  debug(msg: any, ...optionalParams: any[]) {
    if (this.showAdditionalLogs) {
      console.debug(msg, ...optionalParams);
    }
  }

  log(msg: any, ...optionalParams: any[]) {
    if (this.showAdditionalLogs) {
      console.log(msg, ...optionalParams);
    }
  }
}

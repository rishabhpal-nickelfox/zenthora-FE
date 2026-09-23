import {Inject, Injectable} from '@angular/core';
import {CustomerCurrentDataService} from "./customer-current-data.service";
import {TableViewSettingsService} from "../../../common/src/lib/utils/table-view-settings.service";

@Injectable()
export class CustomerTableViewSettingsService extends TableViewSettingsService {

  constructor(protected currentDataService: CustomerCurrentDataService) {
    super(currentDataService)
  }
}

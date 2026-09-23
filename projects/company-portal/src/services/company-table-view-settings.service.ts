import {Injectable} from '@angular/core';
import {TableViewSettingsService} from "../../../common/src/lib/utils/table-view-settings.service";
import {CompanyCurrentDataService} from "./company-current-data.service";

@Injectable()
export class CompanyTableViewSettingsService extends TableViewSettingsService {

  constructor(protected currentDataService: CompanyCurrentDataService) {
    super(currentDataService)
  }
}

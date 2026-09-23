import {Injectable} from "@angular/core";
import {NbThemeService} from "@nebular/theme";
import {CustomerCurrentDataService} from "./customer-current-data.service";
import {ThemeHelperService} from "../../../common/src/lib/helpers/theme-helper.service";

@Injectable()
export class CustomerThemeHelperService extends ThemeHelperService {
  constructor(private themeService: NbThemeService, private currentDataService: CustomerCurrentDataService) {
    super();
  }


  saveDefaultTheme(): void {
    this.currentDataService.defaultTheme = this.getDefaultTheme();
  }

  setDefaultTheme(): void {
    const root: any = document.querySelector(':root');
    Array.from(this.currentDataService.defaultTheme.entries()).forEach(
      entry => {
        root.style.setProperty(this.getPropertyKey(entry[0]), entry[1]);
      }
    );
  }

  setTheme(): void {
    const root: any = document.querySelector(':root');

    this.setDefaultTheme();

    Array.from(this.currentDataService.theme.entries()).forEach(
      entry => {
        if (entry[1] !== null && entry[1] !== undefined && `${entry[1]}`.trim() !== '') {
          root.style.setProperty(this.getPropertyKey(entry[0]), entry[1]);
        }
      }
    );
  }

}

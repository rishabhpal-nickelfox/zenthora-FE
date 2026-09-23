import {Injectable} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {ObjectHelper} from "../../../common/src/lib/helpers/object.helper";

@Injectable()
export class CustomerTitleHelperService {
  constructor(private titleService: Title) {
  }

  setTitle(title: string, favicon: string) {
    this.titleService.setTitle(title);
    const faviconElement = document.getElementById("favicon");

    if (ObjectHelper.isDefined(favicon)) {
      faviconElement.setAttribute("href",
        favicon);
    } else {
      faviconElement.setAttribute("href",
        "assets/zenthoralogo/favicon.svg");
    }
  }
}

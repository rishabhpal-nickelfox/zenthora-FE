import {NbMenuItem} from '@nebular/theme';
import {EventEmitter, Inject, Injectable, InjectionToken, Output} from '@angular/core';
import {isDefined, ObjectHelper} from "../helpers/object.helper";
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from "./base-settings-provider.service";

export const MENU_SERVICE_TOKEN = new InjectionToken<BasePageMenuService>(
  'MENU_SERVICE_TOKEN'
);

@Injectable()
export abstract class BasePageMenuService {

  menu: NbMenuItem[] = [];

  @Output() menuChanged: EventEmitter<any> = new EventEmitter();

  protected constructor(@Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
  }

  reInit() {
    this.onReInit();
    this.menuChanged.emit();
  }

  getFirstUrl(menu: NbMenuItem[], defaultUrl): string {
    let url = defaultUrl;
    if (ObjectHelper.isDefined(menu) && ObjectHelper.isDefined(menu[0])) {
      if (isDefined(menu[0].link)) {
        menu[0].selected = true;
        url = menu[0].link;
      } else if (menu[0].children && menu[0].children.length) {
        menu[0].expanded = true;
        url = this.getFirstUrl(menu[0].children, url);
      }
    }
    return url;
  }

  findMenuItem(url, currentNode: NbMenuItem | NbMenuItem[]): NbMenuItem {
    let result;
    if (currentNode instanceof Array) {
      for (let i = 0; i < currentNode.length; i++) {
        result = this.findMenuItem(url, currentNode[i]);
        if (isDefined(result)) {
          return result;
        }
      }
    } else if (isDefined(currentNode as NbMenuItem)) {
      if (url == currentNode.link) {
        return currentNode;
      } else {
        if (currentNode.children) {
          let currentChild;

          for (let i = 0; i < currentNode.children.length; i++) {
            currentChild = currentNode.children[i];
            result = this.findMenuItem(url, currentChild);
            if (isDefined(result)) {
              return result;
            }
          }
        }
        return null;
      }
    }


  }

  protected abstract onReInit();

  protected link(url: string) {
    const prefix = this.usePrefix ? `/${this.settingsProvider.baseUrl}` : '';
    return `${prefix}/${url}`;
  }

  get usePrefix(): boolean {
    return this.settingsProvider.usePortalPrefix;
  }
}

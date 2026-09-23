import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class ThemeHelperService {
  constructor() {
  }

  private readonly THEME_PROPERTY_KEYS = ['theme-color1', 'theme-color2', 'theme-color3', 'theme-color4', 'theme-color5', 'theme-background-color', 'theme-font-color', 'theme-font-color-2', 'theme-border-color'];
  private readonly VAR_PREFIX = '--';
  private readonly DEFAULT_PREFIX = 'default-';

  getDefaultTheme(): Map<string, string> {
    const computedStyles = getComputedStyle(document.documentElement);

    const defaultThemeMap = new Map<string, string>();
    this.THEME_PROPERTY_KEYS.forEach(key => {
      defaultThemeMap.set(key, computedStyles.getPropertyValue(this.getDefaultPropertyKey(key)));
    });
    return defaultThemeMap;
  }


  protected getPropertyKey(key: string) {
    return `${this.VAR_PREFIX}${key}`;
  }

  protected getDefaultPropertyKey(key: string) {
    return `${this.VAR_PREFIX}${this.DEFAULT_PREFIX}${key}`;
  }
}

import {lastValueFrom, Observable, of} from 'rxjs';
import {Injectable, InjectionToken} from '@angular/core';
import {map, mergeMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {getDomain, isIp, getRootDomain, isLocalhost} from "../helpers/url.helper";
import {isEmptyString} from "../helpers/string.helper";
import {default_inactivity_alert_time, default_inactivity_time} from "../common-environment";

export const SETTINGS_PROVIDER_TOKEN = new InjectionToken<BaseSettingsProvider>(
  'SETTINGS_PROVIDER_TOKEN'
);

@Injectable()
export abstract class BaseSettingsProvider {
  constructor(protected http: HttpClient) {
  }

  protected config: BaseConfig = {} as BaseConfig;
  private _initialized = false;
  private _apiUrl: string;

  public get apiUrl(): string {
    return this._apiUrl;
  }

  public get apiStatusUrl(): string {
    return `${this.apiUrl}/status`;
  }

  public get initialized(): boolean {
    return this._initialized;
  }

  public get siteSealUrl(): string {
    return `https://seal.godaddy.com/getSeal?sealID=${this.config.godaddySitesealKey}`;
  }

  public get copyrightMessage(): string {
    return `ⓒ ${new Date().getFullYear()} Zenthora LLC. All rights reserved.`
  }

  abstract get baseUrl(): string;

  public loadConfigs(): Observable<any> {
    if (this.initialized) {
      return of(null);
    }
    console.log('[Base] loadConfigs() called');
    return this.http.get<BaseConfig>('../../assets/config.json')
      .pipe(tap(env => (this.config = env)))
      .pipe(mergeMap(res => this.loadConfig()))
      .pipe(map(() => {
        this._apiUrl = this.resolveApiUrl();
        this._initialized = true;
      }));
  }

  private resolveApiUrl(): string {
    if (this.config.apiUrls && this.config.apiUrls.length > 0) {
      const currentDomain = window.location.hostname;

      const currentRoot = getRootDomain(currentDomain);
      if (!currentRoot) return null;

      for (const backendUrl of this.config.apiUrls) {
        const backendDomain = getDomain(backendUrl);
        if (!isEmptyString(backendDomain)) {
          if (isIp(currentDomain) && isIp(backendDomain)) {
            return backendUrl;
          }

          if (isLocalhost(currentDomain) && isLocalhost(backendDomain)) {
            return backendUrl;
          }

          const backendRoot = getRootDomain(backendDomain);
          if (!isEmptyString(backendRoot) && backendRoot === currentRoot) {
            return backendUrl;
          }
        }
      }

      return null;
    }

    throw new Error("apiUrls must be presented in config.json");
  }

  protected abstract loadConfig(): Observable<any>;

  public getRecaptchaSiteKey(): string {
    return this.config.googleRecaptchaSiteKey;
  }

  public isRecaptchaEnabled(): boolean {
    return this.config.recaptchaEnabled;
  }

  get portalName(): string {
    return this.config.portalName;
  }

  get usePortalPrefix(): boolean {
    return this.config?.usePortalPrefix !== false;
  }

  get inactivityTimeoutSeconds(): number {
    return default_inactivity_time;
  }

  get inactivityAlertTimeSeconds(): number {
    return default_inactivity_alert_time;
  }

}

export function initSettings(
  settingsProvider: BaseSettingsProvider
): () => Promise<void> {
  return () => {
    console.log('initSettings');
    return lastValueFrom(settingsProvider.loadConfigs());
  };
}

export interface BaseConfig {
  apiUrls: string[];
  godaddySitesealKey: string;
  googleRecaptchaSiteKey: string;
  recaptchaEnabled: boolean;
  portalName?: string;
  usePortalPrefix?: boolean;
}

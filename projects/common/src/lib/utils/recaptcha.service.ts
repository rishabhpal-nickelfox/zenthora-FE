import {Inject, Injectable} from '@angular/core';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from './base-settings-provider.service';
import {HttpClient} from '@angular/common/http';
import {CommonErrorService} from './errorhandler/common-error.service';
import {GOOGLE_RECAPTCHA_ERROR_HEADER} from "../enums/error-message.enum";
import {FormPageComponent} from "../pages/form-page.component";


declare var grecaptcha: any;

@Injectable()
export class RecaptchaService {
  static readonly RECAPTCHA_ACTION_HEADER = 'google-recaptcha-action';
  static readonly RECAPTCHA_TOKEN_HEADER = 'google-recaptcha-token';
  private static _scriptLoadingPromise: Promise<any>;

  constructor(private http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider, private commonErrorService: CommonErrorService) {
  }

  private static _grecaptcha;

  static get grecaptcha() {
    return this._grecaptcha;
  }

  static loadRecaptchaScript(recaptchaSiteKey: string): Promise<any> {
    if (this._grecaptcha && this._grecaptcha.enterprise) {
      return Promise.resolve(this._grecaptcha);
    }

    if (this._scriptLoadingPromise) {
      return this._scriptLoadingPromise;
    }

    this._scriptLoadingPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[data-eps-recaptcha="enterprise"]');

      if (existingScript) {
        existingScript.addEventListener('load', () => {
          this._grecaptcha = grecaptcha;
          resolve(this._grecaptcha);
        });
        existingScript.addEventListener('error', reject);
        return;
      }

      const script = document.createElement('script');
      script.innerHTML = '';
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${recaptchaSiteKey}`;
      script.nonce = '2469c4f26c';
      script.async = true;
      script.defer = true;
      script.dataset.epsRecaptcha = 'enterprise';
      script.onload = () => {
        this._grecaptcha = grecaptcha;
        resolve(this._grecaptcha);
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });

    return this._scriptLoadingPromise;
  }

  sendRecaptcha(grecaptcha, action, successCallback, errorCallback) {
    if (!grecaptcha || !grecaptcha.enterprise) {
      RecaptchaService.loadRecaptchaScript(this.settingsProvider.getRecaptchaSiteKey())
        .then(loadedGrecaptcha => this.sendRecaptcha(loadedGrecaptcha, action, successCallback, errorCallback))
        .catch(errorCallback);
      return;
    }

    grecaptcha.enterprise.ready(() => {
      grecaptcha.enterprise.execute(this.settingsProvider.getRecaptchaSiteKey(), {action: action}).then(token => {
        if (token == null || token.length === 0) {
          errorCallback();
        } else {
          successCallback(token);
        }
      });
    });

  }

  recaptchaAndContinue(component: FormPageComponent, action: string, callback) {
    this.sendRecaptcha(RecaptchaService.grecaptcha, action, callback, () => this.onRecaptchaError(component))
    return false;
  }

  private onRecaptchaError = (component: FormPageComponent) => {
    this.commonErrorService.showError(GOOGLE_RECAPTCHA_ERROR_HEADER, null);
    component.afterSubmit();
  }
}

import {Injectable, InjectionToken} from "@angular/core";

@Injectable()
export abstract class BaseCurrentDataService {

  get currentTheme(): string {
    return localStorage.getItem('THEME') || 'zenthora-light';
  }

  set currentTheme(theme: string) {
    localStorage.setItem('THEME', theme);
  }

  abstract get prefix(): string;

  abstract isLoggedIn(): boolean;
}

import {InjectionToken} from '@angular/core';

export interface CommonConfig {
  production: boolean;
  statusCheckURL: string;
  statusCheckFrequency: number;
  cookieChangedVersion: string;
}

export const COMMON_CONFIG = new InjectionToken<CommonConfig>('COMMON_CONFIG');

import {HttpParams} from '@angular/common/http';
import {isEmptyString} from "./string.helper";

export function getQueryParams(filters: Map<string, string | string[]>, sortField?, sortDirection?): HttpParams {
  let p = new HttpParams();
  if (filters) {
    filters.forEach((value, key) => {
      if (Array.isArray(value)) {
        value.forEach(v => {
          p = p.append(key, v);
        });
      } else {
        p = p.set(key, value);
      }
    });
  }
  if (sortField && sortDirection) {
    p = p.set('sort', sortField + ',' + sortDirection);
  }
  return p;
}

export function getDomain(url: string): string {
  if (isEmptyString(url)) {
    return null
  }
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}


export function getRootDomain(host: string): string {
  if (isEmptyString(host)) {
    return null
  }
  if (isLocalhost(host)) {
    return "localhost";
  }

  if (isIp(host)) {
    return host;
  }

  const parts = host.split(".");
  if (parts.length < 2) {
    return null;
  }
  return parts.slice(-2).join(".");
}

export function isLocalhost(host: string): boolean{
  return host === "localhost" || host === "127.0.0.1";
}
export function isIp(host: string): boolean {
  if (!host) {
    return false;
  }

  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4.test(host)) {
    return true;
  }

  const ipv6 = /^[0-9a-fA-F:]+$/;
  if (host.includes(':') && ipv6.test(host)) {
    return true;
  }

  return false;
}

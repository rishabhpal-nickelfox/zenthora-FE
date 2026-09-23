import {map, mergeMap} from 'rxjs/operators';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {UserModel} from '../../app/models/usermanagement/user.model';
import {convertJSONToRole, convertRoleToJSON} from '../../app/models/usermanagement/role.model';
import {CompanyCurrentDataService} from '../company-current-data.service';
import {ObjectOperatingService} from '../../../../common/src/lib/utils/object-operating.service';
import {Observable} from 'rxjs';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../common/src/lib/utils/base-settings-provider.service';
import {CompanyServiceUrl} from "../company-service-url";

@Injectable()
export class RolePermissionService extends ObjectOperatingService {

  constructor(protected http: HttpClient, private currentDataService: CompanyCurrentDataService, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.ROLE}`;
  }

  getRolesForEntity(entity) {
    const service = this;
    return this.http.get<any>(`${this.settingsProvider.apiUrl}/${CompanyServiceUrl.ENTITY}/${entity.id}/roles`).pipe(
      map(requestResults => {
        const rolesByEntity = [];
        requestResults.forEach(function (requestResult) {
          rolesByEntity.push(Object.assign(convertJSONToRole(requestResult), {entity: entity}));
        });
        return rolesByEntity;
      }));
  }

  getUserRoles(user: UserModel) {
    return this.http.get<any>(`${this.settingsProvider.apiUrl}/${CompanyServiceUrl.USER}/${user.id}/roles`);
  }

  getAllPermissionsForEntity(entity) {
    return this.http.get<any>(`${this.settingsProvider.apiUrl}/${CompanyServiceUrl.ENTITY}/${entity.id}/permissions`);
  }

  save(role) {
    return role.id ? this.update(role) : this.create(role);
  }

  delete(role) {
    return this.http.delete<any>(this.baseUrl + '/' + role.id);
  }

  create(role) {
    return this.http.post<any>(this.baseUrl,
      JSON.stringify(
        convertRoleToJSON(role)
      ));
  }

  update(role) {
    return this.http.put<any>(this.baseUrl + '/' + role.id,
      JSON.stringify(
        convertRoleToJSON(role))).pipe(mergeMap(result => this.currentDataService.updateCurrentUserRoles()));
  }

  getAdditionalInfo(id) {
  }

  getFromResponse(requestResult) {
    return requestResult.content;
  }

  getTotalCount(requestResult) {
    return requestResult.length;
  }

  getAllWithPaging(page, size, filters: Map<string, string>, sortField?, sortDirection?): Observable<any> {
    return this.currentDataService.getRolesWithPermissionsForCurrentEntity().pipe(map(res => {
      let filteredResult = [];
      if (filters.size > 0) {
        Array.from(filters.keys()).forEach(filter => {
          filteredResult.push(...res.filter(role =>
            String(role[filter]).toLowerCase().includes(String(filters.get(filter)).toLowerCase())
          ));
        });
      } else {
        filteredResult = res;
      }
      return {
        content: filteredResult.sort((role1, role2) => sortDirection === 'asc' ?
          Number(role1[sortField] > role2[sortField]) : Number(role1[sortField] < role2[sortField])),
        totalElements: filteredResult.length
      };
    }));
  }

}

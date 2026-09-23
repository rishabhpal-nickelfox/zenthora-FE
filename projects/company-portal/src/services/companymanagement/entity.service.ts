import {map, mergeMap} from 'rxjs/operators';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ObjectOperatingService} from '../../../../common/src/lib/utils/object-operating.service';
import {CompanyCurrentDataService} from '../company-current-data.service';
import {
  AuthorizationMessagePlaceholder,
  CustomerPortalSettings,
  EntityModel,
  GeneralSettings,
  MailingMethodSettings,
  PaymentSettings,
  TemplateSettings
} from '../../app/models/companymanage/entity.model';
import {Observable, of} from "rxjs";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../common/src/lib/utils/base-settings-provider.service';
import {isDefined} from '../../../../common/src/lib/helpers/object.helper';
import {CompanyServiceUrl} from "../company-service-url";
import {PaymentMethodTypeEnum} from "../../../../common/src/lib/enums/sale/payment-method-type.enum";
import {FullTemplate} from "@eps/common";

@Injectable()
export class EntityService extends ObjectOperatingService {

  constructor(protected http: HttpClient, protected currentDataService: CompanyCurrentDataService, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.ENTITY}`;
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(entityResult => EntityModel.fromJSON(entityResult));
  }

  create(entity, administrator) {
    return this.http.post<any>(this.baseUrl,
      JSON.stringify(EntityModel.toJSON(entity, administrator?.id)));
  }

  update(entity, administrator) {
    return this.http.put<any>(`${this.baseUrl}/${entity.id}`,
      JSON.stringify(EntityModel.toJSON(entity, administrator?.id)));
  }

  save(entity, administrator) {
    return this.saveEntity(entity, administrator).pipe(mergeMap(result => this.currentDataService.updateCurrentUserRoles()));
  }

  private saveEntity(entity, administrator) {
    if (entity.id) {
      return this.update(entity, administrator);
    } else {
      return this.create(entity, administrator);
    }
  }

  getEntities(rolesGroupedByEntitiesMap: Map<any, any>) {
    const entityIds = Array.from(rolesGroupedByEntitiesMap.keys());
    const entities: EntityModel[] = [];
    entityIds.forEach(entityId => {
      const roles = rolesGroupedByEntitiesMap.get(entityId);
      entities.push(roles[0].entity);
    });
    return entities;
  }

  getAdditionalInfo(id): Observable<any> {
    return isDefined(id) ? this.http.get<any>(`${this.baseUrl}/${id}`).pipe(map(requestResults =>
      EntityModel.fromJSON(requestResults))) : of(new EntityModel());
  }

  enable(id) {
    return this.http.patch<any>(this.baseUrl + '/' + id + '/enable', null);
  }

  disable(id) {
    return this.http.patch<any>(this.baseUrl + '/' + id + '/disable', null);
  }

  getGeneralSettings(): Observable<GeneralSettings> {
    return this.http.get<any>(this.baseUrl + '/current/general').pipe(map(result => GeneralSettings.fromJSON(result)));
  }

  updateGeneralSettings(settings: GeneralSettings): Observable<any> {
    return this.http.put(this.baseUrl + '/current/general', GeneralSettings.toJSON(settings));
  }

  getCustomerPortalSettings(): Observable<CustomerPortalSettings> {
    return this.http.get<any>(this.baseUrl + '/current/customer-portal').pipe(map(result => CustomerPortalSettings.fromJSON(result)));
  }

  updateCustomerPortalSettings(settings: CustomerPortalSettings): Observable<any> {
    return this.http.put(this.baseUrl + '/current/customer-portal', CustomerPortalSettings.toJSON(settings));
  }

  getTemplateSettings(): Observable<TemplateSettings> {
    return this.http.get<any>(this.baseUrl + '/current/template').pipe(map(result => TemplateSettings.fromJSON(result)));
  }

  updateTemplateSettings(settings: TemplateSettings): Observable<any> {
    return this.http.put(this.baseUrl + '/current/template', TemplateSettings.toJSON(settings));
  }

  getDefaultFullTemplate(): Observable<FullTemplate> {
    return this.http.get<FullTemplate>(this.baseUrl + '/current/template/default');
  }

  getMailingMethodSettings(): Observable<MailingMethodSettings> {
    return this.http.get<any>(this.baseUrl + '/current/mailing-method').pipe(map(result => MailingMethodSettings.fromJSON(result)));
  }

  updateMailingMethodSettings(settings: MailingMethodSettings): Observable<any> {
    return this.http.put(this.baseUrl + '/current/mailing-method', MailingMethodSettings.toJSON(settings));
  }


  getPaymentSettings(): Observable<{
    settings: PaymentSettings,
    dictionaries: {
      allowedPaymentMethodsOnVault: PaymentMethodTypeEnum[],
      authorizationMessagePlaceholders: AuthorizationMessagePlaceholder[]
    }
  }> {
    return this.http.get<any>(this.baseUrl + '/current/payment').pipe(map(result => ({
      settings: PaymentSettings.fromJSON(result),
      dictionaries: result.dictionaries
    })));
  }

  updatePaymentSettings(settings: PaymentSettings): Observable<any> {
    return this.http.put(this.baseUrl + '/current/payment', PaymentSettings.toJSON(settings));
  }
}

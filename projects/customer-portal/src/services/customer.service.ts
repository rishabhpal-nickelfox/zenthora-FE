import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";
import {ACHModel} from "../../../common/src/lib/models/sale/ach.model";
import {CreditCardModel} from "../../../common/src/lib/models/sale/credit-card.model";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {Observable, of, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {VaultErrorService} from "../../../common/src/lib/utils/errorhandler/vault-error.service";
import {CustomerPaymentMethod} from "../../../common/src/lib/models/payer/payer-payment-method.model";
import {CustomerAuthenticationService} from "./customer-authentication.service";
import {RecaptchaService} from "../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {
  EmailChangePasswordRequestModel
} from "../../../common/src/lib/models/password/email-change-password-request.model";
import {CustomerSignInResponseModel} from "../../../common/src/lib/models/payer/customer-sign-in-response.model";
import {CustomerByTokenResponseModel} from "../../../common/src/lib/models/payer/customer-by-token-response.model";
import {
  CustomerCompanyRegistrationDetailsResponseModel
} from "../../../common/src/lib/models/payer/customer-company-registration-details-response.model";
import {
  CustomerSignInPortalResponseModel
} from "../../../common/src/lib/models/payer/customer-sign-in-portal-response.model";
import {isDefined} from "../../../common/src/lib/helpers/object.helper";
import {CustomerServiceUrl} from "./customer-service-url";
import {
  AUTHENTICATION_SERVICE_TOKEN,
  BaseAuthenticationService
} from "../../../common/src/lib/services/base-authentication.service";

@Injectable()
export class CustomerService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider, @Inject(AUTHENTICATION_SERVICE_TOKEN) protected authService: BaseAuthenticationService, private vaultErrorService: VaultErrorService) {
  }

  get customerAuthService(): CustomerAuthenticationService {
    return this.authService as CustomerAuthenticationService;
  }

  get baseUrl(): string {
    return `${this.settingsProvider.apiUrl}/${CustomerServiceUrl.CUSTOMER}`;
  }

  get companyCustomerBaseUrl(): string {
    return `${this.settingsProvider.apiUrl}/${CustomerServiceUrl.COMPANY_CUSTOMER}`;
  }

  savePaymentMethod(paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel): Observable<CreditCardModel | ACHModel> {
    switch (paymentMethodType) {
      case PaymentMethodTypeEnum.CREDIT_CARD:
        return this.saveCreditCard(<CreditCardModel>paymentMethod);
      case PaymentMethodTypeEnum.ACH:
        return this.saveACH(<ACHModel>paymentMethod);
      default:
        return throwError(() => `Unsupported payment method type: ${paymentMethodType}`)
    }
  }

  getAllPaymentMethods(): Observable<{ paymentMethods: (CreditCardModel | ACHModel)[] }> {
    return this.http.get<any>(`${this.baseUrl}/payment-methods`)
      .pipe(map(response => {
        return {paymentMethods: CustomerPaymentMethod.fromJSON(response)};
      })).pipe(catchError(error => {
        if (this.vaultErrorService.is5xxVaultError(error)) {
          return of({paymentMethods: []});
        }
        return throwError(error);
      }));
  }

  getAllowedPaymentMethods(): Observable<{ paymentMethods: (CreditCardModel | ACHModel)[] }> {
    return this.http.get<any>(`${this.baseUrl}/allowed-payment-methods`)
      .pipe(map(response => {
        return {paymentMethods: CustomerPaymentMethod.fromJSON(response)};
      })).pipe(catchError(error => {
        if (this.vaultErrorService.is5xxVaultError(error)) {
          return of({paymentMethods: []});
        }
        return throwError(error);
      }));
  }


  deletePaymentMethod(paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel): Observable<void> {
    switch (paymentMethodType) {
      case PaymentMethodTypeEnum.CREDIT_CARD:
        return this.deleteCreditCard(<CreditCardModel>paymentMethod);
      case PaymentMethodTypeEnum.ACH:
        return this.deleteACH(<ACHModel>paymentMethod);
      default:
        return throwError(() => `Unsupported payment method type: ${paymentMethodType}`)
    }
  }

  register(saleKey, email: string, password: string, recaptchaToken?: string): Observable<void> {
    return this.customerAuthService.registerFromEmailSale(saleKey, email, password, recaptchaToken);
  }

  loginFromEmailSale(token: string, email: string, password: string, recaptchaToken?: string): Observable<CustomerSignInResponseModel> {
    return this.customerAuthService.loginFromEmailSale(token, email, password, recaptchaToken);
  }

  loginAndGetCompanies(email: string, password: string, recaptchaToken?: string): Observable<CustomerSignInPortalResponseModel> {
    return this.customerAuthService.loginAndGetCompanies(email, password, recaptchaToken);
  }

  logout(): void {
    this.customerAuthService.logout();
  }

  isLoggedIn(): boolean {
    return this.customerAuthService.isLoggedIn();
  }

  confirmRegistration(token: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/registration/${token}`, null);
  }

  resetPassword(email: string, recaptchaToken?: string): Observable<void> {
    let headers = new HttpHeaders({'X-Requested-With': 'XMLHttpRequest'});

    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.CUSTOMER_SEND_NEW_PASSWORD);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }

    return this.http.post<void>(`${this.baseUrl}/password/forgot`, {email: email}, {headers: headers});
  }

  emailChangePassword(token: string, changePasswordModel: EmailChangePasswordRequestModel, recaptchaToken?: string): Observable<any> {
    let headers = new HttpHeaders();

    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.CUSTOMER_CHANGE_PASSWORD);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }

    return this.http.post<void>(`${this.baseUrl}/password/change/${token}`, JSON.stringify(changePasswordModel), {headers: headers});
  }

  getCustomerByToken(token: string): Observable<CustomerByTokenResponseModel> {
    return this.http.get<CustomerByTokenResponseModel>(`${this.settingsProvider.apiUrl}/customer/key/${token}`);
  }

  getCompanyInvitationDetails(token: string): Observable<CustomerCompanyRegistrationDetailsResponseModel> {
    return this.http.get<CustomerCompanyRegistrationDetailsResponseModel>(`${this.companyCustomerBaseUrl}/invitation/${token}`);
  }

  companyNewInvitation(token: string, firstName: string, middleName: string, lastName: string, password: string, recaptchaToken?: string): Observable<{
    customerPortalEnabled: boolean
  }> {
    let headers = new HttpHeaders();

    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.CUSTOMER_COMPANY_INVITE);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }

    return this.http.post<{ customerPortalEnabled: boolean }>(`${this.companyCustomerBaseUrl}/invitation/${token}`, {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      password: password
    }, {headers: headers});
  }


  acceptCompanyInvitation(token: string, recaptchaToken?: string): Observable<void> {
    let headers = new HttpHeaders();

    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.CUSTOMER_COMPANY_INVITE);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }

    return this.http.post<void>(`${this.companyCustomerBaseUrl}/invitation/${token}/accept`, null, {headers: headers});
  }

  confirmCompanyInvitation(token: string): Observable<void> {
    return this.http.post<void>(`${this.companyCustomerBaseUrl}/invitation/${token}/confirm`, null);
  }

  getCompaniesForCurrentPayer(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/current/companies`, {withCredentials: true});
  }

  selectCompany(companyId: number): Observable<any> {
    return this.customerAuthService.selectCompany(companyId);
  }

  private saveCreditCard(creditCard: CreditCardModel): Observable<CreditCardModel> {
    return isDefined(creditCard.id) ? this.updateCreditCard(creditCard) : this.addCreditCard(creditCard);
  }

  private addCreditCard(creditCard: CreditCardModel): Observable<CreditCardModel> {
    return this.http.post<{
      id: number
    }>(`${this.baseUrl}/credit-cards`, CreditCardModel.toJSON(creditCard)).pipe(map(response => {
      creditCard.id = response.id;
      return creditCard;
    }));
  }

  private updateCreditCard(creditCard: CreditCardModel): Observable<CreditCardModel> {
    const creditCardToUpdateJSON = CreditCardModel.toJSON(creditCard);
    delete creditCardToUpdateJSON.cardNumber;
    return this.http.put<void>(`${this.baseUrl}/credit-cards/${creditCard.id}`, creditCardToUpdateJSON).pipe(map(() => creditCard));
  }

  private saveACH(achModel: ACHModel): Observable<ACHModel> {
    return isDefined(achModel.id) ? this.updateACH(achModel) : this.addACH(achModel);
  }

  private addACH(ach: ACHModel): Observable<ACHModel> {
    return this.http.post<{
      id: number
    }>(`${this.baseUrl}/achs`, ACHModel.toJSON(ach)).pipe(map(response => {
      ach.id = response.id;
      return ach;
    }));
  }

  private updateACH(ach: ACHModel): Observable<ACHModel> {
    const achToUpdateJSON = ACHModel.toJSON(ach);
    delete achToUpdateJSON.account;
    return this.http.put<void>(`${this.baseUrl}/achs/${ach.id}`, achToUpdateJSON).pipe(map(() => ach));
  }

  private deleteCreditCard(creditCard: CreditCardModel): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/credit-cards/${creditCard.id}`);
  }

  private deleteACH(ach: ACHModel): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/achs/${ach.id}`);
  }
}

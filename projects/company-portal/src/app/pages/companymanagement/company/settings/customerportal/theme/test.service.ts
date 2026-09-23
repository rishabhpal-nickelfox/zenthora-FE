import {EventEmitter, Injectable, Output} from '@angular/core';
import {GridsterConfig} from 'angular-gridster2';
import {SaleEmailTemplateLayoutCommonService} from '../../email/paymenttemplate/common/sale-email-template-layout-common.service';
import {TemplateComponent} from "@eps/common";
import { isDefined } from '../../../../../../../../../common/src/lib/helpers/object.helper';
import {HttpClient} from "@angular/common/http";
import {ObjectOperatingService} from "../../../../../../../../../common/src/lib/utils/object-operating.service";
import {CustomerServiceUrl} from "../../../../../../../../../customer-portal/src/services/customer-service-url";
import {Observable, of} from "rxjs";
import {ApiAuditModel} from "../../../../../../models/apiaudit/api-audit.model";


@Injectable({
  providedIn: 'root'
})
export class TestService extends ObjectOperatingService {
  constructor() {
    super(null as unknown as HttpClient);
  }

  get baseUrl(): string {
    return ``;
  }


  create(object: any, ...additional: any): Observable<any> {
    return undefined;
  }

  getAdditionalInfo(id, ...additional) {
  }

  getFromResponse(requestResult) {
    return requestResult.content;
  }

  update(object: any, ...additional: any): Observable<any> {
    return undefined;
  }


  getAllWithPaging(page, size, filters: Map<string, string>, sortField?, sortDirection?): Observable<any> {
   return of({
     "content": [
       {
         "docNumber": "00001",
         "docType": "Invoice",
         "last4": "1111",
         "paymentMethod": "Credit Card",
         "type": "Visa",
         "transactionTimestamp": "11/11/2111 11:11:11",
         "amount": 1.00,
         "currency": "$",
         "source": "Online",
         "success": true,
         "status": "Payment Successful",
         "authCode": "0000001",
       },
       {
         "docNumber": "00002",
         "docType": "Sale Receipt",
         "last4": "1234",
         "paymentMethod": "Credit Card",
         "otherPaymentMethodName": null,
         "type": "Mastercard",
         "transactionTimestamp": "12/12/2112 12:12:12",
         "amount": 5.00,
         "currency": "$",
         "source": "Online",
         "success": false,
         "status": "The credit card has expired.",
         "authCode": ""
       },
       {
         "docNumber": "00003",
         "docType": "Invoice",
         "last4": "0021",
         "paymentMethod": "ACH",
         "otherPaymentMethodName": null,
         "type": "Personal Checking",
         "transactionTimestamp": "10/10/2110 10:10:10",
         "amount": 1.00,
         "currency": "USD",
         "source": "EPS",
         "success": true,
         "status": "Payment Successful",
         "authCode": "AAAA"
       }
     ],
     "totalPages": 9,
     "totalElements": 172,
     "size": 20,
     "number": 0,
     "sortDirection": null,
     "sortProperty": null
   })
  }
}

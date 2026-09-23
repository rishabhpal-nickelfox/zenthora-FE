import {NgModule} from '@angular/core';

import {CompanyModule} from './company/company.module';

@NgModule({
  imports: [
    CompanyModule
  ],
  exports: [
    CompanyModule
  ]
})
export class CompanyManagementModule {
}

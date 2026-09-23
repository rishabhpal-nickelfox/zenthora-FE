import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CustomerAuthPageComponent} from './customer-auth-page.component';

const routes: Routes = [{
  path: '',
  component: CustomerAuthPageComponent,
  runGuardsAndResolvers: 'always'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerAuthPageRoutingModule {
}

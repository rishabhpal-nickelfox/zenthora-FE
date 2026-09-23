import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../../common/src/lib/shared.module';
import {NbSelectModule} from '@nebular/theme';
import {WebhookErrorComponent} from "./webhook-error.component";
import {WebhookErrorEventFilterComponents} from "./filter/webhook-error-event-filter.components";

@NgModule({
  declarations: [
    WebhookErrorComponent,
    WebhookErrorEventFilterComponents
  ],
  imports: [
    SharedModule,
    NbSelectModule
  ],
  exports: [
    WebhookErrorComponent
  ],
  providers: []
})

export class WebhookErrorModule {
}

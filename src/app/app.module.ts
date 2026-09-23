import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from "../../environments/environment";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {
  NbActionsModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbLayoutModule,
  NbStatusService
} from "@nebular/theme";
import {ToastrModule} from "ngx-toastr";
import {DragulaModule} from "ng2-dragula";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TypeaheadModule} from "ngx-bootstrap/typeahead";
import {QuillModule} from "ngx-quill";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgbModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-left',
      preventDuplicates: true
    }),
    DragulaModule.forRoot(),
    NbLayoutModule,
    NbActionsModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbCheckboxModule,
    NbEvaIconsModule,
    TypeaheadModule.forRoot(),
    QuillModule.forRoot(),
    NbDialogModule.forRoot(),
  ],
  providers: [NbStatusService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

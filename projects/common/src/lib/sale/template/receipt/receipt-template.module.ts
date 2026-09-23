import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NbButtonModule, NbDialogModule, NbIconModule} from '@nebular/theme';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {ComponentModule} from '../../../components/component.module';
import {ReceiptTemplateEditorComponent} from './receipt-template-editor.component';
import {ReceiptTemplateBlockEditComponent} from './receipt-template-block-edit.component';
import {ReceiptTemplatePreviewBlockComponent} from './receipt-template-preview-block.component';
import {ReceiptTemplateMessageEditComponent} from './receipt-template-message-edit.component';

@NgModule({
  declarations: [
    ReceiptTemplateEditorComponent,
    ReceiptTemplateBlockEditComponent,
    ReceiptTemplatePreviewBlockComponent,
    ReceiptTemplateMessageEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    ComponentModule,
    NbIconModule,
    NbDialogModule.forChild(),
    NbButtonModule
  ],
  exports: [
    ReceiptTemplateEditorComponent
  ]
})

export class ReceiptTemplateModule {
}

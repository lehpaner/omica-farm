import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { adminRoutes } from './admin.routes';

import { AdminComponent } from './admin.component';
import { AdminDocsComponent } from './admindoc/doc-manage.component';
import { AdminDocComponent } from './admindoc/doc-edit.component';
import { ListaUtentiComponent } from './utenti/utenti.component';
import { UserFormComponent } from './utenti/utente-edit.component';
import { AdminGestioneComponent } from './admingestione/admingestione.component';
import { FormEditorComponent } from './admingestione/form-editor.component';
import { SyncFlowComponent } from './sync/sync.component';
import { NodeListComponent, NodeEditComponent, NodeViewComponent, NodeComponent, NodeListViewComponent } from './nodes';


import { UserService } from './services/admin.user.service';
import { AdminDocsService } from './services/admin.docs.service';
import { SyncQuestionariService } from './services/admin.sync.service';
import { ProcessorItemComponent } from './sync/processor-item.component';
import { FlowViewComponent } from './sync/flow-view.component';

import { DocumentationToolsModule } from '../common/documentation-tools';
import { MatNativeDateModule, MatTabsModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { CovalentMarkdownModule } from '@covalent/markdown';
import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { SharedModule } from '../shared/shared.module';
import { ToolbarModule } from '../common/toolbar/toolbar.module';

@NgModule({
  declarations: [
      AdminComponent,
      AdminDocsComponent,
      ListaUtentiComponent,
      AdminGestioneComponent,
      FormEditorComponent,
      AdminDocComponent,
      UserFormComponent,
      SyncFlowComponent,
      ProcessorItemComponent,
      FlowViewComponent,
      NodeListComponent,
      NodeEditComponent,
      NodeViewComponent,
      NodeListViewComponent,
      NodeComponent
  ],
  imports: [
    /** Angular Modules */
      CommonModule,
      FormsModule,
      SharedModule,
      MatDatepickerModule,
      MatNativeDateModule,
      CovalentTextEditorModule,
      CovalentDynamicFormsModule,
      CovalentMarkdownModule,
      CovalentHighlightModule,
      DocumentationToolsModule,
      adminRoutes,
      ToolbarModule,
  ],
  providers: [
      UserService,
      AdminDocsService,
      SyncQuestionariService,
  ],
})
export class AdminModule {}

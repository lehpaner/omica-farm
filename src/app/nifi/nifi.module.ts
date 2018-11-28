import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { nifiRoutes } from './nifi.routes';

import { NifiComponent } from './nifi.component';
//import { NodeListComponent, NodeComponent, NodeViewComponent, NodeEditComponent, NodeListViewComponent} from './nodes'

import { SyncFlowComponent } from './sync-flow/sync-flow.component';
import { FlowViewComponent } from './sync-flow/flow-view.component';

import { NifiIntegrationService } from './services/nifi-integration.service';

import { DocumentationToolsModule } from '../common/documentation-tools';
import { SharedModule } from '../shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';
import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { ToolbarModule } from '../common/toolbar/toolbar.module';

@NgModule({
  declarations: [
    SyncFlowComponent,
    NifiComponent,
    FlowViewComponent,
  ],
  imports: [
    /** Angular Modules */
    CommonModule,
    SharedModule,
    DocumentationToolsModule,
    MatDatepickerModule,
    CovalentHighlightModule,
    CovalentMarkdownModule,
    CovalentTextEditorModule,
    CovalentDynamicFormsModule,
    nifiRoutes,
    ToolbarModule,
  ],
  providers: [
    NifiIntegrationService
  ],
})
export class NifiModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NodesComponent } from './nodes.component'
import { NodesRoutes } from './nodes.routes';
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
    NodesComponent
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
    NodesRoutes,
    ToolbarModule,
  ],
  providers: [
  ],
})
export class AdminModule {}
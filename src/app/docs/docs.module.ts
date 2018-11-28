import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { docsRoutes } from './docs.routes';

import { AnacDocsComponent } from './docs.component';
import { DocsOverviewComponent } from './overview/overview.component';
import { DocsConsultazioneComponent } from './consultazione/consultazione.component';
import { DocsGestioneComponent } from './gestione/gestione.component';


import { DocumentationToolsModule } from '../common/documentation-tools';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { CovalentCommonModule } from '@covalent/core/common';
import { CovalentMediaModule } from '@covalent/core/media';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentLoadingModule } from '@covalent/core/loading';

import { ToolbarModule } from '../common/toolbar/toolbar.module';

@NgModule({
  declarations: [
    AnacDocsComponent,
    DocsOverviewComponent,
    DocsConsultazioneComponent,
    DocsGestioneComponent,
  ],
  imports: [
    /** Angular Modules */
    CommonModule,
    /** Material Modules */
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    /** Covalent Modules */
    CovalentCommonModule,
    CovalentLayoutModule,
    CovalentMediaModule,
    CovalentHighlightModule,
    DocumentationToolsModule,
    CovalentLoadingModule,
    docsRoutes,
    ToolbarModule,
  ],
})
export class DocsModule {}

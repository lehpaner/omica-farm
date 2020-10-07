import { Type } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { HttpClientModule } from '@angular/common/http';

import { DocumentPageComponent } from './document-page/document-page.component';
import { DocumentPageLoaderService } from './document-page/document-page.service';

import { AreaCalendar } from './contributions/omica-conribution.component';
import { OmicaMapEditor } from './omica-map-editor/omica-map-editor.component';

@NgModule({
    imports: [
      CommonModule, 
      PortalModule, 
      HttpClientModule],
    declarations: [
      AreaCalendar, 
      OmicaMapEditor, 
      DocumentPageComponent,
    ],
    providers: [
      DocumentPageLoaderService,
    ],
    exports: [AreaCalendar, OmicaMapEditor, DocumentPageComponent],
  })
  export class OmicaComponentsModule {}
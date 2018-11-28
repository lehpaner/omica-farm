import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { CovalentCommonModule } from '@covalent/core/common';
import { CovalentSearchModule } from '@covalent/core/search';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentMediaModule } from '@covalent/core/media';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentExpansionPanelModule } from '@covalent/core';
import { CovalentStepsModule } from '@covalent/core';
import { CovalentJsonFormatterModule } from '@covalent/core';
import { CovalentFileModule , TdFileService, IUploadOptions } from '@covalent/core/file';
import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';



import { IscrizioneComponent } from './iscrizione.component';
import { IscrizioneFormComponent } from './form/form.component';
import { AllegatiComponent } from './allegati/allegati.component';
import { iscrizioneRoutes } from './iscrizione.routes';

import { IscrizioneService} from './services/iscrizione.service';

export { IscrizioneComponent, IscrizioneFormComponent, IscrizioneService};
import { ToolbarModule } from '../common/toolbar/toolbar.module';

import { AnacDateAdapter, ANAC_DATE_FORMATS } from '../common/date-adapter';

@NgModule({
  declarations: [
    IscrizioneComponent,
    IscrizioneFormComponent,
    AllegatiComponent,
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    // angular modules
    CommonModule,
    FormsModule,
    RouterModule,
    ToolbarModule,
    // material modules
    MatSnackBarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    // covalent modules
    CovalentLoadingModule,
    CovalentDialogsModule,
    CovalentMediaModule,
    CovalentLayoutModule,
    CovalentSearchModule,
    CovalentCommonModule,
    CovalentDynamicFormsModule,
    CovalentExpansionPanelModule,
    CovalentStepsModule,
    CovalentJsonFormatterModule,
    CovalentFileModule,
    // extra
    iscrizioneRoutes,
  ], // modules needed to run this module
  providers: [
    IscrizioneService,
    TdFileService,
    { provide: DateAdapter, useClass: AnacDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: ANAC_DATE_FORMATS },
  ],
})
export class IscrizioneModule {}

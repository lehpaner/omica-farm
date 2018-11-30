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



import { FarmsComponent } from './farms.component';
import { FarmViewComponent } from './view/farm.view.component'
import { FarmEditComponent } from './edit/farm.edit.component'
import { farmsRoutes } from './farms.routes';
import { FarmsService} from './services/farms.service';
import { ToolbarModule } from '../common/toolbar/toolbar.module';
import { AnacDateAdapter, ANAC_DATE_FORMATS } from '../common/date-adapter';

import { IscrizioneFormComponent } from './form/form.component';
import { DocsComponent } from './docs/docs.component';

@NgModule({
  declarations: [
    FarmsComponent,
    FarmEditComponent,
    FarmViewComponent,
    IscrizioneFormComponent,
    DocsComponent,
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
    farmsRoutes,
  ], // modules needed to run this module
  providers: [
    FarmsService,
    TdFileService,
    { provide: DateAdapter, useClass: AnacDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: ANAC_DATE_FORMATS },
  ],
})
export class FarmsModule {}

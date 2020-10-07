import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';
import { ModalModule, TabsModule, TooltipModule, BsDropdownModule } from 'ngx-bootstrap';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';

import { MainRoutingModule } from './main-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/primeng';

import { BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { DocumentationComponent } from './documentation/docs.component';
import { ExternalComponent } from './third-parties/external.component';
import { LandsComponent } from './land-admnistration/lands.component';
import { LandComponent } from './land-admnistration/land.component';
import { OmicaMap } from './common/omica-map'

import { LandService } from './services/land-service';
import { OmicaLandList } from './common/omica-land-list';

import { ItemPanelModule } from '../shared/omica-components/item-panel/item-panel.module';
import { OmicaComponentsModule } from '../shared/omica-components/omica-components.module';

NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TableModule,
        PaginatorModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        CountoModule,
        NgxChartsModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        ItemPanelModule,
        OmicaComponentsModule,
    ],
    declarations: [
        DashboardComponent,
        HomeComponent,
        DocumentationComponent,
        ExternalComponent,
        LandsComponent,
        LandComponent,
        OmicaMap,
        OmicaLandList
    ],
    providers: [
        LandService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale }
    ]
})
export class MainModule { }

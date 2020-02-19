import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { MonitorinigStationTypesServiceProxy, MonitorinigStationTypeDto , MonitorinigStationTypeDtoType } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditMonitorinigStationTypeModalComponent } from './create-or-edit-monitorinigStationType-modal.component';
import { ViewMonitorinigStationTypeModalComponent } from './view-monitorinigStationType-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './monitorinigStationTypes.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class MonitorinigStationTypesComponent extends AppComponentBase {

    @ViewChild('createOrEditMonitorinigStationTypeModal') createOrEditMonitorinigStationTypeModal: CreateOrEditMonitorinigStationTypeModalComponent;
    @ViewChild('viewMonitorinigStationTypeModalComponent') viewMonitorinigStationTypeModal: ViewMonitorinigStationTypeModalComponent;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    typeFilter = -1;
    maxSensorsNumbersFilter : number;
		maxSensorsNumbersFilterEmpty : number;
		minSensorsNumbersFilter : number;
		minSensorsNumbersFilterEmpty : number;

    monitoringStationType = MonitorinigStationTypeDtoType;



    constructor(
        injector: Injector,
        private _monitorinigStationTypesServiceProxy: MonitorinigStationTypesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getMonitorinigStationTypes(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._monitorinigStationTypesServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
            this.typeFilter,
            this.maxSensorsNumbersFilter == null ? this.maxSensorsNumbersFilterEmpty: this.maxSensorsNumbersFilter,
            this.minSensorsNumbersFilter == null ? this.minSensorsNumbersFilterEmpty: this.minSensorsNumbersFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createMonitorinigStationType(): void {
        this.createOrEditMonitorinigStationTypeModal.show();
    }

    deleteMonitorinigStationType(monitorinigStationType: MonitorinigStationTypeDto): void {
        this.message.confirm(
            '',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._monitorinigStationTypesServiceProxy.delete(monitorinigStationType.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._monitorinigStationTypesServiceProxy.getMonitorinigStationTypesToExcel(
        this.filterText,
            this.nameFilter,
            this.typeFilter,
            this.maxSensorsNumbersFilter == null ? this.maxSensorsNumbersFilterEmpty: this.maxSensorsNumbersFilter,
            this.minSensorsNumbersFilter == null ? this.minSensorsNumbersFilterEmpty: this.minSensorsNumbersFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}

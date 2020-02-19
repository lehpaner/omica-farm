import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { SensorMappingsServiceProxy, SensorMappingDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditSensorMappingModalComponent } from './create-or-edit-sensorMapping-modal.component';
import { ViewSensorMappingModalComponent } from './view-sensorMapping-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './sensorMappings.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class SensorMappingsComponent extends AppComponentBase {

    @ViewChild('createOrEditSensorMappingModal') createOrEditSensorMappingModal: CreateOrEditSensorMappingModalComponent;
    @ViewChild('viewSensorMappingModalComponent') viewSensorMappingModal: ViewSensorMappingModalComponent;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    descriptionFilter = '';
    maxMountingDateFilter : moment.Moment;
		minMountingDateFilter : moment.Moment;
    maxDismountingDateFilter : moment.Moment;
		minDismountingDateFilter : moment.Moment;
    dataColumnNameFilter = '';
    dataTableNameFilter = '';
        monitoringStationNameFilter = '';
        sensorNameFilter = '';




    constructor(
        injector: Injector,
        private _sensorMappingsServiceProxy: SensorMappingsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getSensorMappings(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._sensorMappingsServiceProxy.getAll(
            this.filterText,
            this.descriptionFilter,
            this.maxMountingDateFilter,
            this.minMountingDateFilter,
            this.maxDismountingDateFilter,
            this.minDismountingDateFilter,
            this.dataColumnNameFilter,
            this.dataTableNameFilter,
            this.monitoringStationNameFilter,
            this.sensorNameFilter,
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

    createSensorMapping(): void {
        this.createOrEditSensorMappingModal.show();
    }

    deleteSensorMapping(sensorMapping: SensorMappingDto): void {
        this.message.confirm(
            '',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._sensorMappingsServiceProxy.delete(sensorMapping.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._sensorMappingsServiceProxy.getSensorMappingsToExcel(
        this.filterText,
            this.descriptionFilter,
            this.maxMountingDateFilter,
            this.minMountingDateFilter,
            this.maxDismountingDateFilter,
            this.minDismountingDateFilter,
            this.dataColumnNameFilter,
            this.dataTableNameFilter,
            this.monitoringStationNameFilter,
            this.sensorNameFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}

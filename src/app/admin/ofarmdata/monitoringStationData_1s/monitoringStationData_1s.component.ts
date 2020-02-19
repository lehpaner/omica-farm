import { Component, ElementRef, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { MonitoringStationData_1sServiceProxy, MonitoringStationData_1Dto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditMonitoringStationData_1ModalComponent } from './create-or-edit-monitoringStationData_1-modal.component';
import { ViewMonitoringStationData_1ModalComponent } from './view-monitoringStationData_1-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './monitoringStationData_1s.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class MonitoringStationData_1sComponent extends AppComponentBase implements OnInit{

    @ViewChild('createOrEditMonitoringStationData_1Modal') createOrEditMonitoringStationData_1Modal: CreateOrEditMonitoringStationData_1ModalComponent;
    @ViewChild('viewMonitoringStationData_1ModalComponent') viewMonitoringStationData_1Modal: ViewMonitoringStationData_1ModalComponent;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    //PAOLO
    @ViewChild('DataChart') DataChart: ElementRef;

    selectedDateInterval: number;
    selectedDateRange: Date[] = [moment().add(-7, 'days').startOf('day').toDate(), moment().endOf('day').toDate()];
    defaultStartDate: Date = moment().add(-7, 'days').startOf('day').toDate();
    defaultEndDate: Date = moment().endOf('day').toDate();

    // MONITORING STATION DATA
    loadingIncomeMonitoringStation = false;
    incomeMonitoringStationHasData = false;
    incomeMonitoringStationData: any = [];

    loadingIncomeMonitoringStationAll = false;
    incomeMonitoringStationDataAll: any = [];
    incomeMonitoringStationHasDataAll: any = [];
    
    incomeSoilTemperatureData: any = [];
    incomeSoilTemperatureHasData: any = [];

    loading = false;
    all_records: any;

    advancedFiltersAreShown = false;
    filterText = '';
    maxlatitudeFilter : number;
		maxlatitudeFilterEmpty : number;
		minlatitudeFilter : number;
		minlatitudeFilterEmpty : number;
    maxlongitudeFilter : number;
		maxlongitudeFilterEmpty : number;
		minlongitudeFilter : number;
		minlongitudeFilterEmpty : number;
        maxTimeFilter: moment.Moment;
		minTimeFilter : moment.Moment;
    maxBatteryLevelFilter : number;
		maxBatteryLevelFilterEmpty : number;
		minBatteryLevelFilter : number;
		minBatteryLevelFilterEmpty : number;
    maxAirTemperatureFilter : number;
		maxAirTemperatureFilterEmpty : number;
		minAirTemperatureFilter : number;
		minAirTemperatureFilterEmpty : number;
    maxSoilTemperatureFilter : number;
		maxSoilTemperatureFilterEmpty : number;
		minSoilTemperatureFilter : number;
		minSoilTemperatureFilterEmpty : number;


    constructor(
        injector: Injector,
        private _monitoringStationData_1sServiceProxy: MonitoringStationData_1sServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
        }

    init(): void {
         
    }

    ngOnInit(): void {
        this.init();
    }
    //PAOLO

    getMonitoringStationDataByDate_1(date0: any, date1: any): void {
        
        //if (!dates || !dates[0] || !dates[1]) {
        //    return;
        //}

        this.loading = true;
        // date0: moment.Moment;
        //date0 = moment('2018-11-23');
        //var date1: moment.Moment;
        //date1 = moment('2019-11-23');
        
        //console.log(date0);

        this._monitoringStationData_1sServiceProxy.getAllByDate(
            date0,
            date1
        )
            .subscribe(result => {

                //console.log("ALL RECORDS");
                //console.log(result.items);
                //this.all_records = result.items;
                //LOAD AIR TEPERATURE DATA
                this.incomeMonitoringStationDataAll = this.normalizeMonitoringStationData(result.items);
                this.incomeMonitoringStationHasDataAll = _.filter(this.incomeMonitoringStationDataAll[0].series, data => data.value > 0).length > 0;

                //LOAD SOIL MOISTURE DATA
                this.incomeSoilTemperatureData = this.normalizeSoilTemperatureData(result.items);
                this.incomeSoilTemperatureHasData = _.filter(this.incomeSoilTemperatureData[0].series, data => data.value > 0).length > 0;

                console.log(this.incomeMonitoringStationDataAll);
                console.log("SOIL");
                console.log(this.incomeSoilTemperatureData);
                this.loading = false;
            });

     
    }
    
    getMonitoringStationData_1s(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this.loading = true;

        this._monitoringStationData_1sServiceProxy.getAll(
            this.filterText,
            this.maxlatitudeFilter == null ? this.maxlatitudeFilterEmpty : this.maxlatitudeFilter,
            this.minlatitudeFilter == null ? this.minlatitudeFilterEmpty : this.minlatitudeFilter,
            this.maxlongitudeFilter == null ? this.maxlongitudeFilterEmpty : this.maxlongitudeFilter,
            this.minlongitudeFilter == null ? this.minlongitudeFilterEmpty : this.minlongitudeFilter,
            this.maxTimeFilter,
            this.minTimeFilter,
            this.maxBatteryLevelFilter == null ? this.maxBatteryLevelFilterEmpty : this.maxBatteryLevelFilter,
            this.minBatteryLevelFilter == null ? this.minBatteryLevelFilterEmpty : this.minBatteryLevelFilter,
            this.maxAirTemperatureFilter == null ? this.maxAirTemperatureFilterEmpty : this.maxAirTemperatureFilter,
            this.minAirTemperatureFilter == null ? this.minAirTemperatureFilterEmpty : this.minAirTemperatureFilter,
            this.maxSoilTemperatureFilter == null ? this.maxSoilTemperatureFilterEmpty : this.maxSoilTemperatureFilter,
            this.minSoilTemperatureFilter == null ? this.minSoilTemperatureFilterEmpty : this.minSoilTemperatureFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();

            this.incomeMonitoringStationData = result.items;
            console.log(result.items);
            this.incomeMonitoringStationData = this.normalizeMonitoringStationData(result.items);
            this.incomeMonitoringStationHasData = _.filter(this.incomeMonitoringStationData[0].series, data => data.value > 0).length > 0;

            //this.incomeMonitoringStationHasData = false;
            console.log(this.incomeMonitoringStationData);
            this.loading = false;
        });
    }

    normalizeMonitoringStationData(data): any {
        const chartData = [];

        var time = _.map(data, _.property('monitoringStationData_1.time._i'));
        var airTemperature = _.map(data, _.property('monitoringStationData_1.airTemperature'));
       
        for (let i = 0; i < data.length; i++) {

            chartData.push({
               'name': time[i],
               'value': airTemperature[i]
            });
        }

        return [{
            name: '',
            series: chartData
        }];
    }

    normalizeSoilTemperatureData(data): any {
        const chartData = [];

        var time = _.map(data, _.property('monitoringStationData_1.time._i'));
        var soilTemperature = _.map(data, _.property('monitoringStationData_1.soilTemperature'));


        for (let i = 0; i < data.length; i++) {

            chartData.push({
                'name': time[i],
                'value': soilTemperature[i]
            });
        }

        return [{
            name: '',
            series: chartData
        }];
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createMonitoringStationData_1(): void {
        this.createOrEditMonitoringStationData_1Modal.show();
    }

    deleteMonitoringStationData_1(monitoringStationData_1: MonitoringStationData_1Dto): void {
        this.message.confirm(
            '',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._monitoringStationData_1sServiceProxy.delete(monitoringStationData_1.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._monitoringStationData_1sServiceProxy.getMonitoringStationData_1sToExcel(
        this.filterText,
            this.maxlatitudeFilter == null ? this.maxlatitudeFilterEmpty: this.maxlatitudeFilter,
            this.minlatitudeFilter == null ? this.minlatitudeFilterEmpty: this.minlatitudeFilter,
            this.maxlongitudeFilter == null ? this.maxlongitudeFilterEmpty: this.maxlongitudeFilter,
            this.minlongitudeFilter == null ? this.minlongitudeFilterEmpty: this.minlongitudeFilter,
            this.maxTimeFilter,
            this.minTimeFilter,
            this.maxBatteryLevelFilter == null ? this.maxBatteryLevelFilterEmpty: this.maxBatteryLevelFilter,
            this.minBatteryLevelFilter == null ? this.minBatteryLevelFilterEmpty: this.minBatteryLevelFilter,
            this.maxAirTemperatureFilter == null ? this.maxAirTemperatureFilterEmpty: this.maxAirTemperatureFilter,
            this.minAirTemperatureFilter == null ? this.minAirTemperatureFilterEmpty: this.minAirTemperatureFilter,
            this.maxSoilTemperatureFilter == null ? this.maxSoilTemperatureFilterEmpty: this.maxSoilTemperatureFilter,
            this.minSoilTemperatureFilter == null ? this.minSoilTemperatureFilterEmpty: this.minSoilTemperatureFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}

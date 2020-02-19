import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FarmsServiceProxy, FarmDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditFarmModalComponent } from './create-or-edit-farm-modal.component';
import { ViewFarmModalComponent } from './view-farm-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule, NgbTabsetModule, NgbTabset, NgbTab, NgbTabContent, NgbTabTitle, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule } from 'ngx-bootstrap';

import { MapLoaderService } from '../../../shared/common/map/map.loader';

declare var google: any;

@Component({
    templateUrl: './farms.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
    styleUrls: ['../../../shared/common/map/map.loader.css']
})



export class FarmsComponent extends AppComponentBase implements OnInit {

    @ViewChild('createOrEditFarmModal') createOrEditFarmModal: CreateOrEditFarmModalComponent;
    @ViewChild('viewFarmModalComponent') viewFarmModal: ViewFarmModalComponent;
    @ViewChild('entityTypeHistoryModal') entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('map') mapElement: any;
    //map: google.maps.Map;
    public map: any = { lat: 51.678418, lng: 7.809007 };
    latitude: number;
    longitude: number;
    lazyLoadEvent: LazyLoadEvent;
    

    advancedFiltersAreShown = false;
	filterText = '';
    nameFilter = '';
    descriptionFilter = '';
    cityFilter = '';

    records: any;
	
	_entityTypeFullName = 'OFarmDemo.Ofarm.Farm';
    entityHistoryEnabled = false;


    constructor(
        injector: Injector,
        private _farmsServiceProxy: FarmsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }
	
    ngOnInit(): void {
        this.entityHistoryEnabled = this.setIsEntityHistoryEnabled();
        //this.myDataTable.nativeElement.dataTable({
        //    pagingType: 'full_numbers'
        //});
       
        //this.dataTable = $(this.table.nativeElement);
        //this.dataTable.DataTable();
        this.getFarms();
        console.log("ON INIT");
        //this.getFarms(this.lazyLoadEvent);
        
    }

    private setIsEntityHistoryEnabled(): boolean {
        let customSettings = (abp as any).custom;
        return customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }
	
    getFarms(event?: LazyLoadEvent) {
        //event.sortField = "farm.name";
        //event.sortOrder = -1;
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        console.log("EVENT");
        console.log(event);
        console.log("EVENT SORT FIELD");
        //console.log(event.sortField);
        this.primengTableHelper.showLoadingIndicator();
        console.log("SORTING");
        //console.log(this.primengTableHelper.getSorting(this.dataTable));
        var sorting = "farm.name";
        console.log("this.dataTable");
        console.log(this.dataTable);
        console.log("this.dataTable.sortField");
        console.log(this.dataTable.sortField);
        //this.dataTable.first;
        //if (this.primengTableHelper.getSorting(this.dataTable) != null || this.primengTableHelper.getSorting(this.dataTable) != undefined) {
        //    sorting = this.primengTableHelper.getSorting(this.dataTable);
        //}
        //console.log(sorting);

        this._farmsServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
            this.descriptionFilter,
            this.cityFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            //sorting,
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            //PAOLO
            this.appSession.userId
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
            //PAOLO
            this.records = result.items;
            console.log(this.records);
            });

        console.log("END GET FARM");

    }

    reloadPage(): void {
        console.log("RELOAD PAGE");
        this.paginator.changePage(this.paginator.getPage());

        console.log("END RELOAD PAGE");
    }

    createFarm(): void {
        this.createOrEditFarmModal.show();
    }
	
    showHistory(farm: FarmDto): void {
        this.entityTypeHistoryModal.show({
            entityId: farm.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: ''
        });
    }

    deleteFarm(farm: FarmDto): void {
        this.message.confirm(
            '',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._farmsServiceProxy.delete(farm.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

	exportToExcel(): void {
        this._farmsServiceProxy.getFarmsToExcel(
		this.filterText,
        this.nameFilter,
        this.descriptionFilter,
        this.cityFilter
		)
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}

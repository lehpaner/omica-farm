import { AfterViewInit, Injector, ViewEncapsulation, OnInit, Component, ViewChild} from '@angular/core';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from '@shared/common/app-component-base';
import { LandService } from '../services/land-service';
import {FarmDto, ListResultDtoOfFarmDto, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';

import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { NotifyService } from 'abp-ng2-module/dist/src/notify/notify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: './lands.component.html',
    styleUrls: ['./lands.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class LandsComponent extends AppComponentBase implements OnInit {

    @ViewChild('dataTable') dataTable: Table;
   // @ViewChild('paginator') paginator: Paginator;
    
    advancedFiltersAreShown = false;
	filterText = '';
    nameFilter = '';
    descriptionFilter = '';
    cityFilter = '';

    records: Array<FarmDto> = [];
    selectedFarm:FarmDto;
    
    _entityTypeFullName = 'OFarmDemo.Ofarm.Farm';
    entityHistoryEnabled = false;

    constructor (injector:Injector, private _landsService: LandService,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private router: Router){
        super(injector);
        this._landsService.selecteLand.subscribe(farm => { 
            this.selectedFarm = farm;
            console.log("LandsComponent::selectedLand change to", farm);
        });
    }

    ngOnInit(): void {
        this.getData();
    }

    getData(event?: LazyLoadEvent) {

//        if (this.primengTableHelper.shouldResetPaging(event)) {
//            this.paginator.changePage(0);
 //           return;
 //       }

        console.log("Event:" + event);
        this.primengTableHelper.showLoadingIndicator();

        var sorting = "farm.name";
        this._landsService.landsGet().subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.items.length;
            this.primengTableHelper.hideLoadingIndicator();
            this.records = result.items;
            console.log(this.records);
            });

        console.log("END GET FARM");

    }
    reloadPage(): void {
        console.log("RELOAD PAGE");
   //     this.paginator.changePage(this.paginator.getPage());

        console.log("END RELOAD PAGE");
    }
    editFarm(farm:FarmDto) {

    }
    viewFarm(land:FarmDto) {
        console.log(land);
        this._landsService.selectFarm(land);
        this.router.navigate(['/app/main/lands/'+land.id]);
    }
    createFarm(): void {
        console.log("CREATE FARM");
   //     this.createOrEditFarmModal.show();
    }

    deleteFarm(farm: FarmDto): void {
        this.message.confirm(
            '',
            (isConfirmed) => {
                if (isConfirmed) {
 //                   this._landsService.delete(farm.id)
 //                       .subscribe(() => {
 //                           this.reloadPage();
 //                           this.notify.success(this.l('SuccessfullyDeleted'));
 //                       });
                }
            }
        );
    }
    
}
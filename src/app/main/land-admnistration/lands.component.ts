import { AfterViewInit, Injector, ViewEncapsulation, OnInit, Component, ViewChild} from '@angular/core';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from '@shared/common/app-component-base';
import { LandService } from '../services/land-service';
import {FarmDto, ListResultDtoOfFarmDto, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';

import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { NotifyService } from 'abp-ng2-module/dist/src/notify/notify.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './lands.component.html',
    styleUrls: ['./lands.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class LandsComponent extends AppComponentBase implements OnInit {
    
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
        this._landsService.selecteLand.subscribe(land => { 
            this.selectedFarm = land;
            console.log("LandsComponent::selectedLand change to", land);
        });
    }

    ngOnInit(): void {
        this.getData();
    }

    getData(event?: LazyLoadEvent) {

        console.log("Event:" + event);
        this._landsService.landsGet().subscribe(result => {
            this.records = result.items;
 //           console.log("getData", this.records);
            });

//       console.log("END GET FARM");

    }
    reloadPage(): void {
        console.log("RELOAD PAGE");

        console.log("END RELOAD PAGE");
    }
    editFarm(farm:FarmDto) {

    }
    viewFarm(land:FarmDto) {
        console.log(land);
        this.router.navigate(['/app/main/land/'+land.id]);
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
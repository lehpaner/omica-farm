import { AfterViewInit, Component, Injector, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from '@shared/common/app-component-base';

import { FarmDto, AreaDto, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { LandService } from '../services/land-service'
import { NotifyService } from 'abp-ng2-module/dist/src/notify/notify.service';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';


@Component({
    templateUrl: './land.component.html',
    styleUrls: ['./land.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class LandComponent extends AppComponentBase {

    land: FarmDto;
    areas: Array<AreaDto> = [];
    
    constructor (injector:Injector, private _landsService: LandService, 
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute){
        super(injector);
        this._landsService.selecteLand.subscribe(l => this.land = l);
        console.log("LandComponent - land changed", this.land);
    }

    ngOnInit(): void {
        this.getData();
    }

    getData(event?: LazyLoadEvent) {
        this._landsService.areasGet(this.land.id).subscribe(result => {
            this.areas = result.items;
            console.log(this.areas);
            });
    }


    
}
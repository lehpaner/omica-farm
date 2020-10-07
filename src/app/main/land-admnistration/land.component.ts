import { ViewChild, Component, Injector, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from '@shared/common/app-component-base';

import { FarmDto, AreaDto, TokenAuthServiceProxy, MonitoringStationDto } from '@shared/service-proxies/service-proxies';
import { LandService } from '../services/land-service'
import { NotifyService } from 'abp-ng2-module/dist/src/notify/notify.service';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';

import * as moment from 'moment';
import * as d3 from 'd3';


@Component({
    templateUrl: './land.component.html',
    styleUrls: ['./land.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class LandComponent extends AppComponentBase {

    private example_data:any; 

    private now:any = moment().endOf('day').toDate();
    private time_ago:any = moment().startOf('day').subtract(10, 'year').toDate();

    @ViewChild('tabset') landdatatab: TabsetComponent; 

    active = true;
    saving = false;

    land: FarmDto;
    areas: Array<AreaDto> = [];
    monitoringStations: Array<MonitoringStationDto> = [];
    
    constructor (injector:Injector, private _landsService: LandService, 
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute){
        super(injector);
        this._landsService.selecteLand.subscribe(l => this.land = l);
        this.make_e_dta();
        console.log("LandComponent - land changed", this.land);
    }

    ngOnInit(): void {
        this.getData();
    }

    getData(event?: LazyLoadEvent) {

        this._landsService.monitoringStationsGet(this.land.id).subscribe(res => {
            this.monitoringStations = res.items;
            console.log("LOADED MONITORING STATIONS", res.items, " FOR ", this.land.id);
        });
        this._landsService.areasGet(this.land.id).subscribe(result => {
            this.areas = result.items;
            console.log("LOADED AREAS", result.items, " FOR ", this.land.id);
        });

    }
    save(): void {
        console.log("SAVE LAND");
    }
    close(): void {
        console.log("CLOSE LAND");
    }
    showMap(): void {
        console.log("SHOW LAND MAP");
    }
    tabSelected(ev): void {
        console.log("TAB SELECTED", ev.heading);
    }
    tabDeSelected(ev): void {
        console.log("TAB UNSELECTED", ev.heading);
    }
    onAreaExpanded(ev): void {
        console.log("AREA EXPANDED", ev);
    }
    onAreaCollapsed(ev): void {
        console.log("AREA COLLAPSED", ev);
    }
    onMtsExpanded(ev): void {
        console.log("MONITORING STATION EXPANDED", ev);
    }
    onMtsCollapsed(ev): void {
        console.log("MONITORING STATION COLLAPSED", ev);
    }

    make_e_dta():void {
        this.example_data = d3.timeDays(this.time_ago, this.now).map(function (dateElement, index) {
            return {
              date: dateElement,
              details: Array.apply(null, new Array(Math.round(Math.random() * 15))).map(function(e, i, arr) {
                return {
                  'name': 'Project ' + Math.ceil(Math.random() * 10),
                  'date': function () {
                    var projectDate = new Date(dateElement.getTime());
                    projectDate.setHours(Math.floor(Math.random() * 24))
                    projectDate.setMinutes(Math.floor(Math.random() * 60));
                    return projectDate;
                  }(),
                  'value': 3600 * ((arr.length - i) / 5) + Math.floor(Math.random() * 3600) * Math.round(Math.random() * (index / 365))
                }
              }),
              init: function () {
                this.total = this.details.reduce(function (prev, e) {
                  return prev + e.value;
                }, 0);
                return this;
              }
            }.init();
          });
    }
}
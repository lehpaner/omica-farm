import { Inject, Component, OnInit, EventEmitter, Output,  AfterViewInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LandService } from '../services/land-service';
import { FarmDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'omica-land-list',
    templateUrl: './omica-land-list.html',
    styleUrls: ['./omica-land-list.less']
})


export class OmicaLandList implements OnInit, AfterViewInit, OnDestroy {

    @Output()
    openLand = new EventEmitter<FarmDto>();

    public lands: Array<FarmDto> = [ ];
    public selected:FarmDto;

    constructor( private _landService: LandService, @Inject(DOCUMENT) private document: Document ) { 

    }
    public ngOnInit(): void {
        this._landService.selecteLand.subscribe((f) => this.onFarmChanged(f));
        this.createLands(); 
    }

    public onFarmChanged(farm:FarmDto) {
        console.log('Subscriber to land:', farm);
        this.selected = farm;
    }

    public ngAfterViewInit(): void {
    }

    public ngOnDestroy(): void {
    }

    isSelected(item) {    
        var retval ='display-flex entity-item entity-item-with-control-menu';
        if (this.selected) {
            if(this.selected.id==item.id) retval = retval + ' selected';
        } 
        return retval;
    }
    mouseEnter(e: Event) {
    //    console.log("OmicaLandList::onMouseEnter", e);
    }
    mouseLeave(e: Event) {
    //    console.log("OmicaLandList::onMouseLeave", e);
    }
    mouseClick(item) {
        console.log("OmicaLandList::onMouseClick", this.selected);
        if(this.selected) {
            if (item.id == this.selected.id) {
                this.openLand.emit(item);
            } else {
                this._landService.selectFarm(item);
                console.log("New selected =",item);
            }  
        } else {
           this._landService.selectFarm(item);
           console.log("first selected =",item);
        }
    }
    public createLands() {
        var tmpLand:FarmDto =  FarmDto.fromJS({ 
            "name" : "Tor Caldara", 
            "description" : "Riserva protetta Parco Tor Caldara Anzio", 
            "latitude": 41.488324, 
            "longitude": 12.592523, 
            "address": "Via Ardeatina snc",
            "city": "Anzio",
            "zipCode": "00042",
            "country": 1,
            "id": 1
        }); 
        this.lands.push(tmpLand);
        tmpLand = FarmDto.fromJS({ 
            "name" : "Lido dei Pini", 
            "description" : "Area verde tra Ardea e Anzio con la pignetta", 
            "latitude": 41.525298, 
            "longitude": 12.568811, 
            "address": "Via Ardeatina snc" ,
            "city": "Anzio",
            "zipCode": "00042",
            "country": 0,
            "id": 2
        });
        this.lands.push(tmpLand);
    }
}
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { LandService } from '../services/land-service';
import { FarmDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'omica-land-list',
    templateUrl: './omica-land-list.html',
    styleUrls: ['./omica-land-list.less']
})


export class OmicaLandList implements OnInit, AfterViewInit, OnDestroy {

    public lands: Array<FarmDto> = [ ];
    public selected:FarmDto;
    constructor( private _landService: LandService ) { 

    }
    public ngOnInit(): void {
        this._landService.selecteLand.subscribe(f=> this.selected = f);
        this.createLands(); 
    }

    public ngAfterViewInit(): void {
    }

    public ngOnDestroy(): void {
    }

    isSelected(item) {
        return (this.selected.id==item.id)?'omica-list-item selected':'omica-list-item';
    }
    mouseEnter(e: Event) {
        console.log("OmicaLandList::onMouseEnter");
    }
    mouseLeave(e: Event) {
        console.log("OmicaLandList::onMouseLeave");
    }
    mouseClick(item) {
        console.log("OmicaLandList::onMouseClick");
    }
    public createLands() {
        var tmpLand:FarmDto =  FarmDto.fromJS({ 
            "name" : "anzio-ardea", 
            "description" : "Area verde tra Ardea e Anzio", 
            "latitude": 41.52814896714057, 
            "longitude": 12.570850751897664, 
            "address": null,
            "city": "Anzio",
            "zipCode": null,
            "country": 1,
            "id": 1
        });
        this.lands.push(tmpLand);
        tmpLand = FarmDto.fromJS({ 
            "name" : "anzio-ardea", 
            "description" : "Area verde tra Ardea e Anzio", 
            "latitude": 41.52814896714057, 
            "longitude": 12.570850751897664, 
            "address": null,
            "city": "Anzio",
            "zipCode": null,
            "country": 0,
            "id": 2
        });
        this.lands.push(tmpLand);
    }
}
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, NavigationControl } from 'mapbox-gl';

import { LandService } from '../services/land-service'
import { FarmDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'omica-map',
    templateUrl: './omica-map.html',
    styleUrls: ['./omica-map.less']
})

export class OmicaMap implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('mappa' /*, { static: true }*/)
    public mappa: ElementRef<HTMLDivElement>;

    private map: Map;
    private land : FarmDto = undefined;

    constructor(
        private _landService: LandService
    ) { }

    public ngOnInit(): void {
  //      this.land = _landService.
    }

    public ngAfterViewInit(): void {

        this.map = new Map({
            container: this.mappa.nativeElement,
            style: 'mapbox://styles/mapbox/light-v10',
            center: { lng: 113.2, lat: 23.4 },
            zoom: 11,
            pitch: 0,
            attributionControl: false
        });
        this.map.addControl(
            new NavigationControl({
                showZoom: true,
                showCompass: true
            }),
            'top-left'
        );
        this._landService.map.next(this.map);
        this.map.on('load', () => {
            console.log('map loaded');
            this._landService.map.complete();
        });
    }

    public ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

}

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, NavigationControl, Marker, AttributionControl, mapboxgl} from 'mapbox-gl';

import { LandService } from '../../../main/services/land-service'
import { FarmDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'omica-map-editor',
    templateUrl: './omica-map-editor.html',
    styleUrls: ['./omica-map-editor.less']
})

export class OmicaMapEditor implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('mappa' /*, { static: true }*/)
    public mappa: ElementRef<HTMLDivElement>;

    private map: Map;
    private land : FarmDto = undefined;
    private landMarker : Marker = undefined;

    constructor(private _landService: LandService) { 
       
    }

    public ngOnInit(): void {
        this._landService.selecteLand.subscribe((f) => this.onLandChanged(f));
    }

    public ngAfterViewInit(): void {

        this.map = new Map({
            container: this.mappa.nativeElement,
//           style: 'mapbox://styles/mapbox/light-v10',
//            style: 'mapbox://styles/lehpaner/ckftu508003ln19nythp7b0k1',
            style: 'mapbox://styles/mapbox/dark-v9',
            center: { lng: 12.592, lat: 41.488 },
            zoom: 8,
            pitch: 45,
            bearing: -17.6,
            antialias: true,
            interactive: true,
            attributionControl: false
        });
        this.map.addControl(new AttributionControl(), 'top-left');
        this.map.on('load', (ev) => {

            this.map.resize();
            console.log('map loaded', ev);
        });
    }
    private onMapChanged(mappa: Map) {
        console.log("OmicaMapEditor::onMapChanged", mappa);
        this.map = mappa;
    }
    private onLandChanged(land: FarmDto) {
        console.log("OmicaMapEditor::onLandChanged", land);
        if(land){
            //var flyto = { center: [0, 0], zoom: 13,
            //    speed: 0.7,
            //    curve: 1,
            //    easing(t) {
            //      return t;
            //    }};
            //flyto.center[0] = land.longitude;
            //flyto.center[1] = land.latitude;
            //this.doFly(flyto);
            //setTimeout(function() { this.map.flyTo(flyto) }, 10);
            // this.map.flyTo(flyto);
            //if(this.landMarker) {
           //     this.landMarker.remove();
            //}
           // this.landMarker = new Marker().setLngLat([land.longitude, land.latitude]).addTo(this.map);
        }   
    }

    public ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

}

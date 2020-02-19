import { Component, ViewChild, Injector, Output, EventEmitter, AfterViewInit, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { FarmsServiceProxy, CreateOrEditFarmDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { MapLoaderService } from '../../../shared/common/map/map.loader';

declare var google: any;

@Component({
    selector: 'createOrEditFarmModal',
    templateUrl: './create-or-edit-farm-modal.component.html',
    styleUrls: ['../../../shared/common/map/map.loader.css']
})

export class CreateOrEditFarmModalComponent extends AppComponentBase {

    constructor(
        injector: Injector,
        private _farmsServiceProxy: FarmsServiceProxy

    ) {
        super(injector);
    }

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('map') mapElement: any;
    map: google.maps.Map;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();


    drawingManager: any;
    draw_marker: boolean = true;
    wkt: any;
    marker_latitude: number;
    marker_longitude: number

    active = false;
    saving = false;

    farm: CreateOrEditFarmDto = new CreateOrEditFarmDto();

    drawMarkerNewFarm(): void {
        console.log("Farm Does Not Exist");
        var farm_exists = false;
        var map: any;
        MapLoaderService.load().then(() => {

            var input_latitude: number = -34.397;
            var input_longitude: number = 150.644;

            console.log("EEE");

            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: input_latitude, lng: input_longitude },
                zoom: 8
            });
            console.log("FFF");


            this.drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['marker']
                },
                markerOptions: {
                    editable: true,
                    draggable: true
                }
            });


            this.drawingManager.setMap(map);
            google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
                // Marker drawn
                if (event.type === google.maps.drawing.OverlayType.MARKER) {
                    this.marker_latitude = event.overlay.getPosition().lat();
                    this.marker_longitude = event.overlay.getPosition().lng();

                    this.drawingManager = true;
                    this.drawingManager.drawingControl = false;
                }
            });
        });

    }

    drawMarker(input_latitude: number, input_longitude: number): void {

        console.log("Farm Exists");
        var farm_exists = false;
        var map: any;
        MapLoaderService.load().then(() => {


            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: input_latitude, lng: input_longitude },
                zoom: 8
            });
            console.log("FFF");


            this.drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['marker']
                },
                markerOptions: {
                    editable: true,
                    draggable: true
                }
            });


            this.drawingManager.setMap(map);

            var marker = new google.maps.Marker({
                position: { lat: input_latitude, lng: input_longitude },
                map: map,
                editable: true,
                draggable: true,
                title: 'Farm Position'
            });

            this.drawingManager.setMap(map);
            google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
                marker.setMap(null);
                // this.drawingManager.setDrawingMode(null); // Return to 'hand' mode
                // Marker drawn
                if (event.type === google.maps.drawing.OverlayType.MARKER) {
                    //alert(event.overlay.getPath().getAt()); // for polygon
                    this.marker_latitude = event.overlay.getPosition().lat();
                    this.marker_longitude = event.overlay.getPosition().lng();

                    this.drawingManager = true;
                    this.drawingManager.drawingControl = false;
                }
            });
        });

    }


    show(farmId?: number): void {

        if (!farmId) {
            this.farm = new CreateOrEditFarmDto();
            this.farm.id = farmId;
            this.active = true;
            console.log("AAA");
            this.drawMarkerNewFarm();
            console.log("BBB");
            this.modal.show();
        }
        else {
            this._farmsServiceProxy.getFarmForEdit(farmId).subscribe(result => {
                this.farm = result.farm;
                this.active = true;
                console.log("A");
                console.log(this.farm.latitude);
                console.log("CCC");
                this.drawMarker(this.farm.latitude, this.farm.longitude);
                console.log("DDD");

                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this.farm.latitude = this.marker_latitude;
        this.farm.longitude = this.marker_longitude;
        this.farm.geographyWKT = MapLoaderService.GMapMarkerToWKT(this.farm.latitude, this.farm.longitude);


        console.log(this.farm.geographyWKT);

        console.log(this.appSession.userId);

        this._farmsServiceProxy.createOrEdit(this.farm)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }


}

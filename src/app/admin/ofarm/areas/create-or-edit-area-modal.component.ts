import { Component, ViewChild, Injector, Output, EventEmitter, AfterViewInit, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { AreasServiceProxy, CreateOrEditAreaDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { FarmLookupTableModalComponent } from './farm-lookup-table-modal.component';
import { MapLoaderService } from '../../../shared/common/map/map.loader';

declare var google: any;


@Component({
    selector: 'createOrEditAreaModal',
    templateUrl: './create-or-edit-area-modal.component.html',
    styleUrls: ['../../../shared/common/map/map.loader.css']
})
export class CreateOrEditAreaModalComponent extends AppComponentBase {

   // map: google.maps.Map("map");
    drawingManager: any;
    draw_marker: boolean = true;
    wkt: any;

    polygon_wkt: string;

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('farmLookupTableModal') farmLookupTableModal: FarmLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();


    active = false;
    saving = false;

    area: CreateOrEditAreaDto = new CreateOrEditAreaDto();

    farmName = '';


    constructor(
        injector: Injector,
        private _areasServiceProxy: AreasServiceProxy
    ) {
        super(injector);
    }

    drawPolygon(input_areawkt?: string) {

        var area_exists = false;

        var input_latitude = -34.397;
        var input_longitude = 150.644;

        var map: any;
        var poly: any;

        MapLoaderService.load().then(() => {

            if (input_areawkt) {
                area_exists = true;
                poly = this.createPoly(input_areawkt);
                console.log("Area Exists");

            } else {
                console.log("Area Does Not Exist");

            }

            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: -34.397, lng: input_longitude },
                zoom: 8
            });
            
            this.drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['polygon']
                },
                polygonOptions: {
                    editable: true,
                    draggable: true
                }
            });

            

            if (area_exists) {
            poly.setMap(map);
                this.drawingManager.setMap(map);
            }


            this.drawingManager.setMap(map);
            google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
                // Polygon drawn
                if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                    //this is the coordinate, you can assign it to a variable or pass into another function.
                    alert(event.overlay.getPath().getArray());
                    var poly = event.overlay;
                    this.polygon_wkt = this.GMapPolygonToWKT(poly);

                    console.log("POLY WKT");
                    console.log(this.polygon_wkt);

                    this.drawingManager = true;
                    this.drawingManager.drawingControl = false;
                }
            });
        });
    }
        
    show(areaId?: number): void {

            if (!areaId) {
                
                this.area = new CreateOrEditAreaDto();
                
                this.area.id = areaId;
                
                this.drawPolygon();
                this.active = true;
                this.modal.show();

            } else {
                this._areasServiceProxy.getAreaForEdit(areaId).subscribe(result => {
                    this.area = result.area;

                    console.log("POLY3 WKT");
                    console.log(this.area.geographyWKT);
                    this.drawPolygon(this.area.geographyWKT);

                    this.active = true;

                    //this.drawMarker(this.area.latitude, this.area.longitude);
                    this.modal.show();
                });
            }
        //});*/
    }

    save(): void {
        this.saving = true;

        this.area.geographyWKT = this.polygon_wkt;

        console.log("POLY2 WKT");
        console.log(this.area.geographyWKT);

            this._areasServiceProxy.createOrEdit(this.area)
             .pipe(finalize(() => { this.saving = false; }))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

        openSelectFarmModal() {
        this.farmLookupTableModal.id = this.area.farmId;
        this.farmLookupTableModal.displayName = this.farmName;
        this.farmLookupTableModal.show();
    }


        setFarmIdNull() {
        this.area.farmId = null;
        this.farmName = '';
    }


        getNewFarmId() {
        this.area.farmId = this.farmLookupTableModal.id;
        this.farmName = this.farmLookupTableModal.displayName;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
        }

    GMapPolygonToWKT(poly): string {
        // Start the Polygon Well Known Text (WKT) expression
        var wkt = "POLYGON(";

        var paths = poly.getPaths();
        for (var i = 0; i < paths.getLength(); i++) {
            var path = paths.getAt(i);

            // Open a ring grouping in the Polygon Well Known Text
            wkt += "(";
            for (var j = 0; j < path.getLength(); j++) {
                // add each vertice and anticipate another vertice (trailing comma)
                wkt += path.getAt(j).lng().toString() + " " + path.getAt(j).lat().toString() + ",";
            }

            // Google's approach assumes the closing point is the same as the opening
            // point for any given ring, so we have to refer back to the initial point
            // and append it to the end of our polygon wkt, properly closing it.
            //
            // Also close the ring grouping and anticipate another ring (trailing comma)
            wkt += path.getAt(0).lng().toString() + " " + path.getAt(0).lat().toString() + "),";
        }

        // resolve the last trailing "," and close the Polygon
        wkt = wkt.substring(0, wkt.length - 1) + ")";

        return wkt;
    }

    addPoints = function (ptsArray, data) {
        //first spilt the string into individual points
        var pointsData = data.split(",");


        //iterate over each points data and create a latlong
        //& add it to the cords array
        var len = pointsData.length;
        for (var i = 0; i < len; i++) {
            var xy = pointsData[i].split(" ");

            var pt = new google.maps.LatLng(xy[1], xy[0]);
            ptsArray.push(pt);
        }

    }

    createPoly = function (wkt) {
        //using regex, we will get the indivudal Rings
        var regex = /\(([^()]+)\)/g;
        var Rings = [];
        var results;
        while (results = regex.exec(wkt)) {
            Rings.push(results[1]);
        }

        var ptsArray = [];

        var polyLen = Rings.length;

        //now we need to draw the polygon for each of inner rings, but reversed
        for (var i = 0; i < polyLen; i++) {
            this.addPoints(ptsArray, Rings[i]);
        }

        var poly = new google.maps.Polygon({
            paths: ptsArray,
            strokeColor: '#1E90FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#1E90FF',
            fillOpacity: 0.35
        });
        return poly;
    }
}

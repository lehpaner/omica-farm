import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SensorMappingsServiceProxy, CreateOrEditSensorMappingDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { MonitoringStationLookupTableModalComponent } from './monitoringStation-lookup-table-modal.component';
import { SensorLookupTableModalComponent } from './sensor-lookup-table-modal.component';


@Component({
    selector: 'createOrEditSensorMappingModal',
    templateUrl: './create-or-edit-sensorMapping-modal.component.html'
})
export class CreateOrEditSensorMappingModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('monitoringStationLookupTableModal') monitoringStationLookupTableModal: MonitoringStationLookupTableModalComponent;
    @ViewChild('sensorLookupTableModal') sensorLookupTableModal: SensorLookupTableModalComponent;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    sensorMapping: CreateOrEditSensorMappingDto = new CreateOrEditSensorMappingDto();

    monitoringStationName = '';
    sensorName = '';


    constructor(
        injector: Injector,
        private _sensorMappingsServiceProxy: SensorMappingsServiceProxy
    ) {
        super(injector);
    }

    show(sensorMappingId?: number): void {

        if (!sensorMappingId) {
            this.sensorMapping = new CreateOrEditSensorMappingDto();
            this.sensorMapping.id = sensorMappingId;
            this.sensorMapping.mountingDate = moment().startOf('day');
            this.sensorMapping.dismountingDate = moment().startOf('day');
            this.monitoringStationName = '';
            this.sensorName = '';

            this.active = true;
            this.modal.show();
        } else {
            this._sensorMappingsServiceProxy.getSensorMappingForEdit(sensorMappingId).subscribe(result => {
                this.sensorMapping = result.sensorMapping;

                this.monitoringStationName = result.monitoringStationName;
                this.sensorName = result.sensorName;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;
			
            this._sensorMappingsServiceProxy.createOrEdit(this.sensorMapping)
             .pipe(finalize(() => { this.saving = false; }))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

        openSelectMonitoringStationModal() {
        this.monitoringStationLookupTableModal.id = this.sensorMapping.monitoringStationId;
        this.monitoringStationLookupTableModal.displayName = this.monitoringStationName;
        this.monitoringStationLookupTableModal.show();
    }
        openSelectSensorModal() {
        this.sensorLookupTableModal.id = this.sensorMapping.sensorId;
        this.sensorLookupTableModal.displayName = this.sensorName;
        this.sensorLookupTableModal.show();
    }


        setMonitoringStationIdNull() {
        this.sensorMapping.monitoringStationId = null;
        this.monitoringStationName = '';
    }
        setSensorIdNull() {
        this.sensorMapping.sensorId = null;
        this.sensorName = '';
    }


        getNewMonitoringStationId() {
        this.sensorMapping.monitoringStationId = this.monitoringStationLookupTableModal.id;
        this.monitoringStationName = this.monitoringStationLookupTableModal.displayName;
    }
        getNewSensorId() {
        this.sensorMapping.sensorId = this.sensorLookupTableModal.id;
        this.sensorName = this.sensorLookupTableModal.displayName;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

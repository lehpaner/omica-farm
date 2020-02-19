import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { MonitoringStationsServiceProxy, CreateOrEditMonitoringStationDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { FarmLookupTableModalComponent } from './farm-lookup-table-modal.component';


@Component({
    selector: 'createOrEditMonitoringStationModal',
    templateUrl: './create-or-edit-monitoringStation-modal.component.html'
})
export class CreateOrEditMonitoringStationModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('farmLookupTableModal') farmLookupTableModal: FarmLookupTableModalComponent;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    monitoringStation: CreateOrEditMonitoringStationDto = new CreateOrEditMonitoringStationDto();

    farmName = '';


    constructor(
        injector: Injector,
        private _monitoringStationsServiceProxy: MonitoringStationsServiceProxy
    ) {
        super(injector);
    }

    show(monitoringStationId?: number): void {

        if (!monitoringStationId) {
            this.monitoringStation = new CreateOrEditMonitoringStationDto();
            this.monitoringStation.id = monitoringStationId;
            this.farmName = '';

            this.active = true;
            this.modal.show();
        } else {
            this._monitoringStationsServiceProxy.getMonitoringStationForEdit(monitoringStationId).subscribe(result => {
                this.monitoringStation = result.monitoringStation;

                this.farmName = result.farmName;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;
			
            this._monitoringStationsServiceProxy.createOrEdit(this.monitoringStation)
             .pipe(finalize(() => { this.saving = false; }))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

        openSelectFarmModal() {
        this.farmLookupTableModal.id = this.monitoringStation.farmId;
        this.farmLookupTableModal.displayName = this.farmName;
        this.farmLookupTableModal.show();
    }


        setFarmIdNull() {
        this.monitoringStation.farmId = null;
        this.farmName = '';
    }


        getNewFarmId() {
        this.monitoringStation.farmId = this.farmLookupTableModal.id;
        this.farmName = this.farmLookupTableModal.displayName;
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

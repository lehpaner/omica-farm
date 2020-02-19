import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { MonitorinigStationTypesServiceProxy, CreateOrEditMonitorinigStationTypeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditMonitorinigStationTypeModal',
    templateUrl: './create-or-edit-monitorinigStationType-modal.component.html'
})
export class CreateOrEditMonitorinigStationTypeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    monitorinigStationType: CreateOrEditMonitorinigStationTypeDto = new CreateOrEditMonitorinigStationTypeDto();



    constructor(
        injector: Injector,
        private _monitorinigStationTypesServiceProxy: MonitorinigStationTypesServiceProxy
    ) {
        super(injector);
    }

    show(monitorinigStationTypeId?: number): void {

        if (!monitorinigStationTypeId) {
            this.monitorinigStationType = new CreateOrEditMonitorinigStationTypeDto();
            this.monitorinigStationType.id = monitorinigStationTypeId;

            this.active = true;
            this.modal.show();
        } else {
            this._monitorinigStationTypesServiceProxy.getMonitorinigStationTypeForEdit(monitorinigStationTypeId).subscribe(result => {
                this.monitorinigStationType = result.monitorinigStationType;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;
			
            this._monitorinigStationTypesServiceProxy.createOrEdit(this.monitorinigStationType)
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

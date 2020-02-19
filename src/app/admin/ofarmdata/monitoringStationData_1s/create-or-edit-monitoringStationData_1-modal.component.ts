import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { MonitoringStationData_1sServiceProxy, CreateOrEditMonitoringStationData_1Dto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditMonitoringStationData_1Modal',
    templateUrl: './create-or-edit-monitoringStationData_1-modal.component.html'
})
export class CreateOrEditMonitoringStationData_1ModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    monitoringStationData_1: CreateOrEditMonitoringStationData_1Dto = new CreateOrEditMonitoringStationData_1Dto();



    constructor(
        injector: Injector,
        private _monitoringStationData_1sServiceProxy: MonitoringStationData_1sServiceProxy
    ) {
        super(injector);
    }

    show(monitoringStationData_1Id?: number): void {

        if (!monitoringStationData_1Id) {
            this.monitoringStationData_1 = new CreateOrEditMonitoringStationData_1Dto();
            this.monitoringStationData_1.id = monitoringStationData_1Id;
            this.monitoringStationData_1.time = moment().startOf('day');

            this.active = true;
            this.modal.show();
        } else {
            this._monitoringStationData_1sServiceProxy.getMonitoringStationData_1ForEdit(monitoringStationData_1Id).subscribe(result => {
                this.monitoringStationData_1 = result.monitoringStationData_1;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;
			
            this._monitoringStationData_1sServiceProxy.createOrEdit(this.monitoringStationData_1)
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

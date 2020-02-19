import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetMonitoringStationData_1ForView, MonitoringStationData_1Dto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewMonitoringStationData_1Modal',
    templateUrl: './view-monitoringStationData_1-modal.component.html'
})
export class ViewMonitoringStationData_1ModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetMonitoringStationData_1ForView;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetMonitoringStationData_1ForView();
        this.item.monitoringStationData_1 = new MonitoringStationData_1Dto();
    }

    show(item: GetMonitoringStationData_1ForView): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

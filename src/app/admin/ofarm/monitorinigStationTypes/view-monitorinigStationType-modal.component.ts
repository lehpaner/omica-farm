import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetMonitorinigStationTypeForView, MonitorinigStationTypeDto , MonitorinigStationTypeDtoType} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewMonitorinigStationTypeModal',
    templateUrl: './view-monitorinigStationType-modal.component.html'
})
export class ViewMonitorinigStationTypeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetMonitorinigStationTypeForView;
    monitoringStationType = MonitorinigStationTypeDtoType;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetMonitorinigStationTypeForView();
        this.item.monitorinigStationType = new MonitorinigStationTypeDto();
    }

    show(item: GetMonitorinigStationTypeForView): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

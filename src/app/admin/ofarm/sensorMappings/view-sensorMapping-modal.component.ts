import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetSensorMappingForView, SensorMappingDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewSensorMappingModal',
    templateUrl: './view-sensorMapping-modal.component.html'
})
export class ViewSensorMappingModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetSensorMappingForView;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetSensorMappingForView();
        this.item.sensorMapping = new SensorMappingDto();
    }

    show(item: GetSensorMappingForView): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

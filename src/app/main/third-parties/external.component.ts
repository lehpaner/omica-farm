import { AfterViewInit, Component, Injector, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from '@shared/common/app-component-base';


@Component({
    templateUrl: './external.component.html',
    styleUrls: ['./external.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ExternalComponent extends AppComponentBase {
    constructor (injector:Injector){
        super(injector);
    }
    
}
import { AfterViewInit, Component, Injector, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from '@shared/common/app-component-base';


@Component({
    templateUrl: './land.component.html',
    styleUrls: ['./land.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class LandComponent extends AppComponentBase {
    constructor (injector:Injector){
        super(injector);
    }
    
}
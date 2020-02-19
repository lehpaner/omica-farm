import { AfterViewInit, Component, Injector, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from '@shared/common/app-component-base';


@Component({
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DocumentationComponent extends AppComponentBase {
    constructor (injector:Injector){
        super(injector);
    }
    
}
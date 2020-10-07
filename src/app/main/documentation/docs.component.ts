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
    basicMarkdown: string = `
   # Heading (H1)

   ## Sub Heading (H2)

   ### Steps (H3)

   ###List Items

   - One
   - Two
   - Three
       * 4 extra spaces for nested lists
           * Another 4 spaces for a nested list

   Emphasis, aka italics, with *asterisks* or _underscores_.

   Strong emphasis, aka bold, with **asterisks** or __underscores__.

   Combined emphasis with **asterisks and _underscores_**.
 `;
}
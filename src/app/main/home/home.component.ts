import { AfterViewInit, Component, Injector, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from '@shared/common/app-component-base';

import * as moment from 'moment';
import * as d3 from 'd3';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class HomeComponent extends AppComponentBase {

    private example_data:any; 

    private now:any = moment().endOf('day').toDate();
    private time_ago:any = moment().startOf('day').subtract(10, 'year').toDate();

    make_e_dta():void {
        this.example_data = d3.timeDays(this.time_ago, this.now).map(function (dateElement, index) {
            return {
              date: dateElement,
              details: Array.apply(null, new Array(Math.round(Math.random() * 15))).map(function(e, i, arr) {
                return {
                  'name': 'Project ' + Math.ceil(Math.random() * 10),
                  'date': function () {
                    var projectDate = new Date(dateElement.getTime());
                    projectDate.setHours(Math.floor(Math.random() * 24))
                    projectDate.setMinutes(Math.floor(Math.random() * 60));
                    return projectDate;
                  }(),
                  'value': 3600 * ((arr.length - i) / 5) + Math.floor(Math.random() * 3600) * Math.round(Math.random() * (index / 365))
                }
              }),
              init: function () {
                this.total = this.details.reduce(function (prev, e) {
                  return prev + e.value;
                }, 0);
                return this;
              }
            }.init();
          });
    }

    constructor (injector:Injector){
        super(injector);
        this.make_e_dta();
        console.log("Panel Data: ", this.example_data);
        console.log("Panel Data Size: ", this.example_data.length);
    }
    
}
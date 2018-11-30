import { Component, Input, HostBinding, ChangeDetectionStrategy} from '@angular/core';
import { OnDestroy, AfterContentInit } from '@angular/core';

import {Farm} from '../../nodes/onodes/farm';

import { fadeInDownAnimation } from '../../app.animations';


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'qs-farm-view',
    templateUrl: './farm.view.component.html',
    styleUrls: ['./farm.view.component.scss'],
    animations: [fadeInDownAnimation],
  })

  export class FarmViewComponent implements OnDestroy, AfterContentInit {

    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;

    private _data: Farm = null;
    
   /**
   * data?: Farm 
   */
  @Input('data')
  set data(d: Farm) {
        this._data = d;
  }
  get data(): Farm {
    return this._data;
  }

   /**
   * Executed after content is initialized, loops through any [TdStepComponent] children elements,
   * assigns them a number and subscribes as an observer to their [onActivated] event.
   */
  ngAfterContentInit(): void {
    this._registerTriggers();
  }

  /**
   * Unsubscribes from [TdStepComponent] children elements when component is destroyed.
   */
  ngOnDestroy(): void {
    this._deregisterTriggers();
  }

  private _registerTriggers():void {

  }
  private _deregisterTriggers():void {
      
  }
}
import { Component, Input, Output } from '@angular/core';
import { OnDestroy, AfterContentInit, EventEmitter } from '@angular/core';

import {Farm} from '../../nodes/onodes/farm';
import { Subscription } from 'rxjs';

export interface IFarmChangedEvent {
    newData: Farm;
    prevOld: Farm;
  }

@Component({
    selector: 'qs-farm-edit',
    templateUrl: './farm.edit.component.html',
    styleUrls: ['./farm.edit.component.scss'],
  })

  export class FarmEditComponent implements OnDestroy, AfterContentInit {

    private _subcriptions: Subscription[];
    private _data: Farm = null;
    private _oldData: Farm = null;
   /**
   * data?: Farm 
   */
  @Input('data')
  set data(d: Farm) {
        this._oldData = this._data;
        this._data = d;
  }
  get data(): Farm {
    return this._data;
  }
  /**
   * farmChange?: function
   * Method to be executed when [onFarmChange] event is emitted.
   * Emits an [IFarmChangedEvent] implemented object.
   */
  @Output('farmChange') onFarmChange: EventEmitter<IFarmChangedEvent> = new EventEmitter<IFarmChangedEvent>();
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
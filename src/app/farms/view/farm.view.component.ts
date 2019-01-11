import { Component, Input, HostBinding, ChangeDetectionStrategy} from '@angular/core';
import { OnDestroy, AfterContentInit } from '@angular/core';

import {Farm, IFarmData} from '../../nodes/onodes/farm';

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

    private _originalData: Farm = null;
    private _data: Farm = null;
    
    private _farmData: IFarmData;

    id: string= '';
    name: string='';
    contractType: string=''
    soilType: string ='';

      /**
   * label?: string
   * Sets label of [ViewCpmponent] header.
   * Defaults to 'Click to expand'
   */
  @Input() label: string;
    
    /**
   * sublabel?: string
   * Sets sublabel of [TdExpansionPanelComponent] header.
   */
  @Input() sublabel: string;

   /**
   * data?: Farm 
   */
  @Input('data')
  set data(d: Farm) {
        
        this._data = d;
        console.log('DATA:', this._data);
        if(this._data)
           this._farmData = this._data.getFarmData();
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

  commit(): boolean {
    this._originalData = this._data;
    return true;
  }
  revert(): boolean {
    this._data = this._originalData;
    return true;
  }
}
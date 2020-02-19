import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FarmListDto, FarmsServiceProxy, UserEditDto, UserRoleDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as _ from 'lodash';

export interface IFarmComboComponentData {
    allFarms: FarmListDto[];
    selectedFarms: string[];
}

Component({
    selector: 'farm-combo',
    template:
    `
    <select class="form-control" [formControl]="selectedFarm">
        <option *ngFor="let farm of farms" [value]="farm.farmId">{{farm.farmName}}</option>
    </select>`,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FarmComboComponent),
        multi: true,
    }]
})

export class FarmComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {

    farms: FarmListDto[] = [];
    selectedFarm = new FormControl('');

    user: UserEditDto = new UserEditDto();
    roles: UserRoleDto[];

    private _allFarms: FarmListDto[];
    private _selectedFarms: string[];

    onTouched: any = () => { };

    constructor(
        private _farmService: FarmsServiceProxy,
        private _userService: UserServiceProxy,
        injector: Injector) {
        super(injector);
    }

    ngOnInit(userId?: number): void {
        this._userService.getUserForEdit(userId, this.appSession.userId).subscribe(userResult => {
            this.user = userResult.user;
            this.roles = userResult.roles;
            this.farms = userResult.farms;
        });
  
        //this._farmService.getFarmsByUserAndRole(userId).subscribe(result => {
        //this._farmService.getFarms(undefined).subscribe(result => {
        //    this.farms = result.items;
        //});
    }

    writeValue(obj: any): void {
        if (this.selectedFarm) {
            this.selectedFarm.setValue(obj);
        }
    }

    registerOnChange(fn: any): void {
        this.selectedFarm.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.selectedFarm.disable();
        } else {
            this.selectedFarm.enable();
        }
    }

}

import { Component, Input, HostBinding, ChangeDetectionStrategy, ViewChild, ViewChildren} from '@angular/core';
import { OnInit, OnDestroy, AfterContentInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService, IAlertConfig } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';
import { FarmsService } from '../services/farms.service';
import { FarmViewComponent } from './farm.view.component'

import { Subscription } from 'rxjs/Subscription';
import { AppCtx } from '../../app.context';

import * as firebase from 'firebase/app';
import { DAPI } from '../../services/dapi';

import {Farm} from '../../nodes/onodes/farm';
import { IResultRestModel} from '../../model';
import { fadeInDownAnimation } from '../../app.animations';


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'qs-farm-overview',
    templateUrl: './farm.overview.component.html',
    styleUrls: ['./farm.overview.component.scss'],
    animations: [fadeInDownAnimation],
  })

export class FarmOverviewComponent implements OnInit, AfterContentInit {

    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;

    _farm: Farm = null;
    private id: string = 'new';
    private action: string;

    @ViewChild('farmView')
    _farmView: FarmViewComponent;

  ///
  /// CONSTRUCTOR
  ///
constructor(private _appCtx: AppCtx, private _titleService: Title, private _loadingService: TdLoadingService,
            private _farmService: FarmsService,
            private _dialogService: TdDialogService, private _router: Router, private _route: ActivatedRoute) {

}

  /**
   * Executed after content is initialized, loops through any [TdStepComponent] children elements,
   * assigns them a number and subscribes as an observer to their [onActivated] event.
   */
ngAfterContentInit(): void {
    //this._registerTriggers();
  }

  /**
   * Unsubscribes from [TdStepComponent] children elements when component is destroyed.
   */
ngOnDestroy(): void {
    //this._deregisterTriggers();
  }

  /// Init e servizi backend
////
ngOnInit(): void {
        console.log('FARM OVERVIEW INIT');
 //       this._route.url.subscribe((url: any) => {
 //           this.action = (url.length > 1 ? url[1].path : 'add');
 //       });
        this._route.params.subscribe((params: { id: string }) => {
            this.id = <string>params.id||'new';
            console.log('FARM OVERVIEW ID:', this.id);
            this.load(this.id).then(() => {
                //    this.setActiveStep(0);
                }).then(() => {
                //    this.registraEventiIniziali();
                });
        });
/*
        try {
            this._loadingService.register('overview.view');
            if (this.id) {
                this.load(this.id).then(() => {
                //    this.setActiveStep(0);
                }).then(() => {
                //    this.registraEventiIniziali();
                });
            }
        } catch (error) {
            console.log(`An error has occured : ${error}`);
            let alertConfig: IAlertConfig = {
                title: 'Application error',
                message: 'Data retriving is failed',
                closeButton: 'Close',
              };
            this._dialogService.openAlert(alertConfig);
        } finally {
            this._loadingService.resolve('overview.view');
        }
*/
}
async load(id: string): Promise<void> {
    let response: IResultRestModel = null;
    try {
        if (id === 'new') { return; }
        response = await this._farmService.getFarm(id);
        if (response.result === 'SUCESS') {
            console.log(`Load result : ${JSON.stringify(response)}`);
            this._farm = response.data;
            this._farmView.data = this._farm;
        } else {
            /// Errore di carico modulo passare messaggio ricavato da backend
        }
    } catch (error) {
        console.log(`An error has occured : ${error}`);
        let alertConfig: IAlertConfig = {
            title: 'Errore applicativo',
            message: 'Errore durante recupero dati',
            closeButton: 'CHIUDI',
          };
        this._dialogService.openAlert(alertConfig);
    } finally {
       // this.setupFirstPageData(this.currentData, this.action);
    }
}
}
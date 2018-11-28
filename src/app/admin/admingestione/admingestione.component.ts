import { Component, HostBinding, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';
import { TdCollapseAnimation } from '@covalent/core/common';
import { AbstractControl, Validators } from '@angular/forms';
import { AppCtx } from '../../app.context';
import { slideInDownAnimation } from '../../app.animations';

import {
    ITdDynamicElementConfig,
    ITdDynamicElementValidator,
    TdDynamicElement,
    TdDynamicFormsComponent,
    TdDynamicType,
} from '@covalent/dynamic-forms';

export interface IFormComponents {
    nome: string;
    descrizione: string;
    getFromCtx: string;
    getFromConfig: string;
};

@Component({
  selector: 'qs-forms-gestione',
  styleUrls: ['./admingestione.component.scss'],
  templateUrl: './admingestione.component.html',
  animations: [
      slideInDownAnimation,
      TdCollapseAnimation()]
})
export class AdminGestioneComponent implements OnInit  {

    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;

  formsCpmponents: IFormComponents[] = [
      {nome: 'Sezioni', descrizione: 'descrizione', getFromCtx: 'getDefaultSezioni', getFromConfig: ''},
      {nome: 'Sezioni Speciali', descrizione: 'Sezioni Speciali', getFromCtx: 'getDefaultSezioniSpeciali', getFromConfig: ''}
  ];

  constructor(private _titleService: Title,
      private _loadingService: TdLoadingService,
      private _dialogService: TdDialogService,
      private _snackBarService: MatSnackBar,
      private _appCtx: AppCtx,
      private _router: Router,
      private _changeDetectorRef: ChangeDetectorRef,
      public media: TdMediaService) {
  }

  ngOnInit(): void {
      this._titleService.setTitle('Gestione moduli');
      this.formsCpmponents = this._appCtx.getConfig('forms');
  }
  goToEdit(name: string): void {
    this._router.navigate(['admin', 'form'], { queryParams: { formName: name } });
}
}

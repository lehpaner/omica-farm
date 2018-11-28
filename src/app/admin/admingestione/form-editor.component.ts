import { Component, OnInit, ChangeDetectorRef, ViewChild , HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCtx } from '../../app.context';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdCollapseAnimation } from '@covalent/core/common';
import { AdminDocsService } from '../services/admin.docs.service';
import {  IDocument } from '../model/document.model';
import { slideInDownAnimation } from '../../app.animations';
import {
    ITdDynamicElementConfig,
    ITdDynamicElementValidator,
    TdDynamicElement,
    TdDynamicFormsComponent,
    TdDynamicType,
} from '@covalent/dynamic-forms';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'qs-form-edit',
    styleUrls: ['./form-editor.component.scss'],
    templateUrl: './form-editor.component.html',
    animations: [
      slideInDownAnimation,
      TdCollapseAnimation()]
  })

  export class FormEditorComponent implements OnInit {

    id: string;
    formName: string;
    dynamicElements: ITdDynamicElementConfig[];
    env: string = '';
    config: any = {};

    showDynamicCode: boolean = false;
    type: any;
    count: number = 2;

    editorVal: any = {};

    elementOptions: any[] = [
      TdDynamicElement.Input,
      TdDynamicType.Number,
      TdDynamicElement.Datepicker,
      TdDynamicElement.Password,
      TdDynamicElement.Textarea,
      TdDynamicElement.Slider,
      TdDynamicElement.Checkbox,
      TdDynamicElement.SlideToggle,
      TdDynamicElement.FileInput,
  ];
  customValidationElements: ITdDynamicElementConfig[];

    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;

    constructor(private _docService: AdminDocsService,
        private _appCtx: AppCtx,
        private _router: Router,
        private _route: ActivatedRoute,
        private ref: ChangeDetectorRef,
        private _snackBarService: MatSnackBar,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService) {}

goBack(): void {
  this._router.navigate(['/admin/forms']);
}

ngOnInit(): void {
  console.log('ENV', this._appCtx.env);
  this.env = this._appCtx.env['env'];
  console.log('CONFIG', this._appCtx.config);
  this.config = this._appCtx.config;

  let formsComponents = this.config.forms;
  this._route.queryParams.subscribe(qpar => {
    this.formName = qpar['formName'];
  });
  if (this.formName) {
    let uno = formsComponents.filter((where) => where.nome === this.formName);
    if (uno.length > 0) {
      this.dynamicElements = uno[0].campi;
    }
  }
  this.ref.markForCheck();
  this.ref.detectChanges();
}

isMinMaxSupported(type: TdDynamicElement | TdDynamicType): boolean {
  return type === TdDynamicElement.Slider || type === TdDynamicType.Number || this.isDate(type);
}

isDate(type: TdDynamicElement | TdDynamicType): boolean {
  return type === TdDynamicElement.Datepicker;
}

isMinMaxLengthSupported(type: TdDynamicElement | TdDynamicType): boolean {
  return type === TdDynamicElement.Input || type === TdDynamicType.Text;
}

addElement(): void {
  if (this.type) {
      this.dynamicElements.push({
          name: 'element-' + this.count++,
          type: this.type,
          required: false,
      });
      this.type = undefined;
  }
}

deleteElement(index: number): void {
  this.dynamicElements.splice(index, 1);
}

doSave(): void {
  this.config.forms[this.formName] = this.dynamicElements;
  this.save('config', 'config.' + this.env + '.json').then(() => {
    console.log('CONFIGURAZIONE SALVATA');
  });
}
async save(chapter: string, filename: string): Promise<void> {
  try {
    this._loadingService.register('form.edit');
    await this._appCtx.saveConfig(this.formName).toPromise();
  } catch (error) {
    this._dialogService.openAlert({message: 'There was an error saving the user'});
  } finally {
    this._loadingService.resolve('form.edit');
    this.goBack();
  }
}
}

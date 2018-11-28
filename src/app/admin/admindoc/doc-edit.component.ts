import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';

import { AdminDocsService } from '../services/admin.docs.service';
import {  IDocument } from '../model/document.model';
import { slideInDownAnimation } from '../../app.animations';
import { TdTextEditorComponent } from '@covalent/text-editor';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'qs-doc-edit',
    styleUrls: ['./doc-edit.component.scss'],
    templateUrl: './doc-edit.component.html',
    animations: [slideInDownAnimation],
  })

  export class AdminDocComponent implements OnInit {

    id: string;
    docName: string;
    editorVal: string = '';

    @ViewChild('editor') private _tdEditor: TdTextEditorComponent;
    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;

    constructor(private _docService: AdminDocsService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _snackBarService: MatSnackBar,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService) {}

goBack(): void {
this._router.navigate(['/admin/docs']);
}

ngOnInit(): void {

  this._route.queryParams.subscribe(qpar => {
    this.docName = qpar['docName'];
  });
  if(this.docName) {
    this.load(this.docName);
  }

}

async load(docName: string): Promise<void> {
  try {
    this._loadingService.register('doc.edit');
    this.editorVal = await this._docService.getDoc(docName).toPromise();
  } catch (error) {
  this._dialogService.openAlert({message: 'There was an error loading the user'});
  } finally {
  this._loadingService.resolve('doc.edit');
  }
}

doSave(): void {
  this.save('guida', this.docName).then(() => {
    console.log('DOCUMENTO GUIDA SALVATO');
  });
}
async save(chapter: string, filename: string): Promise<void> {
try {
  this._loadingService.register('doc.edit');
  await this._docService.saveFile(chapter, filename, this.editorVal).toPromise();
} catch (error) {
  this._dialogService.openAlert({message: 'There was an error saving the user'});
} finally {
  this._loadingService.resolve('doc.edit');
}
}

}
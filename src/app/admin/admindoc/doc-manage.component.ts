import { Component, HostBinding, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';
import { Router } from '@angular/router';
import { slideInDownAnimation } from '../../app.animations';
import { TdTextEditorComponent } from '@covalent/text-editor';
import { AdminDocsService } from '../services/admin.docs.service';

import { IDocument } from '../model/document.model';

import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'qs-doc-manage',
  styleUrls: ['./doc-manage.component.scss'],
  templateUrl: './doc-manage.component.html',
  animations: [slideInDownAnimation],
})

export class AdminDocsComponent implements OnInit {

    @ViewChild('editor') private _tdEditor: TdTextEditorComponent;
    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;

    documents: any[] = [];
    filteredDocuments: any[] = [];

    constructor(private _titleService: Title,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService,
        private _snackBarService: MatSnackBar,
        private _docService: AdminDocsService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        public media: TdMediaService) {

        //var doc: IDocument = new IDocument();
        //doc.nome = "Documento";
        //doc.descrizione = "desc";
        //doc.editable = true;
        this.filteredDocuments.push({ "nome": "", "descrizione": "", editable:true});
    }

    ngOnInit(): void {
        this._titleService.setTitle('Gestione documentazione');
        this.load();
    }

    goToEdit(name: string): void {
        this._router.navigate(['admin', 'doc'], { queryParams: { docName: name } });
    }

    async load(): Promise<void> {
        try {
            this._loadingService.register('document.list');
            console.log("Loading lista documenti");
            this.documents = await this._docService.getDocList().toPromise();
        } catch (error) {
            console.log("Cannot load list of docs");
        } finally {
            this.filteredDocuments = Object.assign([], this.documents);
            this._loadingService.resolve('document.list');
            console.log(this.filteredDocuments);
        }
    }

    filterDocuments(nome: string = ''): void {
        if (this.documents.length > 1) {
            this.filteredDocuments = this.documents.filter((doc: IDocument) => {
                return doc.nome.toLowerCase().indexOf(nome.toLowerCase()) > -1;
            });
        }

    }

    delete(id: string): void {
        this._dialogService
            .openConfirm({ message: 'Sicuro di voler rimuovere documento?' })
            .afterClosed().toPromise().then((confirm: boolean) => {
                if (confirm) {
                    this._delete(id);
                }
            });
    }

    private async _delete(id: string): Promise<void> {
 /*       try {
            this._loadingService.register('document.list');
            await this._docService.delete(id).toPromise();
            this.documents = this.documents.filter((doc: IDocument) => {
                return doc.id !== id;
            });
            this.filteredDocuments = this.filteredDocuments.filter((doc: IDocument) => {
                return doc.id !== id;
            });
            this._snackBarService.open('Documento rimosso', 'Ok');
        } catch (error) {
            this._dialogService.openAlert({ message: 'Errore durante rimozione documento' });
        } finally {
            this._loadingService.resolve('document.list');
        }*/
    }

    editorVal: string = `# Intro
Go ahead, play around with the editor! Be sure to check out **bold** and *italic* styling, or even [links](https://google.com).
You can type the Markdown syntax, use the toolbar, or use shortcuts like 'cmd-b' or 'ctrl-b'.

## Lists
Unordered lists can be started using the toolbar or by typing '* ', '- ', or '+ '. Ordered lists can be started by typing '1. '.

#### Unordered
* Lists are a piece of cake
* They even auto continue as you type
* A double enter will end them
* Tabs and shift-tabs work too

#### Ordered
1. Numbered lists...
2. ...work too!

## What about images?
![Yes](https://i.imgur.com/sZlktY7.png)
`;


}
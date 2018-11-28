import { Component, HostBinding, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';
import { Router } from '@angular/router';
import { slideInDownAnimation } from '../../app.animations';
import { SyncQuestionariService } from '../services/admin.sync.service';
import { RestResponse } from '../../model';
import { IDocument } from '../model/document.model';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'qs-sync-flow',
  styleUrls: ['./sync.component.scss'],
  templateUrl: './sync.component.html',
  animations: [slideInDownAnimation],
})

export class SyncFlowComponent implements OnInit {

    datiFlusso: any[];
    selectedNode: any;
    flowObject: any;
    flow: any;
    processors: any[] = [];
    filteredProcessors: any[] = [];
   
  deafult3: any[] = [
    {id: "Eve",   parent: ""},
    {id: "Cain",  parent: "Eve"},
    {id: "Seth",  parent: "Eve"},
    {id: "Enos",  parent: "Seth"},
    {id: "Noam",  parent: "Seth"},
    {id: "Abel",  parent: "Eve"},
    {id: "Awan",  parent: "Eve"},
    {id: "Enoch", parent: "Awan"},
    {id: "Azura", parent: "Eve"}
  ];
    constructor(private _titleService: Title,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService,
        private _flowService: SyncQuestionariService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        public media: TdMediaService) {
            this.datiFlusso = this.deafult3;
        }

    ngOnInit(): void {
        this._titleService.setTitle('Gestione sincronizzazione');
        this.load(true);

    }
    
    async delay(ms: number): Promise<any> {
        return await new Promise(resolve => setTimeout(() => resolve(), 1000)).then(() => console.log('fired'));
     }

    filterProcessors(): any[] {
        return  this.processors.filter((uno: any) =>
            uno['component']['type'] === 'it.anticorruzione.questionari.intergrazione.QuestionariDataLoader' );
        }
     //Risultato in RestRespose.dato
    async load(first:boolean): Promise<void> {
        let reponse: RestResponse = null;
        try {
            if (first) {
                this._loadingService.register('flow.list');
            }
            reponse = await this._flowService.getQuestionariFlow('').toPromise();

        } catch (error) {
          console.log(`An error has occured : ${error}`);
          this._dialogService.openAlert({title: 'Recupero flusso non riuscito', message: 'Errore di sistema', closeButton: 'CHIUDI' });
        } finally {
            if (first) {  this._loadingService.resolve('flow.list');  }
            if (reponse.errorID < 0) {
              this._dialogService.openAlert({title: reponse.message, message: reponse.exceptionStack, closeButton: 'CHIUDI' });
            } else {
                this.flowObject = reponse.dato;
                this.flow =  this.flowObject['flow'];
                console.log(this.flow);
                if ( this.flow !== undefined) {
                this.processors =  this.flow['processors'];
                this.filteredProcessors = this.filterProcessors();
                console.log(this.processors);
                }

            }
            ///Scheduling next load
           // console.log(this._router.url);
            if (this._router.url === '/admin/nifi'){
                this.delay(2000).then(() => { this.load(false); });
            }
        }
    }
}

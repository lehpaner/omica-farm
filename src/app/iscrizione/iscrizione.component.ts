import { Component, OnInit, AfterViewInit, HostBinding, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase/app';
import { DAPI } from '../services/dapi';
import { IAuthChangedEvent, IResultRestModel, Workspace } from '../model';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';

import { IscrizioneService } from './services/iscrizione.service';
import { ModuloCommissari} from '../model';
import 'rxjs/add/operator/toPromise';
import { Subscription } from 'rxjs/Subscription';
import { AppCtx } from '../app.context';
import { isNullOrUndefined } from 'util';
import { slideInDownAnimation } from '../app.animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'qs-iscrizione',
  templateUrl: './iscrizione.component.html',
  styleUrls: ['./iscrizione.component.scss'],
  animations: [slideInDownAnimation],
})

export class IscrizioneComponent implements OnInit, AfterViewInit {

  @HostBinding('@routeAnimation') routeAnimation: boolean = true;
  @HostBinding('class.td-route-animation') classAnimation: boolean = true;

  toolbarTitle: string = '';
  copyrightString: string = '';

  currentUser: firebase.User = null;
  currentUserCallback: Subscription;
  contextChangeSubscription: any;
  iscrizioneTipo: number = 0;
  pratiche: ModuloCommissari[] = [];
  praticheFiltrate: ModuloCommissari[]= [];
  currentFilter: number = 0;
  newVisible: boolean = false;
  ff: File;
  isSospeso: boolean = false;
  isCancellato: boolean = false;

constructor(private _appCtx: AppCtx, private _titleService: Title,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService,
              private _snackBarService: MatSnackBar,
              private _dapi: DAPI,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService, private _router: Router) {
                this.toolbarTitle = <string>_appCtx.getConfig('toolbarTitle');
                this.copyrightString = <string>_appCtx.getConfig('copyrightString');
                this.currentUser = this._appCtx.getCurrentUser();
                this.iscrizioneTipo = this._appCtx.getConfig('tipoQuestionario');
                let roles: string[] =  this._appCtx.getConfig('roles');
                if (roles.length > 0) {
                  this.isSospeso = (roles.indexOf('sospeso') > -1);
                  this.isCancellato = (roles.indexOf('cancellato') > -1);
                }
  }


ngOnInit(): void {
    this._titleService.setTitle('Manage records');
    this.contextChangeSubscription = this._appCtx.authChangedEvent.subscribe(u => this.onContextChanged(u))
  }

private onContextChanged(event: IAuthChangedEvent): void {
    console.log('Main Fired Auth:', event);
    this.currentUser = event.user;
    if(this.currentUser.isAnonymous){
      this.pratiche = []; //Clear data
    } else {
      this.load().then(() => {
        console.log('DATA LOADED AFTER CTX CHaNGE EVENT');
      });
    }
  }

ngAfterViewInit(): void {
    this.load();
  }

getStatusString(iscrizione: ModuloCommissari): string {
    if (iscrizione.status === 10) { return 'IN LAVORAZIONE'; }
    if (iscrizione.status === 20) { return 'VERIFICATO'; }
    if (iscrizione.status === 30) { return 'ARCHIVIATO'; }
    if (iscrizione.status === 40) { return 'ISCRITTO CON IL NUMERO:' + iscrizione.category; }
    if (iscrizione.status === 99) { return 'CANCELLATO'; }
    return 'SCONOSCIUTA';
  }

noInWork(): boolean {
   let inWork: ModuloCommissari[] = this.pratiche.filter((pratica: ModuloCommissari) => pratica.status === 10);
   console.log('IN WORK');
   console.log(inWork.length);
   return ( inWork.length === 0);
}

removeFilter(): void {
  this.praticheFiltrate = this.pratiche.filter((pratica: ModuloCommissari) => pratica.status !== 30);
}

filterPerStatus(status: number): void {
    this.currentFilter = status;
    if (status === 30) {
      this.praticheFiltrate = this.pratiche.filter((pratica: ModuloCommissari) => pratica.status === status);
    } else if (status !== 0) {
      this.praticheFiltrate = this.pratiche.filter((pratica: ModuloCommissari) => ((pratica.status === status) && (pratica.status !== 30)));
    } else {
      this.removeFilter();
    }
  }

async getPdf(docId: string): Promise<any> {
    try {
      this._loadingService.register('iscrizioni.list');
//PEKMEZ
      let result:IResultRestModel = await this._dapi.nodeGetByOwnerAndTypeAsync("",1000);
    } catch (error) {
      console.log('Error loading pdf:', error);
      this._dialogService.openAlert({title: 'Generazione documento non riuscito', message: error, closeButton: 'CHIUDI' });
    } finally {
      this._loadingService.resolve('iscrizioni.list');
    }
  }

async load(): Promise<void> {
    let response: IResultRestModel;
    try {
      console.log('Loading projects of :' , this.currentUser);
      if(this.currentUser) {
        response = await this._dapi.nodeGetByOwnerAndTypeAsync(this.currentUser.uid, this.iscrizioneTipo);
      } else {
        response = {result:'SUCESS', errorNumber:0, message:'no data', data:[]}
      }
      if (response.result === 'SUCESS') { //'SUCESS'|'ERROR'|'PROGRESS'
        this.pratiche =  Object.assign([], response.data);
      } else {
        this.pratiche = [];
        this._dialogService.openAlert({title: 'Recupero dati non è riuscito', message: response.message, closeButton: 'CHIUDI'});
      }
    } catch (error) {
      this.pratiche = [];
      console.log(`An error has occured : ${error}`);
      this._dialogService.openAlert({title: 'Recupero dati non è riuscito', message: error , closeButton: 'CHIUDI'});
    } finally {
      this.praticheFiltrate = this.pratiche.filter((pratica: ModuloCommissari) => pratica.status !== 30);
      this._changeDetectorRef.markForCheck();
      this._changeDetectorRef.detectChanges();
    }
  }
goToEdit(id: string): void {
  let messaggio: string = '';
  let canDo: boolean = true;
  if (this.isSospeso) {
    canDo = false;
    messaggio = 'Utente risulta in stato "SOSPESO" e non può modificare iscrizioni';
  }
  if (this.isCancellato) {
    canDo = false;
    messaggio = 'Utente risulta in stato "CANCELLATO" e non può modificare iscrizioni';
  }
  if (canDo) {
    this._router.navigate(['iscrizione', id, 'edit']);
  } else {
    this._dialogService
      .openAlert({message: messaggio,  closeButton: 'CHIUDI'} );
  }
}

goToAllegati(id: string, stat: number): void {
  this._router.navigate(['iscrizione', id, 'allegati'], { queryParams: { status: stat } });
}

nuovaIscrizione(): void {
  let messaggio: string = '';
  let canDo: boolean = true;
  let noInWork:boolean = this.noInWork();
  if (!noInWork) {
    console.log('ESISTE IN LAVORAZIONE');
    console.log(noInWork);
    canDo = false;
    messaggio = 'Esiste gia una iscrizione in stato "IN LAVORAZIONE"';
  }
  if (this.isSospeso) {
    canDo = false;
    messaggio = 'Utente risulta in stato "SOSPESO" e non può creare nuove iscrizioni';
  }
  if (this.isCancellato) {
    canDo = false;
    messaggio = 'Utente risulta in stato "CANCELLATO" e non può creare nuove iscrizioni';
  }
  console.log(canDo);
  if (canDo) {
    this._router.navigate(['iscrizione', 'add']);
  } else {
    this._dialogService
      .openAlert({message: messaggio,  closeButton: 'CHIUDI'} );
  }
}

reloadMe(): void {
  this._router.navigate(['iscrizione']);
}

delete(id: string): void {
    this._dialogService
      .openConfirm({message: 'Sicuri di voler cancellare la richiesta?', acceptButton: 'PROSEGUI', cancelButton: 'ANNULLA'})
      .afterClosed().toPromise().then((confirm: boolean) => {
        if (confirm) {
          this._delete(id);
        }
      });
  }

abbandonaRegistro(): void {
    this._dialogService
      .openConfirm({title: 'Disiscrizione', message: 'Questa azione archivia tutte le iscrizioni attive e pubblicate. Sicuri di farlo???',
                    acceptButton: 'PROSEGUI', cancelButton: 'ANNULLA'})
      .afterClosed().toPromise().then((confirm: boolean) => {
        if (confirm) {
          this._disIscrizione(this.currentUser.email);
          this._changeDetectorRef.markForCheck();
          this._changeDetectorRef.detectChanges();
        }
      });
  }

archivia(uno: ModuloCommissari): void {
    this._dialogService
      .openConfirm({message: 'Sicuri di voler archiviare la iscrizione?', acceptButton: 'PROSEGUI', cancelButton: 'ANNULLA'})
      .afterClosed().toPromise().then((confirm: boolean) => {
        if (confirm) {
        this.do_archivia(uno);
        this.newVisible = this.noInWork();
        this._changeDetectorRef.markForCheck();
        this._changeDetectorRef.detectChanges();
      }
      });
  }

completa_iscrizione(uno: ModuloCommissari): void {
    let messaggio: string = '';
    let canDo: boolean = true;
    if (this.isSospeso) {
        canDo = false;
        messaggio = 'Utente risulta in stato "SOSPESO" e non può completare';
      }
    if (canDo) {
        this.promove_state(uno);
        this._changeDetectorRef.markForCheck();
        this._changeDetectorRef.detectChanges();
      } else {
        this._dialogService
          .openAlert({message: messaggio,  closeButton: 'CHIUDI'} );
      }
    }

creaUnClone(uno: ModuloCommissari): void {
  let messaggio: string = '';
  let canDo: boolean = true;
  let noInWork: boolean = this.noInWork();
  if (!noInWork) {
    canDo = false;
    messaggio = 'Esiste gia una iscrizione in stato "IN LAVORAZIONE"';
  }
  if (this.isSospeso) {
    canDo = false;
    messaggio = 'Utente risulta in stato "SOSPESO" e non può creare nuove iscrizioni';
  }
  if (this.isCancellato) {
    canDo = false;
    messaggio = 'Utente risulta in stato "CANCELLATO" e non può creare nuove iscrizioni';
  }
  console.log(canDo);
  if (canDo) {
    this.unlock_state(uno);
    this._changeDetectorRef.markForCheck();
    this._changeDetectorRef.detectChanges();
  } else {
    this._dialogService
      .openAlert({message: messaggio,  closeButton: 'CHIUDI'} );
  }
}

  private async _disIscrizione(id: string): Promise<void> {
    try {
      this._loadingService.register('iscrizioni.list');
//Pekmez
      let res: IResultRestModel = await this._dapi.nodeGeByIDAsync(id);

      this.pratiche =  Object.assign([], res);
      this._snackBarService.open('Archiviazione totale eseguita', 'Ok');
    } catch (error) {
      console.log(`An error has occured : ${error}`);
      this._dialogService.openAlert({title: 'Richiesta disicrizione non è riuscita: ', message: 'Errore di sistema',
                                    closeButton: 'CHIUDI' });
    } finally {
      this._loadingService.resolve('iscrizioni.list');
    }
  }

  private async _delete(id: string): Promise<void> {
    try {
      this._loadingService.register('iscrizioni.list');
//Pekmez
      let res: IResultRestModel = await this._dapi.nodeGeByIDAsync(id);
      this._snackBarService.open('Richiesta cancellata', 'Ok');
    } catch (error) {
      console.log(`An error has occured : ${error}`);
      this._dialogService.openAlert({title: 'Cancellazione della richiesta non è riuscita', message: 'Errore di sistema', closeButton: 'CHIUDI' });
    } finally {
      this._loadingService.resolve('iscrizioni.list');
    }
  }

  private async unlock_state(uno: ModuloCommissari): Promise<ModuloCommissari> {
    let nuova: ModuloCommissari = undefined;
    try {
      this._loadingService.register('iscrizioni.list');
      let res: IResultRestModel = await this._dapi.nodeGeByIDAsync(uno.id);
      let nuova: ModuloCommissari;// = await this._iscrizioneService.clonaIscrizione(uno).toPromise();
      
      this._snackBarService.open('Iscrizione clonata in una nuova iscrizione con lo stato in-lavorazione', 'Ok');
    } catch (error) {
      console.log(`An error has occured : ${error}`);
      this._dialogService.openAlert({title: 'Clonazione della iscrizione non è riuscita', message: 'Errore di sistema', closeButton: 'CHIUDI' });
    } finally {
      this.pratiche.push(nuova);
      this.filterPerStatus(this.currentFilter);
      this._loadingService.resolve('iscrizioni.list');
      return nuova;

    }
  }
  private async promove_state(uno: ModuloCommissari): Promise<any> {
    let result: ModuloCommissari[] = [];
    try {
      this._loadingService.register('iscrizioni.list');
      let res: IResultRestModel = await this._dapi.nodeGeByIDAsync(uno.id);
      this._snackBarService.open('Iscrizione promossa allo stato COMPLETATA', 'Ok');
    } catch (error) {
      console.log(`An error has occured : ${error}`);
      this._dialogService.openAlert({title: 'Promozione della iscrizione non è riuscita', message: 'Errore di sistema' , closeButton: 'CHIUDI' });
    } finally {
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          console.log(result[i]);
        //   this.replaceInIscrizioni(result[i]);
        }
      }
      this._loadingService.resolve('iscrizioni.list');
      this.load();
      this._changeDetectorRef.markForCheck();
      this._changeDetectorRef.detectChanges();
    }
  }

  private async do_archivia(uno: ModuloCommissari): Promise<any> {
    try {
      this._loadingService.register('iscrizioni.list');
      let res: IResultRestModel = await this._dapi.nodeGeByIDAsync(uno.id);
      uno.status = 30;
      this._snackBarService.open('Iscrizione ARCHIVIATA', 'Ok');
    } catch (error) {
      console.log(`An error has occured : ${error}`);
      this._dialogService.openAlert({title: 'Archivazione della iscrizione non è riuscita', message: error , closeButton: 'CHIUDI'});
    } finally {
      this._loadingService.resolve('iscrizioni.list');
    }
  }

}

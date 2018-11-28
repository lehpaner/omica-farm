import { Component, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef, HostBinding, ViewChild, ViewChildren,
    QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuloCommissari, IDocument, IEsitoVerifica, RestResponse } from '../../model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService, IAlertConfig } from '@covalent/core/dialogs';
import { AppCtx } from '../../app.context';
import { IscrizioneService } from '../services/iscrizione.service';
import * as firebase from 'firebase/app';

@Component({
    selector: 'qs-allegati-form',
    templateUrl: './allegati.component.html',
    styleUrls: ['./allegati.component.scss'],
    })

export class AllegatiComponent implements OnInit {

    id: string;
    action: string;
    user: firebase.User = null;
    allegatiNodo: ModuloCommissari;
    documenti: IDocument[];
    documentiTot: IDocument[];

    admin: boolean;
    validated: boolean = false;
    errorMessage: any;
    selectedTipoDoc: string = '0';
    iscrizioneStatus: number;

    isSospeso: boolean = false;
    isCancellato: boolean = false;

    firma: IEsitoVerifica;

    firmaNome: string = '';
    firmaCognome: string = '';
    firmaCF: string = '';
    hasFirma: boolean = false;
    firmaMessage = 'Per verificare la firma documento usa il tasto di verifica per aggiornare i dati.';

    files: any;
    disabled: boolean = true;
    accept = ".doc,.pdf"

    tipoDocumentoVerificata: any[] = [
        {value: 0, viewValue: 'Schelta tipo'},
        {value: 99, viewValue: 'Curriculum vitae'}];

    tipoDocumentoDefault: any[] = [
            {value: 0, viewValue: 'Schelta tipo'},
            {value: 20, viewValue: 'Richiesta iscrizione firmata'},
            {value: 99, viewValue: 'Curriculum vitae'}];

    tipoDocumento: any[] = [];

  ///
  /// CONSTRUCTOR
  ///
  constructor(private _appCtx: AppCtx, private _iscrizioneService: IscrizioneService,
    private _router: Router, private _route: ActivatedRoute,
    private _snackBarService: MatSnackBar, private ref: ChangeDetectorRef,
    private _loadingService: TdLoadingService,
    private _dialogService: TdDialogService) {
      this.user = this._appCtx.getCurrentUser();
      let roles: string[] =  this._appCtx.getConfig('roles');
      if (roles.length > 0) {
        this.isSospeso = (roles.indexOf('sospeso') > -1);
        this.isCancellato = (roles.indexOf('cancellato') > -1);
      }
    }

    /// Init e servizi backend
    ////
  ngOnInit(): void {
        this._route.params.subscribe((params: { id: string }) => {
            this.id = params.id;
        });
        if (this.id) {
            this.load(this.id).then(() => {
                console.log( this.documenti);
            });
        }
        this._route.queryParams.subscribe(qpar => {
            this.iscrizioneStatus = +qpar['status']||0;
        });
        if ((this.iscrizioneStatus === 20) || (this.iscrizioneStatus === 40)) {
            this.tipoDocumento = this.tipoDocumentoVerificata;
        } else {
            this.tipoDocumento = this.tipoDocumentoDefault;
        }
    }

    initialGenerate(): void {
        this.generaPdf(this.id).then(() => {
           this.reloadData(this.id).then(() => {
            this.ref.detectChanges();
            this.ref.markForCheck();
           });
        });
    }
  async load(id: string): Promise<void> {
        let response: RestResponse = null;
        try {
            this._loadingService.register('allegati.form');
            response = await this._iscrizioneService.getAllegatiIscrizione(id).toPromise();
        } catch (error) {
            console.log(`An error has occured : ${error}`);
            let alertConfig: IAlertConfig = {
                title: 'Errore durante recupero dati',
                message: 'Carico dati ha incontrato un errore',
                closeButton: 'CHIUDI',
              };
            this._dialogService.openAlert(alertConfig);
        } finally {
            this._loadingService.resolve('allegati.form');
            if (response.errorID === 0) {
                 this.documentiTot = response.data;
                 this.documenti = this.documentiTot;//this.documentiTot.filter((uno) => uno.statoFile === 1);
            }
        }
    }
    async reloadData(id: string): Promise<void> {
        let response: RestResponse = null;
        try {
            response = await this._iscrizioneService.getAllegatiIscrizione(id).toPromise();
        } catch (error) {
            console.log(`An error has occured : ${error}`);
            let alertConfig: IAlertConfig = {
                title: 'Errore durante recupero dati',
                message: 'Ricarico dati ha incontrato un errore',
                closeButton: 'CHIUDI',
              };
            this._dialogService.openAlert(alertConfig);
        } finally {
            if (response.errorID === 0) {
                this.documenti = response.data;
           }
        }
    }

  async upload(file: File, tipo: string): Promise<any> {
    let resp: RestResponse = null;
    try {
    this._loadingService.register('allegati.form');
    resp = await this._iscrizioneService.uploadTypedFile(this.id, tipo, file).toPromise();

   } catch (error) {
     console.log(`An error has occured : ${error}`);
     let alertConfig: IAlertConfig = {
        title: 'Errore',
        message: 'Carico documento non riuscito',
        closeButton: 'CHIUDI',
      };
     this._dialogService.openAlert(alertConfig);
   } finally {

     if (resp.errorID === 0 ) {//la risposta è lista dei documenti
        Object.assign(this.documenti, resp.data);
        let ss: number = +tipo;
        if (ss === 20) {
            let alertConfig: IAlertConfig = {
                title: 'Documento carricato con successo',
                message: 'Documento di firma archivito e la iscrizione passata allo stato "VERIFICATO"',
                closeButton: 'CHIUDI',
              };
            this._dialogService.openAlert(alertConfig);
        }
     } else {

         let errorID: number = resp.errorID;

         if (errorID !== 0 ) {
            let alertConfig: IAlertConfig = {
                title: 'Verifica della firma non riuscita - carico documento ignorato',
                message: resp.message,
                closeButton: 'CHIUDI',
              };
            this._dialogService.openAlert(alertConfig);
         } else {
            let firma = resp.dato;
            let esito: string = firma['esito'];
            let firmatarioNome: string = firma['nome'];
            let firmatarioCognome: string = firma['cognome'];
            let firmatarioCF: string = firma['codiceFiscale'];
            let messaggio: string = 'Documento risulta verificato con esito:'+ esito +' firmato da :' + ' nome = ' + firmatarioNome + ' - cognome = ' + firmatarioCognome + ' - CF = ' + firmatarioCF;
            let alertConfig: IAlertConfig = {
                title: 'Verifica ha avuto successo',
                message: messaggio,
                closeButton: 'CHIUDI',
              };
            this._dialogService.openAlert(alertConfig);
         }
     }
     this.selectedTipoDoc = '0';
     this.toggleDisabled(true);
     this._loadingService.resolve('allegati.form');
   }
 }

 async generaPdf(docId: string): Promise<any> {
    try {
      this._loadingService.register('allegati.form');
      let result = await this._iscrizioneService.generatePdf(docId).toPromise();
    } catch (error) {
      console.log(`An error has occured : ${error}`);
      let alertConfig: IAlertConfig = {
        title: 'Errore applicazionne',
        message: 'Generazione documento non riuscito',
        closeButton: 'CHIUDI',
      };
      this._dialogService.openAlert(alertConfig);
    } finally {
      this._loadingService.resolve('allegati.form');
    }
  }

 async checkFirma(): Promise<any> {
    let result: any;
    try {
     this._loadingService.register('allegati.form');
     result = await this._iscrizioneService.vediFirma(this.id).toPromise();
   } catch (error) {
     console.log(`An error has occured : ${error}`);
     let alertConfig: IAlertConfig = {
        title: 'Errore applicazionne',
        message: 'Verifica documento non riuscita',
        closeButton: 'CHIUDI',
      };
     this._dialogService.openAlert(alertConfig);
   } finally {
   this._loadingService.resolve('allegati.form');
   return result;
  }
 }

 async downloadDoc(doc): Promise<void> {
    try {
     this._loadingService.register('iscrizioni.list');
     await this._iscrizioneService.getAllegato(doc).toPromise();
   } catch (error) {
     console.log(`An error has occured : ${error}`);
     let alertConfig: IAlertConfig = {
        title: 'Errore applicazionne',
        message: 'Download documento non riuscita',
        closeButton: 'CHIUDI',
      };
     this._dialogService.openAlert(alertConfig);
   } finally {
    this._loadingService.resolve('iscrizioni.list');
  }
 }

getDocument(doc): void {
     console.log(doc);
     this.downloadDoc(doc).then((f) => {
         console.log('DOCUMENTO SCARICATO');
    });
 }

tipoDocumentoChanged(newVal: string): void {
    if ( this.selectedTipoDoc !== '0') {
        this.toggleDisabled(false);
    } else {
        this.toggleDisabled(true);
    }
}

verificaFirma(): void {
     let username: string = this.user.email ;
     let nameuser: string =  this.user.displayName;
     this.checkFirma().then((firma) => {
        let firme: any[] = firma['usedCertificates'];
        for ( let uno of firme)
        {
            let nome: string = uno.commonName;
            let subjects: any[] = uno['subjectDistinguishedName'];
            for (let subDesc of subjects){
                let vals: string[] = subDesc.value.split(',');
                let ob1 = vals.reduce(function(map, obj) {
                    let kv: string[] = obj.split('=');
                    map[kv[0]] = kv[1];
                    return map;
                }, {});
                if ((ob1['CN'] === username)||(ob1['CN'] === nameuser)) {
                    let name: string =  ob1['2.5.4.4'];
                    name = name.substr(5);
                    this.firmaNome = name.match(/.{1,2}/g).map(function(v){ return String.fromCharCode(parseInt(v, 16)); }).join('');
                    let surname: string =  ob1['2.5.4.42'];
                    surname = surname.substr(5);
                    this.firmaCognome = surname.match(/.{1,2}/g).map(function(v){ return String.fromCharCode(parseInt(v, 16)); }).join('');
                    let fNumber: string =  ob1['2.5.4.5'];
                    fNumber = fNumber.substr(17);
                    this.firmaCF = fNumber.match(/.{1,2}/g).map(function(v){ return String.fromCharCode(parseInt(v, 16)); }).join('');
                    this.hasFirma = true;
                    break;
                } else {
                    console.log('Unamched CN');
                }
            }
        }
    });
}
private  hex2a(hexx: string): string {
    let hex: string = hexx.toString(); //force conversion
    let str: string = '';
    for (let i: number = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

 private getTipoDocumentoPerValue(val: number): string {
     if (val === 10 ) { 
         return 'Iscrizione generata da sistema';
     }
     let td = this.tipoDocumentoDefault.filter((uno) => uno.value === val);
     if ( td.length > 0) {
        return <string> td[0].viewValue;
     }
     return '';
 }

 private reload(): void {
        this.ngOnInit();
        this.ref.detectChanges();
        this.ref.markForCheck();
 }

 private toggleDisabled(val: boolean): void {
    this.disabled = val;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }

 private  goBack(): void {
    this._router.navigate(['/iscrizione']);
  }

private reloadPage(id: string): void {
    this._router.navigate(['iscrizione', this.id, 'allegati']);
    this.ngOnInit();
 }
}

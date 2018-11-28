import { Component, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef, HostBinding, ViewChild, ViewChildren,
    QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MatDateFormats } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService, IAlertConfig } from '@covalent/core/dialogs';
import { TdExpansionPanelComponent }  from '@covalent/core';
import { TdDynamicFormsComponent, TdDynamicElement, TdDynamicType, ITdDynamicElementConfig } from '@covalent/dynamic-forms';
import { StepState, TdStepComponent } from '@covalent/core';
import { AppCtx } from '../../app.context';
import { FarmsService } from '../services/farms.service';
import { Profile, ModuloCommissari, DatiIniziali, SezoniSottosezioni, RestResponse, IResultRestModel} from '../../model';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AbstractControl } from '@angular/forms';
import { isUndefined, isNull } from 'util';


@Component({
  selector: 'qs-iscrizioni-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})

export class IscrizioneFormComponent implements OnInit, AfterViewInit {

  id: string = 'new';
  action: string;
  user: Profile;
  currentData: ModuloCommissari;
  admin: boolean;
  validated: boolean = false;
  errorMessage: any;

  sezioneFormChangedCallback: Subscription;
  professioniTecnicheChangedCallback: Subscription;
  settoreSanitarioChangedCallback: Subscription;
  altriServizieFornitureChangedCallback: Subscription;
  categorieChangedCallback: Subscription;
  codAusaFormChangedCallback: Subscription;

  ///////////
  userNome: string = 'Dato non trovato';
  userCognome: string = 'Dato non trovato';
  userComuneNascita: string = 'Dato non trovato';
  userDataNascita: Date = new Date();
  userFeldDataNascita: string = this.userDataNascita.toLocaleDateString();
  userCF: string = 'Dato non trovato';
  userPec: string = 'Dato non trovato';
  //////////
  nomeAusa: string = 'non rilevata';
  ////////////////////////////////////////////////////////////////////////
  // DEFINIZIONI FORM
  ////////////////////////////////////////////////////////////////////////
    PersonaElements: ITdDynamicElementConfig[];

    @ViewChild('personaForm')
    _personaForm: TdDynamicFormsComponent;

    @ViewChild('sezioneForm')
    _sezioneForm: TdDynamicFormsComponent;

    SezioneElements: ITdDynamicElementConfig[];

    SezioneSpecialeVisible: boolean = false;
    secspecChangeCallback: Subscription;
    SezioneSpecialeVals = {sezspecialeconsip: false, sezspecialedirigente: false, sezspecialeprimario: false};
    SezioneSpecialeElements: ITdDynamicElementConfig[];
    @ViewChild('sezioneSpecialeForm')
    _sezioneSpecialeForm: TdDynamicFormsComponent;

    ///
    /// PROFESSIONI TECNICHE
    ///
    professioniTeschniche: string[] = [];

    @ViewChild('professioniTeschnicheExpansion')
    _professioniTeschnicheExpansion: TdExpansionPanelComponent;

    @ViewChild('professioniTeschnicheForm')
    _professioniTeschnicheForm: TdDynamicFormsComponent;

    ProfessioniTechnicheElements: ITdDynamicElementConfig[];

    ///
    /// SETTORE SANITARIO
    ///
    settoreSanitario: string[] = [];
    @ViewChild('settoreSanitarioFormExpansion')
    _settoreSanitarioFormExpansion: TdExpansionPanelComponent;

    @ViewChild('settoreSanitarioForm')
    _settoreSanitarioForm: TdDynamicFormsComponent;
    SettoreSanitarioElements: ITdDynamicElementConfig[];

    ///
    /// ALTRI SERVIZI E FORNITURE
    ///
    altriServiziEForniture: string[] = [];
    @ViewChild('altriServizieFornitureExpansion')
    _altriServizieFornitureExpansion: TdExpansionPanelComponent;

    @ViewChild('altriServizieFornitureForm')
    _altriServizieFornitureForm: TdDynamicFormsComponent;
    AltriServiziFornitureElements: ITdDynamicElementConfig[];

    ///
    /// CATEGORIE/PROFILO
    ///
    CategorieElements: ITdDynamicElementConfig[];
    CategorieCheckedElements: ITdDynamicElementConfig[] = [];
    @ViewChild('categorieForm')
    _categorieForm: TdDynamicFormsComponent;

    @ViewChild('categorieCheckedForm')
    _categorieCheckedForm: TdDynamicFormsComponent;


    ///
    /// REQUISITI MORALITA
    ///
    RequisitiMoralitaElements: ITdDynamicElementConfig[];
    @ViewChild('requisitiMoralitaForm')
    _requisitiMoralitaForm: TdDynamicFormsComponent;

    ///
    /// PAGAMENTO TARIFFA
    ///
    PagamentoIscrizione: ITdDynamicElementConfig[];
    @ViewChild('requisitiPagamentoIscrizioneForm')
    _requisitiPagamentoIscrizioneForm: TdDynamicFormsComponent;

    ///
    /// REQUISITI DERIVANTI ALLA SEZIONE SOTTOSEZIONE
    ///
    RequisitiSezioneSottoSezione: ITdDynamicElementConfig[];
    @ViewChild('reqSezioneSottosezioneForm')
    _reqSezioneSottosezioneForm: TdDynamicFormsComponent;

    ////////////////////////////Expansion dentro Requisiti//////////////////////
    @ViewChild('reqProfesionistaConAlboExpansion')
    _reqProfesionistaConAlboExpansion: TdExpansionPanelComponent;


    @ViewChild('reqProfesionistaSenzaAlboExpansion')
    _reqProfesionistaSenzaAlboExpansion: TdExpansionPanelComponent;

    @ViewChild('req3bForm')
    _req3bForm: TdDynamicFormsComponent;


    @ViewChild('reqDipendentiAggiudicatriciExpansion')
    _reqDipendentiAggiudicatriciExpansion: TdExpansionPanelComponent;
    codiceAusaElements: ITdDynamicElementConfig[];

    @ViewChild('codAusaForm')
    _codAusaForm: TdDynamicFormsComponent;

    @ViewChild('reqPersonaleAccademicoExpansion')
    _reqPersonaleAccademicoExpansion: TdExpansionPanelComponent;

    PossessoRequisitiElements: ITdDynamicElementConfig[];
    @ViewChild('possessoRequisitiForm')
    _possessoRequisitiForm: TdDynamicFormsComponent;
    selectedCategory: string = '';
    //////////////////////////////////////////////////////////////////////////////////
    /// DERIVANTI PROFILO
    /////////////////////////////////////////////////////////////////////////////////
    @ViewChild('reqProfiloExpansion')
    _reqProfiloExpansion: TdExpansionPanelComponent;

    RequisitiSezioneProfilo: Object[] = [];

    @ViewChild('reqProfiloForm')
    _reqProfiloForm: TdDynamicFormsComponent;

    ///
    /// NUOVO PROFILO FORM
    ///
    @ViewChild('requsitiProfiloExpansion')
    _requisitiProfiloExpansion: TdExpansionPanelComponent;

    @ViewChild('requisitiProfiloForm')
    _requisitiProfiloForm: TdDynamicFormsComponent;


    ////
    /// Acceta privacy
    ////
    @ViewChild('preSaveForm')
    _preSaveForm: TdDynamicFormsComponent;
    PreSaveElements: Object[] = [];
    /////////////////////////////////////////////////////////////////////////////////////////////
    /// STEPS
    ////////////////////////////////////////////////////////////////////////////////////////////
    @ViewChildren(TdStepComponent)
    steps: QueryList<TdStepComponent>;

    activeStepIdx = 0;
    activeStep: TdStepComponent;
    stepDeactivateSubscription: Subscription;

    activeDeactiveStepMsg: string = 'No select/deselect detected yet';
    stateStep1: StepState = StepState.None;
    stateStep2: StepState = StepState.None;
    stateStep3: StepState = StepState.None;
    stateStep4: StepState = StepState.None;
    stateStep5: StepState = StepState.None;
    stateStep6: StepState = StepState.None;

    //Gestiscono disabilitazione dei step
    vediExpansionA: boolean = true;
    vediExpansionB: boolean = true;
    vediCodiceAusa: boolean = true;
    vediPagamento: boolean = true;
    disableRequisiti: boolean = false;

  ///
  /// CONSTRUCTOR
  ///
    constructor(private _appCtx: AppCtx, private _iscrizioneService: FarmsService,
              private _router: Router, private _route: ActivatedRoute,
              private _snackBarService: MatSnackBar, private ref: ChangeDetectorRef,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService) {
              }

    ngAfterViewInit(): void {
        if (this.id) {
            this.load(this.id).then(() => {
                this.setActiveStep(0);
            }).then(() => {
                this.registraEventiIniziali();
            });
        }
   }
    /// Init e servizi backend
    ////
    ngOnInit(): void {
        console.log('ISCRIZIONI FORM INIT');
        this._route.url.subscribe((url: any) => {
            this.action = (url.length > 1 ? url[1].path : 'add');
        });
        this._route.params.subscribe((params: { id: string }) => {
            this.id = <string>params.id||'new';
        });
        try {
            this._loadingService.register('iscrizione.form');
            this.initForms().
                then(() => {
                 //   this.load(this.id);
                });
        } catch (error) {
            console.log(`An error has occured : ${error}`);
            let alertConfig: IAlertConfig = {
                title: 'Errore applicativo',
                message: 'Errore durante inizializzazione strutture dati',
                closeButton: 'CHIUDI',
              };
            this._dialogService.openAlert(alertConfig);
        } finally {
            this._loadingService.resolve('iscrizione.form');
        }

    }

    async delay(ms: number): Promise<any> {
        return await new Promise(resolve => setTimeout(() => resolve(), 1000)).then(() => console.log('fired'));
    }

    async load(id: string): Promise<void> {
        let response: IResultRestModel = null;
        try {
            if (id === 'new') { return; }
            response = await this._iscrizioneService.getFarm(id);
            if (response.result === 'SUCESS') {
                this.currentData = response.data;
                this.userNome = this.currentData.extendedData['nome'];
                this.userCognome = this.currentData.extendedData['cognome'];
                this.userComuneNascita = this.currentData.extendedData['comunenascita'];
                this.userDataNascita = new Date(this.currentData.extendedData['datanascita']);
                this.userFeldDataNascita = this.userDataNascita.toLocaleDateString();
                this.userCF = this.currentData.extendedData['cf'];
                this.userPec = this.currentData.extendedData['pec'];
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
            this.setupFirstPageData(this.currentData, this.action);
        }
    }

    async save(): Promise<void> {
        let response: IResultRestModel = null;
        try {
            this._loadingService.register('iscrizione.form');
            let siteAdmin: number = (this.admin ? 1 : 0);
            let now: Date = new Date();
            if (this.action === 'add') {
                response = await this._iscrizioneService.saveFarm(this.currentData);
            } else {
                response = await this._iscrizioneService.updateFarm(this.currentData);
            }

        } catch (error) {
            console.log(`An error has occured : ${error}`);
            let alertConfig: IAlertConfig = {
                title: 'Errore applicativo',
                message: 'Errore durante salvataggio dati',
                closeButton: 'CHIUDI',
              };
            this._dialogService.openAlert(alertConfig);
        } finally {
//        this._snackBarService.open('Dati modulo salvati', 'Ok');
        this._loadingService.resolve('iscrizione.form');
        if (response.errorNumber === 0) {
            this.goBack();
        } else {
            let alertConfig: IAlertConfig = {
                title: 'Errore salvataggio dati',
                message: response.message,
                closeButton: 'CHIUDI',
              };
            this._dialogService.openAlert(alertConfig);
        }
    }
  }

/**
 * Prende le definizioni dei form da contesto...
 */
async  initForms(): Promise<any> {
    return new Promise(resolve => {
        this.initFormComponents();
      });
    }

    private initFormComponents(): void {
        console.log('START CREATING FORMS');

        this.userNome = this._appCtx.getCurrentUser().displayName;
        this.userCognome = this._appCtx.getCurrentUser().displayName;
        //if (this._appCtx.getCurrentUser().rappresentanteLegale.codiceNazioneNascita === 'ESTERO') {
        //    this.userComuneNascita = 'ESTERO';
       // } else {
       //     this.userComuneNascita = this._appCtx.getCurrentUser().rappresentanteLegale.comuneNascita;
       // }

       // this.userDataNascita = new Date(this._appCtx.getCurrentUser().rappresentanteLegale.dataNascita);
       // this.userFeldDataNascita = this.userDataNascita.toLocaleDateString();
        this.userCF = this._appCtx.getCurrentUser().email;
        this.userPec = this._appCtx.getCurrentUser().email;
        /// STEP1
        this.SezioneElements = this._appCtx.getDataCtx().getDefaultSezioni();
        this.SezioneSpecialeElements = this._appCtx.getDataCtx().getDefaultSezioniSpeciali();
        this.ProfessioniTechnicheElements = this._appCtx.getDataCtx().getDefaultProfessioniTechniche();
        this.SettoreSanitarioElements = this._appCtx.getDataCtx().getDefaultSettoreSanitarioElements();
        this.AltriServiziFornitureElements = this._appCtx.getDataCtx().getDefaultAltriServiziElements();
        /// STEP2
        this.CategorieElements = this._appCtx.getDataCtx().getDefaultCategorieElements();
        // /STEP3
        // Req Sezione sottosezione
        this.codiceAusaElements = this._appCtx.getDataCtx().getDefaultCodAusaElements();
        this.PossessoRequisitiElements = this._appCtx.getDataCtx().getDefaultRequsiti3d();
        /// STEP4
        this.PagamentoIscrizione = this._appCtx.getDataCtx().getDefaultPagamentoIscrizioneElements();
        /// STEP5
        this.RequisitiMoralitaElements = this._appCtx.getDataCtx().getDefaultRequisitiMoralita();
        this.PreSaveElements = this._appCtx.getDataCtx().getDefaultPrivacy();
        console.log('END CREATING FORMS');
    }
    private ext2formVal(formVal: any, extData: any): any {
        let formLen: number = Object.keys(formVal).length;
        let extLen: number =  Object.keys(extData).length;
        if (formLen === extLen) {
            return extData;
        }
        if (formLen < extLen) {
            Object.keys(formVal).forEach(key => formVal[key] = extData[key]);
            return formVal;
        }
        Object.assign(formVal, extData);
        return formVal;
    }
///
// Setup data in step 1
// @param dati
// @param action  edit|add
///
/// console.log(JSON.stringify(this._reqProfiloForm.value));
    private setupFirstPageData(dati: ModuloCommissari, action: string): void {
    /////////////////// SEZIONE SOTTOSEZIONE  ///////////////////////////
    if (action !== 'add') {
        let nodi: ModuloCommissari[] = this.currentData.children.filter((uno: ModuloCommissari) => uno.subtype === 1001);
        if (nodi.length > 0) {
            let nodo: ModuloCommissari = nodi[0];
            let sezVal = this._sezioneForm.value;
            sezVal = this.ext2formVal(sezVal, nodo.extendedData['sezione']);
            this._sezioneForm.form.setValue(sezVal);
            this._sezioneForm.refresh();
            this.manageSezioneForm(this._sezioneForm.value);  ///

            if (this._sezioneSpecialeForm) {
                let sezspecVal = this._sezioneSpecialeForm.value;
                sezspecVal = this.ext2formVal(sezspecVal, nodo.extendedData['sezionespeciale']);
                this._sezioneSpecialeForm.form.setValue(nodo.extendedData['sezionespeciale']);
                this.SezioneSpecialeVals = this._sezioneSpecialeForm.value;
            }

            let ptval = this._professioniTeschnicheForm.value;
            ptval = this.ext2formVal(ptval, nodo.extendedData['pt']);
            this._professioniTeschnicheForm.form.setValue(ptval);
            this.manageprofessioniTeschnicheForm(this._professioniTeschnicheForm.value);
            this._professioniTeschnicheForm.refresh();

            let ssval = this._settoreSanitarioForm.value;
            ssval = this.ext2formVal(ssval, nodo.extendedData['ss']);
            this._settoreSanitarioForm.form.setValue(ssval);
            this.manageSettoreSanitarioForm(this._settoreSanitarioForm.value);
            this._settoreSanitarioForm.refresh();

            let asval = this._altriServizieFornitureForm.value;
            asval = this.ext2formVal(asval, nodo.extendedData['as']);
            this._altriServizieFornitureForm.form.setValue(asval);
            this.manageAltriServizieFornitureForm(this._altriServizieFornitureForm.value);
            this._altriServizieFornitureForm.refresh();
        }
    }
    this.ref.markForCheck();
    this.ref.detectChanges();
    }

    private registraEventiIniziali(): void {
        /// EVENTISTICA
        console.log('EVENTI PAGINA INIZIALE');
        this.sezioneFormChangedCallback = this._sezioneForm.form.valueChanges.subscribe(() => {
            this.manageSezioneForm(this._sezioneForm.value);
        });

        this.professioniTecnicheChangedCallback = this._professioniTeschnicheForm.form.valueChanges.subscribe(() => {
            this.manageprofessioniTeschnicheForm(this._professioniTeschnicheForm.value);
        });

        this.settoreSanitarioChangedCallback = this._settoreSanitarioForm.form.valueChanges.subscribe(() => {
            this.manageSettoreSanitarioForm(this._settoreSanitarioForm.value);
        });

        this.altriServizieFornitureChangedCallback = this._altriServizieFornitureForm.form.valueChanges.subscribe(() => {
            this.manageAltriServizieFornitureForm(this._altriServizieFornitureForm.value);
        });
}
    /**
     *
     */
    private collectFirstPageData(): number {
        let retval: number = 0;
        if (!this.currentData) { this.currentData = new ModuloCommissari(); }
        this.currentData.owner = this._appCtx.getCurrentUser().uid;

        this.currentData.extendedData['nome'] = this.userNome;
        this.currentData.extendedData['cognome'] = this.userCognome;
        this.currentData.extendedData['comunenascita'] = this.userComuneNascita;
        this.currentData.extendedData['datanascita'] = new Date(this.userDataNascita);

        this.currentData.extendedData['cf'] = this.userCF;
        this.currentData.extendedData['pec'] = this.userPec;

        let sezioniSottosezioni: ModuloCommissari = this.getChildByType(1001, true, 'Sezioni');
        sezioniSottosezioni.extendedData['sezione'] = this._sezioneForm.value;
        if (!isUndefined(this._sezioneSpecialeForm)) {
            sezioniSottosezioni.extendedData['sezionespeciale'] = this._sezioneSpecialeForm.value;
        }
        sezioniSottosezioni.extendedData['pt'] = this._professioniTeschnicheForm.value;
        sezioniSottosezioni.extendedData['ss'] = this._settoreSanitarioForm.value;
        sezioniSottosezioni.extendedData['as'] = this._altriServizieFornitureForm.value;
        return retval;
    }

    private getChildByType( type: number, create: boolean = true, name: string = ''): ModuloCommissari {
        let candidates: ModuloCommissari[] = this.currentData.children.filter((uno: ModuloCommissari) => uno.subtype === type);
        if (candidates.length > 0) { return candidates[0]; } else {
            if (create) {
                let child: ModuloCommissari = new ModuloCommissari();
                child.name = name;
                child.subtype = type;
                this.currentData.children.push(child);
                return child;
            }
        }
        return undefined;
    }
    ///
    //
    ///
    private setupStep2Data(dati: ModuloCommissari, action: string): void {
        if (action !== 'add') {
            let nodi: ModuloCommissari[] = this.currentData.children.filter((uno: ModuloCommissari) => uno.subtype === 1002);
            if (nodi.length > 0) {
                let nodo: ModuloCommissari = nodi[0];
                let val =  this._categorieForm.form.value;
                val = this.ext2formVal(val, nodo.extendedData);
                this._categorieForm.form.setValue(val);
                this._categorieForm.refresh();
                }
            }
        this.ref.markForCheck();
        this.ref.detectChanges();
    }
    ///
    //
    ///
    private collectStep2Data(): number  {
        console.log('COLLECTING STEP 2');
        let nodo: ModuloCommissari = this.getChildByType(1002, true, 'Categorie');
        nodo.extendedData = this._categorieForm.value;
        let flags = this._categorieForm.value;
 //       console.log(flags.catDipAmmState);
        if ((flags.catDipAmmState) && (flags.catDipAmmState === 'in servizio' )) {
//           console.log('AUSA VISIBILE');
            this.vediCodiceAusa = true;
        } else {
//            console.log('AUSA  NON VISIBILE');
            this.vediCodiceAusa = false;
        }
        return 0;
    }
    ///
    //
    ///
    private setupStep3Data(dati: ModuloCommissari, act: string): void {
        if (act !== 'add') {
            let nodi: ModuloCommissari[] = this.currentData.children.filter((uno: ModuloCommissari) => uno.subtype === 1003);

            if (nodi.length > 0) {
                let nodo: ModuloCommissari = nodi[0];
                console.log(this._codAusaForm);

                if ((this._codAusaForm)&&(nodo.extendedData['dipendentiPA'])) {
                    let datiAusa = this._codAusaForm.form.value;
                    datiAusa = this.ext2formVal(datiAusa, nodo.extendedData['dipendentiPA']);
                    this._codAusaForm.form.setValue(datiAusa);
                    this._codAusaForm.refresh();
                   
                } else {
                    nodo.extendedData['dipendentiPA'] = undefined;
                }
                let poss_requisiti = this._possessoRequisitiForm.form.value;
                poss_requisiti = this.ext2formVal(poss_requisiti, nodo.extendedData['inoltre']);
//                poss_requisiti = Object.assign(poss_requisiti, nodo.extendedData['inoltre']);
                this._possessoRequisitiForm.form.setValue(poss_requisiti);
                this._possessoRequisitiForm.refresh();

                console.log(nodo.extendedData['reqSezioniSottosezioni']);
                let datiRequisiti = this._reqSezioneSottosezioneForm.form.value;
                datiRequisiti = this.ext2formVal(datiRequisiti, nodo.extendedData['reqSezioniSottosezioni']);
//                datiRequisiti = Object.assign(datiRequisiti, nodo.extendedData['reqSezioniSottosezioni']);
                this._reqSezioneSottosezioneForm.form.setValue(datiRequisiti);

                this.selectedCategory = nodo.extendedData['selectedCategory'];
                this._reqSezioneSottosezioneForm.refresh();
                }
            }
        this.ref.markForCheck();
        this.ref.detectChanges();
    }
    ///
    //
    ///
    private collectStep3Data(): number  {
        let nodo: ModuloCommissari = this.getChildByType(1003, true, 'Requisiti');
        if (this._codAusaForm) {
//            console.log('collecting values PA')
            nodo.extendedData['dipendentiPA'] = this._codAusaForm.value;
        } else {
            nodo.extendedData['dipendentiPA'] = undefined;
        }
        nodo.extendedData['inoltre'] = this._possessoRequisitiForm.value;
        nodo.extendedData['reqSezioniSottosezioni'] = this._reqSezioneSottosezioneForm.value;
        nodo.extendedData['selectedCategory'] = this.selectedCategory;
        return 0;
    }
    ///
    //
    ///
    private setupStep4Data(dati: ModuloCommissari, act: string): void {
        if (act !== 'add') {
            let nodi: ModuloCommissari[] = this.currentData.children.filter((uno: ModuloCommissari) => uno.subtype === 1003);
//            console.log(nodi.length);
            if (nodi.length > 0) {
                let nodo: ModuloCommissari = nodi[0];
                if ((this._requisitiPagamentoIscrizioneForm)&&( nodo.extendedData['pagamento'])) {
//                    console.log(nodo.extendedData['pagamento']);
                    let formPagamento =this._requisitiPagamentoIscrizioneForm.form.value;
                    formPagamento = this.ext2formVal(formPagamento,  nodo.extendedData['pagamento']);
                    //formPagamento = Object.assign(formPagamento, nodo.extendedData['pagamento']);
                    this._requisitiPagamentoIscrizioneForm.form.setValue(formPagamento);
                    this._requisitiPagamentoIscrizioneForm.refresh();
                }
           }
        }
        this.ref.markForCheck();
        this.ref.detectChanges();
    }
    ///
    //
    ///
    private collectStep4Data(): number  {
        console.log('COLLECT STEP $');
        let nodo: ModuloCommissari = this.getChildByType(1003, true, 'Requisiti');
        if (!isUndefined(this._requisitiPagamentoIscrizioneForm)) {
            console.log('collecting values pagamento')
            nodo.extendedData['pagamento'] = this._requisitiPagamentoIscrizioneForm.value;
        } else {
            nodo.extendedData['pagamento'] = undefined;
        }
        return 0;
    }
        ///
    //
    ///
    private setupStep5Data(dati: ModuloCommissari, action: string): void {
    //    console.log(JSON.stringify(this._requisitiMoralitaForm.value));
        if (action !== 'add') {
            let nodi: ModuloCommissari[] = this.currentData.children.filter((uno: ModuloCommissari) => uno.subtype === 1004);
            if (nodi.length > 0) {
                let nodo: ModuloCommissari = nodi[0];
                let moralità = this._requisitiMoralitaForm.form.value;
                moralità = this.ext2formVal(moralità,  nodo.extendedData);
                this._requisitiMoralitaForm.form.setValue(moralità);
                this._requisitiMoralitaForm.refresh();
            }
        }
        this.ref.markForCheck();
        this.ref.detectChanges();
    }
    ///
    //
    ///
    private collectStep5Data(): number  {
        let nodo: ModuloCommissari = this.getChildByType(1004, true, 'Requisiti moralita');
        nodo.extendedData = this._requisitiMoralitaForm.value;
        return 0;
    }
    ///
    /// Navigazione
    ///
    private setActiveStep(active: number): void {
        console.log('SET ACTIVE STEP:' + active);
        this.markStepActive(active);
    }
    ///////////////////
    /// Validazione
    //////////////////

    private validaDatiCategorie(): boolean {
        let retval: boolean = true;
        console.log(this._categorieForm.value);
        let vals = this._categorieForm.value;
        if ((vals['catProfConOrdine'] === false) &&
            (vals['catProfSenzaOrdine'] === false) &&
            (vals['catDipAmm'] === false) &&
            (vals['catAccademici'] === false)) {

                this.errorMessage = 'Una delle categorie deve essere selezionata';
                return false;
        }
        let dipendenti: boolean = vals['catDipAmm'];
        let dipendentiStato: AbstractControl = (this._categorieForm.form.controls['catDipAmmState']);

        console.log(dipendenti);
        console.log(dipendentiStato.value);

        if ((dipendenti === true) && (dipendentiStato.value === null ))  {
            dipendentiStato.setErrors({catDipAmmState: 'NeedsValue'});
            this.errorMessage = 'Campo stato di servizio dipendenti delle amministrazioni aggiudicatirci deve essere specificato';
            dipendentiStato.markAsTouched({ onlySelf: true });
            return false;
        }
        return retval;
    }
    ///
    /// Deve essere spuntao uno 
    ///
    private validaSezioni(): boolean {

        if ((this._sezioneForm.value['sezioneordinaria'] === false) && (this._sezioneForm.value['sezionespeciale'] === false)) {
            this.errorMessage = 'Uno di due sezioni (Ordinaria o Speciale) deve essere selezionato';
            return false;
        }
        if (this._sezioneForm.value['sezionespeciale'] === true) {
            if ((this._sezioneSpecialeForm.value['sezspecialeconsip'] === false) &&
                (this._sezioneSpecialeForm.value['sezspecialedirigente'] === false) &&
                (this._sezioneSpecialeForm.value['sezspecialeprimario'] === false)) {

                this.errorMessage = 'Una delle sezioni speciali deve essere selezionata';
                return false;
            }
        }
    }
    ///
    /// Deve essere spuntao uno 
    ///
    private validaSottoSezioni(): boolean {
        if ((this.professioniTeschniche.length === 0 ) && (this.altriServiziEForniture.length === 0) && (this.settoreSanitario.length === 0)) {
            this.errorMessage = 'Una professione da tre elenchi presentati deve essere selezionata';
            return false;
        }
        return true;
    }

    //////////////////////////////////////////////////
    ///Tabs navigation
    /////////////////////////////////////////////////
    private canGoFrom0To1(): boolean {

        if (this.validaSezioni() === false) {

            return false;
        }
        if (this.validaSottoSezioni() === false) {

            return false;
        }

        return true;
    }
    private canGoFrom1To2(): boolean {
        let retval: boolean = true;
        /// Validazione seconda pagina 
        console.log('INSIDE CAN GO FROM 1-2');
        retval = this.validaDatiCategorie();
        return retval;
    }

    private canGoFrom2To3(): boolean {
        let retval: boolean = true;
        if (this._codAusaForm) {
            retval = this._codAusaForm.valid;
            if (!retval) {
                this.errorMessage = 'Errore in immissione requisiti dipendenti PA';
                return retval;
            }
        }
        if (this._codAusaForm) {
            retval = this.nomeAusa !== 'non rilevata';
            if (!retval) {
                this.errorMessage = 'Ausa non trovata';
                return retval;
            }
        }

        if (this._possessoRequisitiForm) {
            retval = this._possessoRequisitiForm.value['possesso-requisiti'];
            if (!retval) {
                this.errorMessage = 'Errore in confrema dichiarazione possesso requisiti per categoria';
                return retval;
            }
        }
        if ((this.selectedCategory === '') || (this.selectedCategory === undefined)) {
            this.errorMessage = 'Una categoria preferita deve essere selezionata';
            return false;
        }

        if (this._reqSezioneSottosezioneForm) {
            let vals = this._reqSezioneSottosezioneForm.value;
            let checks = Object.keys(vals).forEach((field) => {
                if (field.substr(field.length - 5) === 'check') {

                    if (vals[field] !== true) {
                        retval = false;
                    }
                }
            });
            if (!retval) {
                this.errorMessage = 'Dichiarazioni devono essese confermate';
                return retval;
            }
            Object.keys(this._reqSezioneSottosezioneForm.form.controls).forEach(field => { // {1}
                const control = this._reqSezioneSottosezioneForm.form.get(field);            // {2}
                control.markAsTouched({ onlySelf: true });       // {3}
              });
            this._reqSezioneSottosezioneForm.refresh();
            this.ref.detectChanges();
            retval = this._reqSezioneSottosezioneForm.valid;
            if (!retval) {
                this.errorMessage = 'Errore in dati relativi al requisiti derivanti alla sezione/sottosezione';
                return retval;
            }
        }
        return retval;
    }
    private canGoFrom3To4(): boolean {
        let retval: boolean = true;
        console.log('Can go from 324');
        if (this._requisitiPagamentoIscrizioneForm) {
            let vals = this._requisitiPagamentoIscrizioneForm.value;
            if (vals['tariffa-pagata'] !== true) {
                this.errorMessage = 'Pagamento deve essere dichiarato';
                return false;
            }
            Object.keys(this._requisitiPagamentoIscrizioneForm.form.controls).forEach(field => { // {1}
                const control = this._requisitiPagamentoIscrizioneForm.form.get(field);            // {2}
                control.markAsTouched({ onlySelf: true });       // {3}
              });
            this._requisitiPagamentoIscrizioneForm.refresh();
            retval = this._requisitiPagamentoIscrizioneForm.valid;
            if (!retval) {
                this.errorMessage = 'Errore in dati pagamento';
                return retval;
            }
        }
        return retval;
    }
    private canFinish(): boolean {
        let mVals = this._requisitiMoralitaForm.value;
//        console.log(mVals);
        let arr:string[] = Object.keys(mVals).map((key) => (mVals[key] === false) ? key : '');
//        console.log(arr);
        let arr1=arr.filter(f => f !== undefined && f !== null && f !== "") as any;
//        console.log(arr1);
        if (arr1.length > 0) {
            this.errorMessage = 'Requisiti di moralita devono essere dichiarati tutti';
            return false;
        }
    console.log('RETURNING TRUE');
    return true;
    }

    private canSave(): boolean {
        let retval: boolean = true;
        console.log(this._preSaveForm.value);
        if (this._preSaveForm.value['dataProtection'] === true) {
            return true;
        }
       this.errorMessage = 'Informativa sulla privacy deve essere accettata';
        return false;
    }

    private toggleRequiredStep1(): void { this.stateStep1 = (this.stateStep1 === StepState.Required ? StepState.None : StepState.Required); }
    private toggleRequiredStep2(): void { this.stateStep2 = (this.stateStep2 === StepState.Required ? StepState.None : StepState.Required); }
    private toggleCompleteStep3(): void { this.stateStep3 = (this.stateStep3 === StepState.Complete ? StepState.None : StepState.Complete); }
    private toggleCompleteStep4(): void { this.stateStep4 = (this.stateStep4 === StepState.Complete ? StepState.None : StepState.Complete); }
    private toggleCompleteStep5(): void { this.stateStep5 = (this.stateStep5 === StepState.Complete ? StepState.None : StepState.Complete); }
    private toggleCompleteStep6(): void { this.stateStep6 = (this.stateStep6 === StepState.Complete ? StepState.None : StepState.Complete); }

    ///
    // setup data
    ///
    private activeStep1Event(): void {
        console.log('ACTIVATE SEZIONI');
        if (this.currentData) {
            this.setupFirstPageData(this.currentData, this.action);
        }
    }
    /// Step 1 è dissattivato
    private deactiveStep1Event(): void {
        console.log('DACTIVATE SEZIONI');
        this.sezioneFormChangedCallback.unsubscribe();
        this.professioniTecnicheChangedCallback.unsubscribe();
        this.settoreSanitarioChangedCallback.unsubscribe();
        this.altriServizieFornitureChangedCallback.unsubscribe();
    }

    private  activeStep2Event(): void {
        console.log('ACTIVATE PROFILO');
        this.setupStep2Data(this.currentData, this.action);
        this.manageProfiloApplicant(this._categorieForm.value);
    }
    private  deactiveStep2Event(): void {
        this.categorieChangedCallback.unsubscribe();
        console.log('DACTIVATE PROFILO');
    }

    private activeStep3Event(): void {
        console.log('ACTIVATE REQUISITI');
        this.setupStep3Data(this.currentData, this.action);
        this.manageCodAusaChanges();
        if (this.vediCodiceAusa) {
            this.codAusaFormChangedCallback = this._codAusaForm.form.valueChanges.subscribe(() => {
                this.manageCodAusaChanges();
            });
        }
    }

    private deactiveStep3Event(): void {
        console.log('DACTIVATE REQUISITI');
        if(this.vediCodiceAusa){
            this.codAusaFormChangedCallback.unsubscribe();
        }
    }

    private activeStep4Event(): void {
        console.log('ACTIVATE PAGAMENTO');
        this.setupStep4Data(this.currentData, this.action);
    }

    private deactiveStep4Event(): void {
        console.log('DACTIVATE PAGAMENTO');
    }

    private activeStep5Event(): void {
        console.log('ACTIVATE MORALITA'); 
        this.setupStep5Data(this.currentData, this.action);
    }
    private deactiveStep5Event(): void {
        console.log('DACTIVATE MORALITA');
        this.activeDeactiveStepMsg = 'Deactive event emitted.';
    }

    private activeStep6Event(): void {
        console.log('ACTIVATE PRIVACY');
    }

    private deactiveStep6Event(): void { 
        console.log('DACTIVATE PRIVACY');
    }

    private step_changed($event): void { console.log('STEP CHANGED'); }

    private  goBack(): void {
        this._router.navigate(['/iscrizione']);
    }
////
    private avanti(): void {
        console.log('AVANTI' + this.activeStepIdx);
        this.errorMessage = undefined;
        /// PRIMA PAGINA
        if (this.activeStepIdx === 0) {
          if (this.canGoFrom0To1()) {
            this.collectFirstPageData();
            this.setActiveStep(1);
            this.stateStep1 = StepState.Complete;
          } else {
            this.stateStep1 = StepState.Required;
            let alertConfig: IAlertConfig = {
                title: 'Verifica dati : Impossibile passare allo step successivo',
                message: JSON.stringify(this.errorMessage),
                closeButton: 'CHIUDI',
              };
            this._dialogService.openAlert(alertConfig);
          }
          return;
        }
        //// PROFILO
        if (this.activeStepIdx === 1) {
            if (this.canGoFrom1To2()) {
                this.collectStep2Data();
                this.setActiveStep(2);
                this.stateStep2 = StepState.Complete;
              } else {
                this.stateStep2 = StepState.Required;
                let alertConfig: IAlertConfig = {
                    title: 'Verifica dati : Impossibile passare allo step successivo',
                    message: JSON.stringify(this.errorMessage),
                    closeButton: 'CHIUDI',
                  };
                this._dialogService.openAlert(alertConfig);
              }
            return;
        }
        /// REQUISITI
        if (this.activeStepIdx === 2) {
            if (this.canGoFrom2To3()) {
                this.collectStep3Data();
                this.setActiveStep(3);
                this.stateStep3 = StepState.Complete;
              } else {
                this.stateStep3 = StepState.Required;
                let alertConfig: IAlertConfig = {
                    title: 'Verifica dati : Impossibile passare allo step successivo',
                    message: JSON.stringify(this.errorMessage),
                    closeButton: 'CHIUDI',
                  };
                this._dialogService.openAlert(alertConfig);
              }
            return;
        }
        ///Pagamento
        if (this.activeStepIdx === 3) {
            if (this.canGoFrom3To4()) {
                this.collectStep4Data();
                this.setActiveStep(4);
                this.stateStep4 = StepState.Complete;
            } else {
                this.stateStep4 = StepState.Required;
                let alertConfig: IAlertConfig = {
                    title: 'Verifica dati : Impossibile passare allo step successivo',
                    message: JSON.stringify(this.errorMessage),
                    closeButton: 'CHIUDI',
                  };
                this._dialogService.openAlert(alertConfig);
              }
            return;
        }
        /// MORALITA
        if (this.activeStepIdx === 4) {
            if (this.canFinish()) {
                this.collectStep5Data();
                this.setActiveStep(5);
                this.stateStep5 = StepState.Complete;
              } else {
                this.stateStep5 = StepState.Required;
                let alertConfig: IAlertConfig = {
                    title: 'Verifica dati : Impossibile passare allo step successivo',
                    message: JSON.stringify(this.errorMessage),
                    closeButton: 'CHIUDI',
                  };
                this._dialogService.openAlert(alertConfig);
            }
            return;
        }
        if (this.activeStepIdx === 5) {
            if (this.canSave()) {
                this.save();
              } else {
                console.log('SAVE IMPOSIBILE');
              }

        }
        return;
    }

    private indietro(): void {
        if (this.activeStepIdx === 1) {
            this.setActiveStep(0);
            this.registraEventiIniziali();
            return;
        }
        if (this.activeStepIdx === 2) {
            this.setActiveStep(1);
            return;
        }
        if (this.activeStepIdx === 3) {
            this.setActiveStep(2);
            return;
        }
        if (this.activeStepIdx === 4) {
            this.setActiveStep(3);
            return;
        }
        if (this.activeStepIdx === 5) {
            this.setActiveStep(4);
            return;
        }
        if (this.activeStepIdx === 6) {
            this.setActiveStep(5);
            return;
        }
        return;
    }

    private markStepActive(activeIdx = 0): void {
        if ( this.stepDeactivateSubscription ) { this.stepDeactivateSubscription.unsubscribe(); }

        this.activeStepIdx = activeIdx;
        this.steps.forEach((step, idx) => {
          if (this.activeStepIdx === idx) {
            step.disabled = false;
            step.active = true;
          } else {
            step.disabled = true;
          }
          step.state = (idx < this.activeStepIdx) ? StepState.Complete : StepState.None;
        });

        this.activeStep = this.steps.toArray()[this.activeStepIdx];
        this.ref.detectChanges();

        if (this.activeStep) {
          this.stepDeactivateSubscription = this.activeStep.onDeactivated
            .subscribe( () => this.activeStep.active = true );

        }
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///
    // Gestisce visibilità campi in sezione "Sezione"
    ///


    private manageSezioneForm(flags: any): void {
        console.log('manageSezioneForm');
        this.SezioneSpecialeVisible = flags['sezionespeciale'];

        this.ref.detectChanges();
        /*
        if (this.SezioneSpecialeVisible) {
            this.secspecChangeCallback = this._sezioneSpecialeForm.form.valueChanges.subscribe(() => {
                this.restrictSezioneSpeciale(this._sezioneSpecialeForm.value, this._sezioneSpecialeForm.value);
            });
            this.SezioneSpecialeVals = this._sezioneSpecialeForm.value;
        } else {
            if (this._sezioneSpecialeForm) {
                this.secspecChangeCallback.unsubscribe();
                this.SezioneSpecialeVals = {sezspecialeconsip: false, sezspecialedirigente: false, sezspecialeprimario: false};
           }
        }*/
        this.ref.markForCheck();
    }
/*** 
    private restrictSezioneSpeciale(event, dati) {
        this.secspecChangeCallback.unsubscribe();
        this.ref.detectChanges();
        let vals = this._sezioneSpecialeForm.value;
        if (vals['sezspecialeconsip']===this.SezioneSpecialeVals['sezspecialeconsip']&&vals['sezspecialedirigente']===this.SezioneSpecialeVals['sezspecialedirigente']&&vals['sezspecialeprimario']===this.SezioneSpecialeVals['sezspecialeprimario']) {
            console.log('UGUALI');
        } else {
            Object.keys(vals).forEach((key) => {vals[key] = (vals[key] === this.SezioneSpecialeVals[key]) ? false : true; } );
            this._sezioneSpecialeForm.form.setValue(vals);
            this.SezioneSpecialeVals = vals;
        }
        this.secspecChangeCallback = this._sezioneSpecialeForm.form.valueChanges.subscribe((event) => {
            this.restrictSezioneSpeciale(event, this._sezioneSpecialeForm.value);
        });
    }
    */
    ///
    // Callback gestione di form dentro settore sanitario expansion panel
    ///
    private manageprofessioniTeschnicheForm(flags: any): void {
        this.professioniTeschniche = [];
        let arr = Object.keys(flags).map( (key) => (flags[key] === true) ? key : '');
        for (let i in arr) {
            if (arr[i] !== '') {

                this.professioniTeschniche.push(this.ProfessioniTechnicheElements[i]['label']);
            }
        }
        this._professioniTeschnicheExpansion.sublabel = this.professioniTeschniche.toString();
        this.aggiungiSottosezioni('reqSottosezione');
        this.ref.detectChanges();
    }

    /// Callback gestione di form dentro settore sanitario expansion panel
    private manageSettoreSanitarioForm(flags: any): void {
        this.settoreSanitario = [];
        let  arr = Object.keys(flags).map( (key) => (flags[key] == true) ? key : '');
        for (let i in arr) {
            if (arr[i] != '') {
                this.settoreSanitario.push(this.SettoreSanitarioElements[i]['label']);
            }
        }
        this._settoreSanitarioFormExpansion.sublabel = this.settoreSanitario.toString();
        this.aggiungiSottosezioni('reqSottosezione');
        this.ref.detectChanges();
    }

    /// Callback gestione di form dentro altre forniture expansion panel
    private manageAltriServizieFornitureForm(flags: any): void {
        this.altriServiziEForniture = [];
        let arr = Object.keys(flags).map((key) => (flags[key] === true) ? key : '');
        for (let i in arr) {
            if (arr[i] != '') {
                this.altriServiziEForniture.push(this.AltriServiziFornitureElements[i]['label']);
            }
        }
        this._altriServizieFornitureExpansion.sublabel = this.altriServiziEForniture.toString();
        this.aggiungiSottosezioni('reqSottosezione');
        this.ref.detectChanges();
    }

    ///
    // Aggiungi sottosezioni al form
    ///
    private aggiungiSottosezioni(baseNome: string): void {
        let indice: number = 1;
        this.RequisitiSezioneSottoSezione = [];
        for (let p in this.professioniTeschniche) {
            let sottosezione: ITdDynamicElementConfig = {
                label: 'Sottosezione ' + this.professioniTeschniche[p],
                name: this.professioniTeschniche[p].replace(/\s/g, '_') + '_check',
                type: TdDynamicElement.Checkbox,
                required: true,
                flex: 50,
                default: true,
            };
            this.RequisitiSezioneSottoSezione.push(sottosezione);
            let sottosezione1: ITdDynamicElementConfig = {
                label: 'Esperienza in campo',
                name: this.professioniTeschniche[p].replace(/\s/g, '_') + '_esperienza',
                type: TdDynamicElement.Select,
                selections: ['di possedere l\'esperienza richiesta per gli affidamenti complessi',
                    'di NON possedere l\'esperienza richiesta per gli affidamenti complessi'],
                required: true,
                flex: 50,
            };
            this.RequisitiSezioneSottoSezione.push(sottosezione1);
            indice++;
        }
        for (let p in this.settoreSanitario) {
            let sottosezione: ITdDynamicElementConfig = {
                label: 'Sottosezione ' + this.settoreSanitario[p],
                name:  this.settoreSanitario[p].replace(/\s/g, '_') + '_check',
                type: TdDynamicElement.Checkbox,
                required: true,
                flex: 50,
                default: true,
            };
            this.RequisitiSezioneSottoSezione.push(sottosezione);
            let sottosezione1: ITdDynamicElementConfig = {
                label: 'Esperienza in campo',
                name:  this.settoreSanitario[p].replace(/\s/g, '_') + '_esperienza',
                type: TdDynamicElement.Select,
                selections: ['di possedere l\'esperienza richiesta per gli affidamenti complessi',
                        'di NON possedere l\'esperienza richiesta per gli affidamenti complessi'],
                required: true,
                flex: 50,
            };
            this.RequisitiSezioneSottoSezione.push(sottosezione1);
            indice++;
        }
        for (let p in this.altriServiziEForniture) {
            let sottosezione: ITdDynamicElementConfig = {
                label: 'Sottosezione ' + this.altriServiziEForniture[p],
                name: this.altriServiziEForniture[p].replace(/\s/g, '_') + '_check',
                type: TdDynamicElement.Checkbox,
                required: true,
                flex: 50,
                default: true,
            };
            this.RequisitiSezioneSottoSezione.push(sottosezione);
            let sottosezione1: ITdDynamicElementConfig = {
                label: 'Esperienza in campo',
                name: this.altriServiziEForniture[p].replace(/\s/g, '_') + '_esperienza',
                type: TdDynamicElement.Select,
                selections: ['di possedere l\'esperienza richiesta per gli affidamenti complessi',
                        'di NON possedere l\'esperienza richiesta per gli affidamenti complessi'],
                required: true,
                flex: 50,
            };
            this.RequisitiSezioneSottoSezione.push(sottosezione1);
            indice++;
        }

    }
    ///
    // Callback di gestione passi di wizard rispetto alla scelta do categoria applicante
    ///

    private manageProfiloApplicant(flags: any): void {
      //  categorie:{ catProfConOrdine, catProfSenzaOrdine, catDipAmm, catDipAmmState, catAccademici }
    if (this.categorieChangedCallback) {
        this.categorieChangedCallback.unsubscribe();
    }
    console.log(flags);
    this.CategorieCheckedElements = [];
    if (flags.catProfConOrdine === true) { this.CategorieCheckedElements.push((this.CategorieElements[0] as ITdDynamicElementConfig)); }
    if (flags.catProfSenzaOrdine === true) { this.CategorieCheckedElements.push((this.CategorieElements[1] as ITdDynamicElementConfig)); }

    if (flags.catDipAmm === true) {
        console.log('DIP CHECKED');
        this.CategorieCheckedElements.push((this.CategorieElements[2] as ITdDynamicElementConfig));
        if (this.CategorieElements[3].required === false) {
                this.CategorieElements[3].required = true;
                this._categorieForm.refresh();
                this.ref.detectChanges();
            }
        } else {
            console.log('DIP UNCHECKED');
            this._categorieForm.controls['catDipAmmState'].setValue(null);
            this.ref.detectChanges();
            if (this.CategorieElements[3].required === true ) {
                this.CategorieElements[3].required = false;
                this._categorieForm.refresh();
                console.log('SETTING STATO A NULL');
            }
        }
    flags = this._categorieForm.value;
    if (flags.catAccademici === true) {
        this.CategorieCheckedElements.push((this.CategorieElements[4] as ITdDynamicElementConfig));
    }
    console.log(flags.catDipAmmState);

    if ((flags.catDipAmmState) && (flags.catDipAmmState === 'in servizio' )) {
            console.log('AUSA VISIBILE');
            this.vediCodiceAusa = true;
        } else {
            console.log('AUSA  NON VISIBILE');
            this.vediCodiceAusa = false;
        }
    this.ref.detectChanges();
    this.categorieChangedCallback = this._categorieForm.form.valueChanges.subscribe(() => {
        this.manageProfiloApplicant(this._categorieForm.value);
    });
    if (this.CategorieCheckedElements.length > 0) {
        this.selectedCategory = this.CategorieCheckedElements[0].label;
    } else {
        this.selectedCategory = '';
    }
    }

    private manageCodAusaChanges(): void {
        this.vediPagamento = true;
        if (this._codAusaForm) {
            let ss: string = <string>(this._codAusaForm.value['intenzione-partecipazione']) || 'buongiorno';
            let ss1: string = ss.substring(0, 4);
            this.vediPagamento = (ss1 !== 'solo');
            let codice: string = <string>(this._codAusaForm.value['codice-ausa']) || 'unknown';
           // this.loadAusaName(codice);
            console.log('CODICE AUSA =' + codice);
        }
    }
    /*
    async loadAusaName(id: string): Promise<void> {
        let response: RestResponse = null;
        try {
        response = await this._iscrizioneService.getAusaName(id).toPromise();
        if (response.errorID === 0) {
            this.nomeAusa = response.dato||'non rilevata';
        } else {
            this.nomeAusa = 'non rilevata';
        }
        } catch (error) {
        console.log(`An error has occured : ${error}`);
        this.nomeAusa = 'non rilevata';
        }
    }*/
}

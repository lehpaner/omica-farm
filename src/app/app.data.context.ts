import { Inject, Injectable, EventEmitter } from '@angular/core';
import { TdDynamicFormsComponent, TdDynamicElement, TdDynamicType, 
    ITdDynamicElementConfig, ITdDynamicElementValidator } from '@covalent/dynamic-forms';
import { AbstractControl, Validators } from '@angular/forms';
import { AppCtx, IPropertyChangedEvent } from './app.context';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

export interface IFormDescription {
    nome: string;
    descrizione: string;
    campi: ITdDynamicElementConfig[];
}

@Injectable()
export class AppDataCtx {

    /**
     * CONSTRUCTOR
     */
    constructor() { };
    forms: any[] = [];
    configChangeSubscription: any;

    public initFromConfig(ctx: AppCtx): void {
        console.log('Data context init...');
        let config = ctx.config;
        this.forms = config['forms'];
        this.configChangeSubscription = ctx.configChanged.subscribe(prop => this.onConfigChanged(prop));
        return;
    }

    onConfigChanged(event: IPropertyChangedEvent) {
        console.log('CONFIG CHANGED');
        let config: any = event.newVal;
        this.forms = config['forms'];
    }
    public getDefaultPersonalDataFormSeed(): ITdDynamicElementConfig[] {
        let retval: ITdDynamicElementConfig[] = [
            {
                label: 'Nome',
                name: 'nome',
                type: TdDynamicElement.Input,
                required: true,
                flex: 50,
              },
              {
                label: 'Cognome',
                name: 'cognome',
                type: TdDynamicElement.Input,
                required: true,
                flex: 50,
              },
              {
                label: 'Comune di nascita',
                name: 'comunenascita',
                type: TdDynamicElement.Input,
                required: true,
                flex: 50,
              },
              {
                label: 'Data di nascita',
                name: 'datanascita',
                type: TdDynamicElement.Datepicker,
                required: true,
                flex: 50,
              },
              {
                label: 'Codice fiscale',
                name: 'cf',
                type: TdDynamicElement.Input,
                required: true,
                flex: 50,
                validators: [{
                    validator: Validators.pattern(/^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/)} ],
              },
              {
                label: 'PEC',
                name: 'pec',
                type: TdDynamicElement.Input,
                required: true,
                flex: 50,
                validators: [{
                    validator: Validators.pattern(/^[a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,15})$/)} ],
              },
        ];
        return retval;
    }

    public getDefaultSezioni(): ITdDynamicElementConfig[] {

        let retval: ITdDynamicElementConfig[] = [
            {
                label: 'Ordinaria',
                name: 'sezioneordinaria',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Speciale',
                name: 'sezionespeciale',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
        ];
        let sezioniForm: IFormDescription[] = this.forms.filter((uno: IFormDescription) => uno.nome === 'sezioni');
        if (sezioniForm.length > 0) {
            return sezioniForm[0].campi;
        }
        return retval;
    }

    public getDefaultSezioniSpeciali(): ITdDynamicElementConfig[] {
        let retval: ITdDynamicElementConfig[] = [
            {
                label: "dipendente di Consip S.p.A., Invitalia S.p.A. e dei Soggetti Aggregatori Regionali di cui all'art. 9 del d.l. 66/2014, convertito \n con modificazioni dalla legge 89/2014 oppure esperto che ha prestato attivita' di consulenza per i medesimi soggetti per un periodo non inferiore a due anni",
                name: 'sezspecialeconsip',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'dirigente delle amministrazioni aggiudicatrici',
                name: 'sezspecialedirigente',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'primario ospedaliero e posizioni assimilate',
                name: 'sezspecialeprimario',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
        ];
        let sezioniSpecialiForm: IFormDescription[] = this.forms.filter((uno: IFormDescription) => uno.nome === 'sezioniSpeciali');
        if (sezioniSpecialiForm.length > 0) {
            return sezioniSpecialiForm[0].campi;
        }
        return retval;
    }

    public getDefaultProfessioniTechniche(): ITdDynamicElementConfig[] {
        let retval: ITdDynamicElementConfig[] = [
            {
                label: 'Architetto',
                name: 'profTec_1',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Paesaggista',
                name: 'profTec_2',
                'type': TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Architetto iunior',
                name: 'profTec_3',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Conservatore',
                name: 'profTec_4',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Ingegnere civile e ambientale',
                name: 'profTec_5',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Ingegnere civile e ambientale iunior',
                name: 'profTec_6',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Ingegnere industriale',
                name: 'profTec_7',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: "Ingegnere informazione",
                name: 'profTec_8',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: "Ingegnere informazione iunior",
                name: 'profTec_9',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Geometra',
                name: 'profTec_10',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Perito edile',
                name: 'profTec_11',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Dottore Agronomo e Dottore Forestale',
                name: 'profTec_12',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Agronomo e Forestale iunior',
                name: 'profTec_13',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Perito agrario',
                name: 'profTec_14',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Chimico',
                name: 'profTec_15',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Chimico iunior',
                name: 'profTec_16',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Geologo',
                name: 'profTec_17',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Geologo iunior',
                name: 'profTec_18',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Perito Industriale',
                name: 'profTec_19',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: "Perito industriale con specializzazione nel settore informazione e comunicazione",
                name: 'profTec_20',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Pianificatore territoriale e Urbanista',
                name: 'profTec_21',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Pianificatore iunior',
                name: 'profTec_22',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Tecnologo alimentare',
                name: 'profTec_23',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Agrotecnico e Agrotecnico laureato',
                name: 'profTec_24',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Restauratore di Beni Culturali',
                name: 'profTec_25',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
        ];
        let professioniTechincheForm: IFormDescription[] = this.forms.filter((uno: IFormDescription) => uno.nome === 'professioniTecniche');
        if (professioniTechincheForm.length > 0) {
            return professioniTechincheForm[0].campi;
        }
        return retval;
    }

    public getDefaultSettoreSanitarioElements(): ITdDynamicElementConfig[] {
        let retval: ITdDynamicElementConfig[] = [
            {
                label: 'Farmacista',
                name: 'setSanitario_1',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico chirurgia generale plastica e toracica',
                name: 'setSanitario_2',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico neurochirurgia neurologia e neurofisiologia',
                name: 'setSanitario_3',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico medicina interna',
                name: 'setSanitario_4',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico urologia e nefrologia',
                name: 'setSanitario_5',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico ortopedia',
                name: 'setSanitario_6',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico ginecologia ostetricia',
                name: 'setSanitario_7',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico pediatria',
                name: 'setSanitario_8',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico tisiologia e malattie apparato respiratorio',
                name: 'setSanitario_9',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico anatomia patologica',
                name: 'setSanitario_10',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico neuropsichiatria psichiatria e psichiatria infantile',
                name: 'setSanitario_11',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico radioterapia',
                name: 'setSanitario_12',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico anestesia e rianimazione',
                name: 'setSanitario_13',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico oftalmologia/oculistica',
                name: 'setSanitario_14',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico otorinolaringoiatria',
                name: 'setSanitario_15',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico cardiologia, cardio-angio chirurgia',
                name: 'setSanitario_16',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico chirurgia apparato digerente e gastroenterologia',
                name: 'setSanitario_17',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico reumatologia',
                name: 'setSanitario_18',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico radiodiagnostica radiologia e medicina nucleare',
                name: 'setSanitario_19',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico clinica biologica biochimica e farmacologia',
                name: 'setSanitario_20',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico microbiologia batteriologica',
                name: 'setSanitario_21',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico medicina del lavoro',
                name: 'setSanitario_22',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico dermatologia',
                name: 'setSanitario_23',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico geriatria',
                name: 'setSanitario_24',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico allergologia immunologia e malattie infettive',
                name: 'setSanitario_25',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico ematologia generale e biologica',
                name: 'setSanitario_26',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico endocrinologia',
                name: 'setSanitario_27',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Fisioterapista',
                name: 'setSanitario_28',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Medico dermatologia e veneralogia',
                name: 'setSanitario_29',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Infermieri',
                name: 'setSanitario_30',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Tecnico di radiologia',
                name: 'setSanitario_31',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Odontoiatria',
                name: 'setSanitario_32',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Veterinario',
                name: 'setSanitario_33',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Psicologo',
                name: 'setSanitario_34',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Ingegnere biomedico e clinico',
                name: 'setSanitario_35',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Assistente Sociale',
                name: 'setSanitario_36',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
        ];
        let settoreSanitarioForm: IFormDescription[] = this.forms.filter((uno: IFormDescription) => uno.nome === 'settoreSanitario');
        if (settoreSanitarioForm.length > 0) {
            return settoreSanitarioForm[0].campi;
        }
        return retval;
    }

    public getDefaultAltriServiziElements(): ITdDynamicElementConfig[] {
        let retval: ITdDynamicElementConfig[] = [
            {
                label: 'Fisici e astronomi',
                name: 'altriServForn_1',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Matematici',
                name: 'altriServForn_2',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Statistici',
                name: 'altriServForn_3',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Biologi, botanici zoologi e professioni assimilate',
                name: 'altriServForn_4',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Specialisti della gestione e del controllo nella pubblica amministrazione',
                name: 'altriServForn_5',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Specialisti in pubblica sicurezza',
                name: 'altriServForn_6',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Specialisti in pubblico soccorso e difesa civile',
                name: 'altriServForn_7',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Specialisti di gestione e sviluppo del personale e organizzazione del lavoro',
                name: 'altriServForn_8',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Specialisti in contabilita',
                name: 'altriServForn_9',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Fiscalisti e tributaristi',
                name: 'altriServForn_10',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Specialisti in attività finanziarie',
                name: 'altriServForn_11',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Analisti di mercato',
                name: 'altriServForn_12',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Avvocato',
                name: 'altriServForn_13',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Esperti legali in enti pubblici',
                name: 'altriServForn_14',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Notai',
                name: 'altriServForn_15',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Specialisti in scienze economiche',
                name: 'altriServForn_16',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Specialisti in scienze sociologiche e antropologiche',
                name: 'altriServForn_17',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Specialisti in scienze storiche artistiche politiche e filosofiche',
                name: 'altriServForn_18',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: 'Specialisti in discipline linguistiche letterarie e documentali',
                name: 'altriServForn_19',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
        ];
        let altriServizioForm: IFormDescription[] = this.forms.filter((uno: IFormDescription) => uno.nome === 'altriServizi');
        if (altriServizioForm.length > 0) {
            return altriServizioForm[0].campi;
        }
        return retval;
    }

    public getDefaultCategorieElements(): ITdDynamicElementConfig[] {
        let retval: ITdDynamicElementConfig[] = [
            {
                label: "professionisti la cui attivita' e' assoggettata all'obbligo di iscrizione in ordini o collegi",
                name: 'catProfConOrdine',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: "professionisti la cui attivita' non e' assoggettata all'obbligo di iscrizione in ordini o collegi",
                name: 'catProfSenzaOrdine',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
            {
                label: "dipendenti delle amministrazioni aggiudicatrici, secondo la definizione di cui all'art. 3, comma 1 lett. a) del Codice",
                name: 'catDipAmm',
                type: TdDynamicElement.Checkbox,
                required: false,
                flex: 70,
                default: false,
            },
            {
                label: 'stato',
                name: 'catDipAmmState',
                type: TdDynamicElement.Select,
                required: false,
                flex: 30,
                selections: ['in servizio', 'in quiescienza'],
            },
            {
                label: "professori ordinari, professori associati, ricercatori delle Universita' italiane e posizioni assimilate",
                name: 'catAccademici',
                type: TdDynamicElement.Checkbox,
                required: false,
                default: false,
            },
        ];
        let categorieForm: IFormDescription[] = this.forms.filter((uno: IFormDescription) => uno.nome === 'categorie');
        if (categorieForm.length > 0) {
            return categorieForm[0].campi;
        }
        return retval;
    }

    public getDefaultPagamentoIscrizioneElements(): ITdDynamicElementConfig[] {
        let retval: ITdDynamicElementConfig[] = [
            {
                label: 'di aver assolto al pagamento della tariffa di iscrizione per',
                name: 'tariffa-pagata',
                type: TdDynamicElement.Checkbox,
                required: true,
                default: false,
                flex: 70,
            },
            {
                label: 'anno(2019)',
                name: 'anno',
                type: TdDynamicElement.Input,
                required: true,
                minLength: 4,
                maxLength: 4,
                flex: 30,
                default: 2019,
                validators: [{
                    validator: Validators.pattern(/^[2019]*$/)} ],
            },
            {
                label: 'numero TRN',
                name: 'bonifico-trn',
                type: TdDynamicElement.Input,
                required: true,
                minLength: 30,
                maxLength: 30,
                flex: 50,
                validators: [{
                    validator: Validators.pattern(/^[a-zA-Z0-9]{28}[a-zA-Z]{2}$/)} ],
            },
            {
                label: 'Data bonifico',
                name: 'data-bonifico',
                type: TdDynamicElement.Datepicker,
                required: true,
                flex: 50,
            },
        ];
        let pagamentoForm: IFormDescription[] = this.forms.filter((uno: IFormDescription) => uno.nome === 'pagamento');
        if (pagamentoForm.length > 0) {
            let campi: ITdDynamicElementConfig[] =  pagamentoForm[0].campi;
            let annoField: ITdDynamicElementConfig[] = campi.filter((uno: ITdDynamicElementConfig) => uno.name === 'anno');
            if (annoField.length > 0) {
                annoField[0].validators = [{ validator: Validators.pattern(/^(2019)$/)} ];
            }

            let trnField: ITdDynamicElementConfig[] = campi.filter((uno: ITdDynamicElementConfig) => uno.name === 'bonifico-trn');
            if (trnField.length > 0) {
                trnField[0].validators = [{ validator: Validators.pattern(/^[a-zA-Z0-9]{28}[a-zA-Z]{2}$/)} ];
            }
            return campi;
        }
        return retval;
    }

    public getDefaultCodAusaElements(): ITdDynamicElementConfig[] {
        let retval: ITdDynamicElementConfig[] = [
           {
                label: "Codice AUSA dell'Amministrazione di appartenenza",
                name: 'codice-ausa',
                type: TdDynamicElement.Input,
                minLength: 10,
                maxLength: 10,
                required: true,
                flex: 30,
            },
            {
                label: 'Intenzioni di partecipazione',
                name: 'intenzione-partecipazione',
                type: TdDynamicElement.Select,
                selections: ['solo commissioni interne all\'amministrazione di appartenenza', 'ad entrambe commissioni interne ed esterne all\'amministrazione di appartenenza'],
                required: true,
                flex: 70,
            },
        ];
        let codiceAusaForm: IFormDescription[] = this.forms.filter((uno: IFormDescription) => uno.nome === 'codiceAusa');
        if (codiceAusaForm.length > 0) {
            return codiceAusaForm[0].campi;
        }
        return retval;
    }

    public getDefaultRequsiti3d(): ITdDynamicElementConfig[] {
        let retval: ITdDynamicElementConfig[] = [
            {
                label: 'di possedere i requisiti di natura professionale previsti dalle Linee guida ANAC n.5 per:',
                name: 'possesso-requisiti',
                type: TdDynamicElement.Checkbox,
                required: true,
                default: true,
            },
        ];
        let requisitiProfessionaliForm: IFormDescription[] = this.forms.filter((uno: IFormDescription) => uno.nome === 'requisitiProfessionali');
        if (requisitiProfessionaliForm.length > 0) {
            return requisitiProfessionaliForm[0].campi;
        }
        return retval;
    }

    public getDefaultRequisitiMoralita(): ITdDynamicElementConfig[] {
        let retval: ITdDynamicElementConfig[] = [
           {
                label: "di non aver riportato condanna anche non definitiva per il delitto previsto dall'articolo 416-bis del codice penale o per il delitto di associazione finalizzata al traffico illecito di sostanze stupefacenti o psicotrope di cui all'articolo 74 del testo unico approvato con decreto del Presidente della Repubblica 9 ottobre 1990, n. 309, o per un delitto di cui all'articolo 73 del citato testo unico, concernente la produzione o il traffico di dette sostanze, o per un delitto concernente la fabbricazione, l'importazione, l'esportazione, la vendita o cessione, nonche', nei casi in cui sia inflitta la pena della reclusione non inferiore ad un anno, il porto, il trasporto e la detenzione di armi, munizioni o materie esplodenti, o per il delitto di favoreggiamento personale o reale commesso in relazione a taluno dei predetti reati",
                name: 'morialita_a',
                type: TdDynamicElement.Checkbox,
                required: true,
                default: false,
            },
            {
                label: "di non aver riportato condanne anche non definitive per i delitti, consumati o tentati, previsti dall'articolo 51, commi 3-bis e 3-quater, del codice di procedura penale, diversi da quelli indicati alla lettera a)",
                name: 'morialita_b',
                type: TdDynamicElement.Checkbox,
                required: true,
                default: false,
            },
            {
                label: "di non aver riportato condanna anche non definitiva per i delitti, consumati o tentati, previsti dagli articoli 314, 316, 316-bis, 316-ter, 317, 318, 319, 319-ter, 319-quater, primo comma, 320, 321, 322, 322-bis, 323, 325, 326, 331, secondo comma, 334, 346-bis, 353 e 353-bis, 354, 355 e 356 del codice penale nonche' all'articolo 2635 del codice civile",
                name: 'morialita_c',
                type: TdDynamicElement.Checkbox,
                required: true,
                default: false,
            },
            {
                label: "di non aver riportato condanna anche non definitiva per i delitti, consumati o tentati, di frode ai sensi dell'articolo 1 della convenzione relativa alla tutela degli interessi finanziari delle Comunita' europee, delitti, consumati o tentati, commessi con finalita' di terrorismo, anche internazionale, e di eversione dell'ordine costituzionale reati terroristici o reati connessi alle attivita' terroristiche; delitti di cui agli articoli 648-bis, 648-ter e 648-ter.1 del codice penale, riciclaggio di proventi di attivita' criminose o finanziamento del terrorismo, quali definiti all'articolo 1 del decreto legislativo 22 giugno 2007, n. 109 e successive modificazioni; sfruttamento del lavoro minorile e altre forme di tratta di esseri umani definite con il decreto legislativo 4 marzo 2014, n. 24",
                name: 'morialita_d',
                type: TdDynamicElement.Checkbox,
                required: true,
                default: false,
            },
            {
                label: "di non essere stato condannato con sentenza definitiva alla pena della reclusione complessivamente superiore a sei mesi per uno o piu' delitti commessi con abuso dei poteri o con violazione dei doveri inerenti ad una pubblica funzione o a un pubblico servizio diversi da quelli indicati alla lettera c)",
                name: 'morialita_e',
                type: TdDynamicElement.Checkbox,
                required: true,
                default: false,
            },
            {
                label: "di non essere stato condannato con sentenza definitiva ad una pena non inferiore a due anni di reclusione per delitto non colposo",
                name: 'morialita_f',
                type: TdDynamicElement.Checkbox,
                required: true,
                default: false,
            },
            {
                label: "di non essere un soggetto nei confronti del quale il tribunale ha applicato, con provvedimento anche non definitivo, una misura di prevenzione, in quanto indiziato di appartenere ad una delle associazioni di cui all'articolo 4, comma 1, lettere a) e b), del decreto legislativo 6 settembre 2011, n. 159",
                name: 'morialita_g',
                type: TdDynamicElement.Checkbox,
                required: true,
                default: false,
            },
            {
                label: "di non aver concorso, in qualita' di membro di commissione giudicatrice, con dolo o colpa grave accertati in sede giurisdizionale con sentenza non sospesa, all'approvazione di atti dichiarati illegittimi",
                name: 'morialita_h',
                type: TdDynamicElement.Checkbox,
                required: true,
                default: false,
            },
            {
                "label": "di trovarsi nella condizione di cui ai paragrafi 2.3 (lettera c), 2.4 (lettera c), 2.5 (lettera c) e 2.6 (lettera b) delle Linee guida Anac n. 5",
                "name": "morialita_i",
                "type": TdDynamicElement.Checkbox,
                "required": true,
                "default": false
            }
        ];
        let moralitaForm: IFormDescription[] = this.forms.filter((uno: IFormDescription) => uno.nome === 'moralita');
        if (moralitaForm.length > 0) {
            return moralitaForm[0].campi;
        }
        return retval;
    }

    public getDefaultPrivacy(): ITdDynamicElementConfig[] {
        let retval: ITdDynamicElementConfig[] = [
        {
            label: "Ai sensi de Regolamento (UE) 2016/679 e del D.Lgs. n. 196/2003 e s.m.i. esprime il proprio consenso al trattamento dei dati personali indicati nel presente modulo ai fini dell’iscrizione nell’albo dei componenti delle commissioni giudicatrici di cui all’art. 78 del D.Lgs. 50/2016 e dichiara di aver preso visione dell’informativa sulla privacy presente sul sito dell’Autorità Nazionale Anticorruzione.",
            name: 'dataProtection',
            type: TdDynamicElement.Checkbox,
            required: true,
            default: false,
        }
        ];
        let privacyForm: IFormDescription[] = this.forms.filter((uno: IFormDescription) => uno.nome === 'privacy');
        if (privacyForm.length > 0) {
            return privacyForm[0].campi;
        }
        return retval;
    }

}

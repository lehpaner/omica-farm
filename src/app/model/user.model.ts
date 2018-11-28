import { Data } from "@angular/router";
import * as firebase from 'firebase/app';

export class UserData {
    name: string;
    middlename: string;
    surname: string;
    birthday:Date;
    birthCity:string;
    birthState:string;
    birthNation:string;
    nationality:string;
    ssn:string;
    constructor() {
        this.name = '';
        this.middlename = '';
        this.surname = '';
    //    this.birthday = Date.now();
        this.birthCity = '';
        this.birthState = '';
        this.birthNation = '';
        this.nationality = '';
        this.ssn = '';
    }
}

export class Address {
    street: string;
    cap: string;
    citty: string;
    state: string;
    nation: string;
    constructor() {
        this.street = '';
        this.cap = '';
        this.citty = '';
        this.state = '';
        this.nation = '';
    }
}

export class Profile {
    auth:firebase.User;
    data:UserData;
    adresses:Map<string, Address>;
    telephones:Map<string, string>;
    mails : Map<string, string>;
    features : Map<string, string>;
    constructor() {
        this.auth = undefined;
        this.adresses = new Map();
        this.telephones = new Map();
        this.mails = new Map();
        this.features = new Map();
    }
}

export class RappresentanteLegale {
    cf: string;
    codSoggettoCon: string;
    codSoggettoPar: string;
    codiceNazioneNascita: string;
    comuneNascita: string;
    comuneNascitaEstero: string;
    dataNascita: Date;
    nome: string;
    cognome: string;
    pec: string;
    email: string;
    tel: string;
    titolo: string;
    constructor() {
        this.cf = '';
        this.codSoggettoCon = '';
        this.codSoggettoPar = '';
        this.codiceNazioneNascita = '';
        this.comuneNascita = '';
        this.comuneNascitaEstero = '';
        this.nome = '';
        this.cognome = '';
        this.pec = '';
        this.email = '';
        this.tel = '';
        this.titolo = '';
}
}

export class Amministrazione {
    cf: string;
    denominazione: string;
    indirizzo: string;
    pec: string;
    constructor() {
        this.cf = '';
        this.denominazione = '';
        this.indirizzo = '';
        this.pec = '';
}
}


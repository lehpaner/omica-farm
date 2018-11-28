import * as firebase from 'firebase/app';

export interface IPropertyChangedEvent {
    name: string;
    oldVal: any;
    newVal: any;
}

export interface IAuthChangedEvent {
    user: firebase.User;
    oldVal: any;
    newVal: any;
}

export interface IDapiChangedEvent {
    entity: string;
    action: string;
    oldVal: any;
    newVal: any;
}
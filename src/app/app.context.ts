import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';
import { isUndefined } from 'util';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { AppDataCtx }   from './app.data.context';

import {IPropertyChangedEvent, IAuthChangedEvent, Profile, IResultRestModel, RestResponse} from './model';

export interface IPropertyChangedEvent {
    name: string;
    oldVal: any;
    newVal: any;
}

@Injectable()
export class AppCtx {

config: any = undefined;
env: any = undefined;
profile: Profile = undefined;
private dataCtx: AppDataCtx = undefined;
private userCtx: Object = undefined;
private ctxChangd: EventEmitter<IPropertyChangedEvent> = new EventEmitter();

configChanged: EventEmitter<IPropertyChangedEvent> = new EventEmitter();

private propertyChangedEvent: EventEmitter<IPropertyChangedEvent> = new EventEmitter();
public authChangedEvent: EventEmitter<IAuthChangedEvent> = new EventEmitter();
private currentUser: firebase.User = null;
private currentUserCallback: Subscription;

constructor(private http: Http, private firebaseAuth: AngularFireAuth) {
        this.dataCtx = new AppDataCtx();
        this.currentUserCallback = firebaseAuth.authState.subscribe((user) => {
            this.manageAuthChange(user);
        });
    }

public manageAuthChange(user: firebase.User): void {
    console.log('Authorization context changed: fireing event...');
    this.currentUser = user; 
    this.fireAuthEvent(user, null, null);
}

public fireAuthEvent( u: firebase.User, oVal: any, nVal: any) :void {
    this.authChangedEvent.emit({ user: u, oldVal: oVal, newVal: nVal});
}

public getOnPropertyChanged(): EventEmitter<IPropertyChangedEvent> {
    return this.ctxChangd;
  }
public OnProperyChanged(property: string, nVal: any, oVal?: any): void {
    this.ctxChangd.emit({name: property, oldVal: oVal, newVal: nVal});
}

public OnConfigChanged() {
    this.configChanged.emit({name:'configuration', oldVal: null, newVal: this.config});
}

public getDataCtx(): AppDataCtx {
    return this.dataCtx;
}

public signup(email: string, password: string): Promise<firebase.User> {
    return this.firebaseAuth
    .auth
    .createUserWithEmailAndPassword(email, password)
    .then((value:firebase.auth.UserCredential) => {
        this.currentUser = value.user;
        this.fireAuthEvent(this.currentUser, null, null);
        console.log('Success!', value);
        return value.user;
    }).catch(err => {
        console.log('Something went wrong:', err.message);
        return null;
    });    
}
    
public login(email: string, password: string): Promise<firebase.User> {
    return this.firebaseAuth
    .auth
    .signInWithEmailAndPassword(email, password)
    .then((value:firebase.auth.UserCredential) => {
        this.currentUser = value.user;
        this.fireAuthEvent(this.currentUser, null, value.user.uid);
         console.log(value);
         return value.user;
    }).catch(err => {
        console.log('Something went wrong:',err.message);
        return null;
    });
}
    
public logout(): Promise<any> {
    return this.firebaseAuth
    .auth
    .signOut();
}
//User is anonimus or logged
public isLogged(): boolean {
       if (isUndefined(this.currentUser)) {
        return false; }
        return !this.currentUser.isAnonymous;
    }
//Current user
public getCurrentUser(): firebase.User {
        return this.currentUser;
    }

public getAccessToken(): string {
        if (isUndefined(this.currentUser)) { return undefined; }
        return "";
    }

public getRefreshToken(): string {
        if (isUndefined(this.userCtx)) { return undefined; }
        return <string>this.userCtx['refreshToken'];
    }
    
public setRefreshToken(token: string): void {
        this.userCtx['refreshToken'] = token;
    }

    /**
     * Use to get the data found in the second file (config file)
     */
    public getConfig(key: any) {  return this.config[key]; }
	public setConfig(key: string, value: any) {
        let oldV: any = this.config[key];
        this.config[key] = value;
        this.configChanged.emit( {name:key, oldVal:oldV, newVal:value,});
    }
    
    /**
     * Use to get the data found in the first file (env file)
     */
    public getEnv(key: any): any {  return this.env[key]; }

    //Save configuration files for admn purposes
    public saveConfig(changed: string): Observable<any> {
        console.log('Saving ...', changed);
        let dep = this.getConfig('dataEndPoint');
        let loc: string = dep + 'api/file/saveconfig';
        let tipo: string = 'config';
        let name: string = '/config.' + this.env['env'] + '.json';
        let forms = this.config['forms'];
        let body = JSON.stringify(forms);
        let input: FormData = new FormData();
        input.append('fileName', name);
        input.append('chapter', tipo);
        input.append('content', body);
        return this.makeUploadRequest ('post', loc, input)
        .map((res) => {
            this.OnConfigChanged();
            return res})
        .catch((error: any): any => {
                console.log('Configuration file "env.json" could not be read');
                return Observable.throw(error.json().error || 'Server error');
            });

    }
    /**
     * This method:
     *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
     *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
     */
    public load() {
         console.log('Configuration loading file...');
        return new Promise((resolve, reject) => {
            this.http.get('./assets/config/env.json').map(res => res.json()).catch((error: any): any => {
                console.log('Configuration file "env.json" could not be read');
                resolve(true);
                return Observable.throw(error.json().error || 'Server error');
            }).subscribe((envResponse) => {
                this.env = envResponse;
                let request: any = null;

                switch (envResponse.env) {
                    case 'production': {
                        request = this.http.get('./assets/config/config.' + envResponse.env + '.json');
                    } break;

                    case 'development': {
                        request = this.http.get('./assets/config/config.' + envResponse.env + '.json');
                    } break;

                    case 'default': {
                        console.error('Environment file is not set or invalid');
                        resolve(true);
                    } break;
                }

                if (request) {
                    request
                        .map(res => res.json())
                        .catch((error: any) => {
                            console.error('Error reading ' + envResponse.env + ' configuration file');
                            resolve(error);
                            return Observable.throw(error.json().error || 'Server error');
                        })
                        .subscribe((responseData) => {
                            console.log('CONFIG:', responseData);
                            this.config = responseData;
                            resolve(true);
                        });
                } else {
                    console.error('Env config file "env.json" is not valid');
                    resolve(true);
                }
            });

        }).then(()=>{
            //dopo caricata la configurazione
            this.dataCtx.initFromConfig(this);
        }).then(()=> {   console.log("CONTEXT LOADED");    });
    }
    private makeUploadRequest (method, url, data): Observable<RestResponse> {
        return Observable.fromPromise( new Promise( function (resolve, reject) {
          let req: XMLHttpRequest = new XMLHttpRequest();
          req.open(method, url, true);
          req.onload = function (): any {
            if (this.status >= 200 && this.status < 300) {
              let response = JSON.parse(req.responseText);
              resolve(response);
            }
          //  else { resolve({ status: this.status, statusText: req.statusText }); }
            };
            req.onerror = function () { reject({ status: this.status,  statusText: req.statusText });}
            req.send(data);
        }));
      }
}
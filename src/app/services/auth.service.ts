import { Injectable, Optional, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppCtx }       from '../app.context';
import { Http, Headers, RequestOptionsArgs, Response, URLSearchParams } from '@angular/http';
import { TdDialogService, IAlertConfig } from '@covalent/core/dialogs';
import 'rxjs/Rx';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  private basePath: string;
  private applicationID: Number;

  user: Observable<firebase.User>;

constructor(private firebaseAuth: AngularFireAuth, private router: Router, private _ctx: AppCtx, private _dialogService: TdDialogService) {
    var authHost= this._ctx.getConfig('authEndPoint');
    this.basePath= authHost + "api/auth/login";
    this.applicationID=this._ctx.getConfig('application_id');
  }
signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });    
  }

login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log(value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }
}

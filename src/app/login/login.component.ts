import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Profile } from './../model';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService, IAlertConfig } from '@covalent/core/dialogs';
import { AppCtx }       from '../app.context';
import 'rxjs/add/observable/fromPromise';
import { Observable } from "rxjs/Observable";
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'qs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

username: string;
password: string;
risultato: any= undefined;
nexturl: string = undefined;
registrazioneUrl: string;

toolbarTitle: string = '';
copyrightString: string = '';

constructor(private _router: Router,
              private _loadingService: TdLoadingService, private _ctx: AppCtx, private _route: ActivatedRoute,
              private _dialogService: TdDialogService) {
              this.registrazioneUrl = <string>_ctx.getConfig('registrationRedirect');
              this.toolbarTitle = <string>_ctx.getConfig('toolbarTitle');
              this.copyrightString = <string>_ctx.getConfig('copyrightString');
              }

ngOnInit(): void {
    this._route.queryParams.subscribe((params: Params) => {
      this.nexturl = params['redirectTo'];
    });
}

async login(): Promise<any> {
    let user: firebase.User = null;
    try {
      this._loadingService.register();
      user = await this._ctx.login(this.username, this.password);
      console.log('Login sucess:', user);
    } catch (error) {
      console.log('Error durnig login:', error);
    } finally {
      console.log('Returning login');
      this._loadingService.resolve();
      return user;
    }
}
//exec login and fetch profile node
doLogin():void {
  this.login().then((user) => {
    console.log("Loged User", user);
    if (this.risultato === null) {
          this._router.navigate(['/login']);
        }
        else {
          if (this.nexturl === undefined) {
            this._router.navigate(['/']);
          } else {
            this._router.navigate([this.nexturl]);
          }
        }
      });
  }
}

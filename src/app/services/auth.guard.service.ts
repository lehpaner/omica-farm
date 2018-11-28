import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AppCtx } from '../app.context';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private _appCtx: AppCtx, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        console.log('APPGUARD CHECK LOGGED');
        return this.checkLogin(url);
      }
    checkLogin(url: string): boolean {
        if (this._appCtx.isLogged()) {
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { redirectTo: url } });
        return false;
    }
}

import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Headers } from '@angular/http';
import { JwtHelperService } from '../../app/services/jwt-helper.service';
import { IHttpInterceptor } from '@covalent/http';
import { AppCtx } from '../../app/app.context';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RequestInterceptor implements IHttpInterceptor {

  constructor(private _ctx: AppCtx, private _jwtHelper: JwtHelperService) {}

  onRequest(requestOptions: RequestOptionsArgs): RequestOptionsArgs {
    // you add headers or do something before a request here.
    console.log('CALLED HTTP  INTERCEPTOR...');
    let token = this._ctx.getAccessToken();
    if(token){
      const decodedToken = this._jwtHelper.decodeToken(token);
      const expirationDate: Date = this._jwtHelper.getTokenExpirationDate(token);
      const isExpired: boolean = this._jwtHelper.isTokenExpired(token);
      if (requestOptions.headers === undefined) {
        requestOptions.headers = new Headers();
      }
      requestOptions.headers.append('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept, Origin, xAuth-Refresh');
      if (isExpired) {
        requestOptions.headers.append( 'xAuth-Refresh', `${this._ctx.getAccessToken()}`);
      }
      requestOptions.headers.append( 'Authorization', `${this._ctx.getAccessToken()}`);
  }
    return requestOptions;
  }
}

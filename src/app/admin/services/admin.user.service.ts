import { Provider, SkipSelf, Optional, Injectable } from '@angular/core';
import { Response, Http, RequestOptionsArgs, Headers, ResponseContentType, RequestOptions, URLSearchParams } from '@angular/http';
import { AppCtx }       from '../../app.context';
import { Observable } from 'rxjs/Observable';
import { TdFileService, IUploadOptions } from '@covalent/core/file';
import 'rxjs/add/operator/map';

import { HttpInterceptorService, RESTService } from '@covalent/http';

export interface IUser {
  uid: string;
  codiceFiscale: string;
  stato: number;
  isAdmin: boolean;
}

@Injectable()
export class UserService extends RESTService<IUser> {

  private dataEndPoint: string;
  private questionarioTipo: number;

  constructor(private _http: HttpInterceptorService, private _ctx: AppCtx, private _fileUploadService: TdFileService) {
    super(_http, {
      baseUrl: _ctx.getConfig('dataEndPoint'),
      path: '/api/user',
    });
    this.dataEndPoint =  _ctx.getConfig('dataEndPoint');
  }

  searchUsers(query: string, rows: number, start: number): Observable<IUser[]> {
    let b = new URLSearchParams();
    b.set('q', query);
    b.set('rows', rows.toString());
    b.set('start', start.toString());
    return this._http.post(this.dataEndPoint + 'api/user', b)
    .map((res: Response) => {
    //  console.log(res);
      return res.json();
    });
  }

  getUser(cf: string): Observable<IUser> {
    return this._http.get(this.dataEndPoint + 'api/user/' + cf)
    .map((res: Response) => {
  //    console.log(res);
      return res.json();
    });
  }

  saveUser(user: IUser): Observable<IUser> {
    console.log(user);
    return this._http.post(this.dataEndPoint + 'api/user/' + user.codiceFiscale, user)
    .map((res: Response) => {
  //    console.log(res);
      return res.json();
    });
  }
}

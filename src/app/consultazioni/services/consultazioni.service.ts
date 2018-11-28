import { Provider, SkipSelf, Optional, InjectionToken, Inject, Injectable } from '@angular/core';
import { Response, Http, RequestOptionsArgs, Headers, ResponseContentType, RequestOptions } from '@angular/http';
import { AppCtx }       from '../../app.context';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConsultazioniService extends RESTService<any> {

    private dataEndPoint: string;
    constructor(private _http: HttpInterceptorService, private _ctx: AppCtx) {
      super(_http, {
        baseUrl: _ctx.getConfig('dataEndPoint'),
        path: 'api/consultazioni',
      });
      this.dataEndPoint =  _ctx.getConfig('dataEndPoint');
    }

    cercaIscrizioni(query: string, rows: number, start: number): Observable<any> {
        let postHead: Headers = new Headers();
        postHead.append('Content-Type', 'application/x-www-form-urlencoded');
        const options: RequestOptions  = new RequestOptions({
          headers: postHead,
        });
        let body = `q=${query}&rows=${rows}&start=${start}`;
 //       console.log(query);
        return this._http.post(this.dataEndPoint + 'api/consultazioni', body, options)
        .map((res: Response) => {
 //         console.log(res);
          return res.json();
        });
      }
}

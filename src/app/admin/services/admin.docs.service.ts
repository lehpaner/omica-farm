import { Injectable, Sanitizer, SecurityContext } from '@angular/core';
import { Response, Http, RequestOptionsArgs, Headers, ResponseContentType, RequestOptions } from '@angular/http';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { catchError } from 'rxjs/operators/catchError';

import { IDocument } from '../model/document.model';
import { AppCtx }       from '../../app.context';


@Injectable()
export class AdminDocsService {

    private dataEndPoint: string;
    docLocation: string;
    constructor(private _http: HttpClient, private _ctx: AppCtx, private _sanitizer: Sanitizer) {
        this.dataEndPoint =  _ctx.getConfig('dataEndPoint');
    }

    getDocList(): Observable<IDocument[]>
    {
        return this._http.get(this._sanitizer.sanitize(SecurityContext.URL, './assets/guida/toc.json'), { responseType: 'text' })
            .map((res: string) => {
                console.log(res);
                return JSON.parse(res);
            });
    }

    getDoc(resourceUrl: string): Observable<string> {
        let url= this._sanitizer.sanitize(SecurityContext.URL, './assets/guida/' + resourceUrl);
       return this._http.get(url, {responseType: 'text'}).map((res: string) => {
                console.log(res);
                return res;
            });
    }

    getConfig(resourceUrl: string): Observable<string> {
        let url= this._sanitizer.sanitize(SecurityContext.URL, './assets/config/' + resourceUrl);
       return this._http.get(url, {responseType: 'text'}).map((res: string) => {
                console.log(res);
                return res;
            });
    }

    saveFile(tipo: string, name: string, file): Observable<any> {
        let input: FormData = new FormData();
        let loc: string = this.dataEndPoint + 'api/file/uploadTextFile';
        input.append('fileName', name);
        input.append('chapter', tipo);
        input.append('content', file);
        return this.makeUploadRequest ('post', loc, input).map((res: any) => {
          console.log(res);
          return res;
        });
      }
    private makeUploadRequest (method, url, data) {
        return Observable.fromPromise( new Promise( function (resolve, reject) {
          let req: XMLHttpRequest = new XMLHttpRequest();
          req.open(method, url, true);
          req.onload = function (): any {
            if (this.status >= 200 && this.status < 300) {
              let response = JSON.parse(req.responseText);
              resolve(response);
            }
            else { resolve({  status: this.status, statusText: req.statusText }); }
            };
            req.onerror = function () { reject({ status: this.status,  statusText: req.statusText });}
            req.send(data);
        }));
      }
}
import { Provider, SkipSelf, Optional, InjectionToken, Inject, Injectable } from '@angular/core';
import { Response, Http, RequestOptionsArgs, Headers, ResponseContentType, RequestOptions } from '@angular/http';
import { AppCtx }       from '../../app.context';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { ModuloCommissari, IEsitoVerifica, RestResponse } from '../../model';
import { isUndefined } from 'util';
import { isEmpty } from 'rxjs/operator/isEmpty';
// import { saveAs, FileSaver } from 'file-saver/FileSaver';
import { TdFileService, IUploadOptions } from '@covalent/core/file';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/Rx' ;

@Injectable()
export class IscrizioneService extends RESTService<ModuloCommissari> {

  private dataEndPoint: string;
  private questionarioTipo: number;

  constructor(private _http: HttpInterceptorService, private _ctx: AppCtx, private _fileUploadService: TdFileService) {
    super(_http, {
      baseUrl: _ctx.getConfig('dataEndPoint'),
      path: '/api/questionari',
    });
    this.dataEndPoint =  _ctx.getConfig('dataEndPoint');
    this.questionarioTipo = _ctx.getConfig('tipoQuestionario');
  }

  getAllOfUser(user: string, tipo: number): Observable<RestResponse> {
    return this._http.get( this.dataEndPoint + 'api/questionari/' + user + '/user?ntype=' + tipo)
    .map((res: Response) => {
        return res.json();
    });
  }

  // nuovo e salva sono stati unificati: utilizzando entrambi il POST,
  // il BE distingue il tipo di operazione in base all'Id
  nuovoModulo(data: ModuloCommissari): Observable<RestResponse> {
    return this._http.post( this.dataEndPoint + 'api/questionari', data)
    .map((res: Response) => {
      return res.json();
    });
  }

  salvaModulo(id: string, data: ModuloCommissari): Observable<RestResponse> {
    return this._http.post( this.dataEndPoint + 'api/questionari', data)
    .map((res: Response) => {
      return res.json();
    });
  }

  completaIscrizione(id: string): Observable<ModuloCommissari[]> {
    return this._http.post(this.dataEndPoint + 'api/questionari/' + id + '/promuovi', undefined)
    .map((res: Response) => {
      return res.json();
    });
  }

  clonaIscrizione(data: ModuloCommissari): Observable<ModuloCommissari> {
    return this._http.post(this.dataEndPoint + 'api/questionari/clone', data)
    .map((res: Response) => {
      return res.json();
    });
  }

  getAllegatiIscrizione(id: string): Observable<RestResponse> {
    return this._http.get(this.dataEndPoint + 'api/questionari/' + id + '/allegati')
    .map((res: Response) => {
      return res.json();
    });
  }

  getAllegato(record): Observable<any> {
    let hh: Headers = new Headers();
    hh.append('responseType', 'arraybuffer');
    let requestOptions: RequestOptionsArgs = {
      headers: hh,
    };
    requestOptions.responseType = ResponseContentType.Blob;
    return this._http.post(this.dataEndPoint + 'api/file/alfrescoFile', record, requestOptions)
    .map((res: Response) => {
      console.log(res);
      this.saveToFileSystem(res);
    });
}

  archiviaIscrizione(id: string): Observable<ModuloCommissari> {
    return this._http.post(this.dataEndPoint + 'api/questionari/' + id + '/archivia', undefined)
    .map((res: Response) => {
      return res.json();
    });
  }

  verificaFirma(id: string): Observable<IEsitoVerifica> {
    return this._http.get(this.dataEndPoint + 'api/file/' + id + '/verificaFirma')
    .map((res: Response) => {
      return res.json();
    });
  }

  vediFirma(id: string): Observable<any> {
    return this._http.get(this.dataEndPoint + 'api/file/' + id + '/vediFirma')
    .map((res: Response) => {
      console.log(res);
      return res.json();
    });
  }

  getAusaName(id: string): Observable<RestResponse> {
    return this._http.get( this.dataEndPoint + 'api/questionari/ausa/' + id)
    .map((res: Response) => {
      return res.json();
    });
  }

  deleteIscrizione(id: string): Observable<ModuloCommissari> {
    return this._http.delete(this.dataEndPoint + 'api/questionari/' + id)
    .map((res: Response) => {
      return res.json();
    });
  }

  disIscrizione(id: string): Observable<ModuloCommissari[]> {
    return this._http.post(this.dataEndPoint + 'api/questionari/' + id + '/abbandonaRegistro', undefined)
    .map((res: Response) => {
      return res.json();
    });
  }

  uploadTypedFile(id: string, tipo: string, file): Observable<any> {
    let input: FormData = new FormData();
    let loc: string = this.dataEndPoint + 'api/file/uploadGenericFile';
    input.append('id-parent', id);
    input.append('id-type', tipo);
    input.append('file', file);
    return this.makeUploadRequest ('post', loc, input).map((res: any) => {
      console.log(res);
      return res;
    });
  }

  uploadFile(id: string, file): Observable<any> {
    let input: FormData = new FormData();
    let loc: string = this.dataEndPoint + 'api/file/uploadDoc';
    input.append('id-parent', id);
    input.append('file', file);
    return this.makeUploadRequest ('post', loc, input).map((res: any) => {
      return res.json();
    });
  }

  generatePdf(id: string): Observable<any> {
    let hh: Headers = new Headers();
    hh.append('responseType', 'arraybuffer');
    console.log('REQUEST RENDER PDF');
    let requestOptions: RequestOptionsArgs = {
      headers: hh,
    };
    requestOptions.responseType = ResponseContentType.Blob;
    return this._http.get(this.dataEndPoint + 'api/file/' + id + '/render', requestOptions)
    .map((res: Response) => {
      this.saveToFileSystem(res);
    });
  }

  private saveToFileSystem(response) {
    let contentDispositionHeader = response.headers.get('content-disposition');
    let filename: string = 'iscrizione_generata.pdf';
//    console.log(response.headers);
    if (contentDispositionHeader === undefined) {
      contentDispositionHeader = response.headers.get('Content-Disposition');
    }
    if (contentDispositionHeader !== undefined)
    {
      const parts: string[] = contentDispositionHeader.split(';');
      filename = parts[1].split('=')[1];
    }
    const blob = new Blob([response.blob()], { type: "application/pdf;charset=utf-8"});
    // saveAs(blob, filename);
  }

  private makeUploadRequest (method, url, data) {
    return Observable.fromPromise( new Promise( function (resolve, reject) {
      let req: XMLHttpRequest = new XMLHttpRequest();
      req.open(method, url, true);
      req.onload = function (): any {
        if (this.status >= 200 && this.status < 300) {
          let response = JSON.parse(req.responseText);
          console.log(response);
          resolve(response);
        }
        else { resolve({  status: this.status, statusText: req.statusText }); }
        };
        req.onerror = function () { reject({ status: this.status,  statusText: req.statusText });}
        req.send(data);
    }));
  }

}
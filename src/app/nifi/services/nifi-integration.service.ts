import { Injectable, Sanitizer, SecurityContext } from '@angular/core';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { Response } from '@angular/http';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { catchError } from 'rxjs/operators/catchError';


import { AppCtx }       from '../../app.context';
import { DOPI }       from '../../services/dopi';
import { FlowViewModel } from '../model/flow-view.model';

@Injectable()
export class NifiIntegrationService extends RESTService<any> {

    private dataEndPoint: string;
    private questionarioTipo: number;
    private syncFlow: FlowViewModel;
    private rootNode: any

    constructor(private _http: HttpInterceptorService, private _ctx: AppCtx, 
        private _sanitizer: Sanitizer, private _dopi: DOPI, private _hclient: HttpClient) {
        super(_http, {
          baseUrl: _ctx.getConfig('dataEndPoint'),
          path: '/api/nifi',
        });
        this.dataEndPoint =  _ctx.getConfig('dataEndPoint');
        this.questionarioTipo =  _ctx.getConfig('questionarioTipo');
        this.syncFlow = new FlowViewModel();
  
      }
////sene va
    getDefaultFlow(): Observable<any>
    {

        return this._hclient.get(this._sanitizer.sanitize(SecurityContext.URL, './assets/flow/default.json'), { responseType: 'text' })
            .map((res: string) => {
            //    console.log(res);
                return JSON.parse(res);
            });
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   createFlow(chartContainer: any, treeData: any): void {
    let element: any = chartContainer.nativeElement;
    element.innerHTML = '';
    this.syncFlow.addSvgToContainer(chartContainer);
    this.syncFlow.createLayout();
    this.syncFlow.createTreeData(treeData);

  }
  updateFlow(): void {
    this.syncFlow.update(this.syncFlow.root);
  }
  setNodeChangedListener(callable: any): void {
    this.syncFlow.nodechanged = callable;
  }
  setNodeSelectedListener(callable: any): void {
    this.syncFlow.nodeselected = callable;
  }

  addNode(node: any): void {
    this.syncFlow.addNode(node);
  }

  getRoot(): any {
    return this.syncFlow.root;
  }
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    
}
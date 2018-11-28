import { Injectable} from '@angular/core';
import { Response, Http, RequestOptionsArgs, Headers, ResponseContentType, RequestOptions } from '@angular/http';
import { HttpInterceptorService, RESTService } from '@covalent/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { catchError } from 'rxjs/operators/catchError';
import { AppCtx }       from '../../app.context';
import { RestResponse } from '../../model';
import { FlowViewModel } from '../sync/flow-view.model';

@Injectable()
export class SyncQuestionariService extends RESTService<any> {

    private dataEndPoint: string;
    private questionarioTipo: number;
    private syncFlow: FlowViewModel;
    private rootNode: any

    constructor(private _http: HttpInterceptorService, private _ctx: AppCtx) {
      super(_http, {
        baseUrl: _ctx.getConfig('dataEndPoint'),
        path: '/api/nifi',
      });
      this.dataEndPoint =  _ctx.getConfig('dataEndPoint');
      this.questionarioTipo =  _ctx.getConfig('questionarioTipo');
      this.syncFlow = new FlowViewModel();

    }

    getQuestionariFlow(resourceUrl: string): Observable<RestResponse> {
       return this._http.get(this.dataEndPoint + 'api/nifi').map((res) => {
                return res.json();
            });
    }

    changeProcessorState(processorID: string, processorVersion: string, processorState: string): Observable<RestResponse> {
      let postHead: Headers = new Headers();
      postHead.append('Content-Type', 'application/x-www-form-urlencoded');
      const options: RequestOptions  = new RequestOptions({
        headers: postHead,
      });
      let body = `revision=${processorVersion}&status=${processorState}&component=${processorID}`;
 //     console.log(body);
      return this._http.post(this.dataEndPoint + 'api/nifi', body, options)
        .map((res: Response) => {
          return res.json();
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

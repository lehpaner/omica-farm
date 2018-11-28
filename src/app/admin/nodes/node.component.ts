import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { AppCtx } from '../../app.context';
import { DAPI } from '../../services/dapi';
import { slideInDownAnimation } from '../../app.animations';
import { IPropertyChangedEvent, IResultRestModel} from '../../model';
import { IQNode } from '../../nodes/model';
import { NodeEditComponent } from './node-edit.component';
import { NodeFactory } from '../../nodes/services/node-factory.service'
import { NodeViewComponent } from './node-view.component';
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'qs-node-detail',
    styleUrls: ['./node.component.scss'],
    templateUrl: './node.component.html',
    animations: [slideInDownAnimation],
  })

export class NodeComponent implements OnInit {
 
@HostBinding('@routeAnimation') routeAnimation: boolean = true;
@HostBinding('class.td-route-animation') classAnimation: boolean = true;
@ViewChild('formEdit') _formEdit: NodeEditComponent;

id: string;
action: string;
subtype: number;
nextUrl: string = '/admin';
data: IQNode;

 constructor(private _appCtx: AppCtx, private _dapi:DAPI, private _factory: NodeFactory,
    private _router: Router, private _route: ActivatedRoute,
    private _loadingService: TdLoadingService, private _dialogService: TdDialogService) {

}

goBack(): void {
    this._router.navigate([this.nextUrl]);
}

dataChanged(event: IPropertyChangedEvent) : void {

    console.log('Data changed event :' , event);
}

save() {

}

ngOnInit(): void {
    this._route.params.subscribe((params: {id: string}) => {
      this.id = params.id;
      if (this.id) {
        this._route.queryParams.subscribe(qpar => { this.action = qpar['action']||''; });
        this._route.queryParams.subscribe(qpar => { this.subtype = +qpar['subtype']||0; });
        this._route.queryParams.subscribe(qpar => { this.nextUrl = qpar['nextUrl']||''; });
        if(this.id ==='new') {
          this.data = this._factory.getNodeByType(this.subtype);
        } else {
          this.action = 'edit';
          this.nextUrl = '/admin';
          this.load(this.id);
        }
      }
    });
  }

  async load(id: string): Promise<void> {
    try {
      this._loadingService.register('node.edit');
      let result: IResultRestModel = await this._dapi.nodeGeByIDAsync(this.id);
      if(result.errorNumber === 0) {
        this.data = result.data; 
      }
    } catch (error) {
      console.log(`An error has occured : ${error}`);
      this._dialogService.openAlert({message: 'There was an error loading the user'});
    } finally {
      console.log('Loaded user: ', this.data);
      this._loadingService.resolve('node.edit');
    }
  }
}
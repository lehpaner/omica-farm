import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { AppCtx } from '../../app.context';
import { DAPI } from '../../services/dapi';
import { slideInDownAnimation } from '../../app.animations';
import { IResultRestModel} from '../../model';
import { IQNode, INodeWhere } from '../../nodes/model';
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'qs-node-view',
    styleUrls: ['./node-view.component.scss'],
    templateUrl: './node-view.component.html'
  })

export class NodeViewComponent implements OnInit {

constructor(private _appCtx: AppCtx, private _dapi:DAPI,
        private _router: Router, private _route: ActivatedRoute,
        private _loadingService: TdLoadingService, private _dialogService: TdDialogService) {
    
    }

ngOnInit(): void {
    /*
        this._route.params.subscribe((params: {id: string}) => {
          this.id = params.id;
          if (this.id) {
            this.load(this.id);
          }
        });*/
      }

  }
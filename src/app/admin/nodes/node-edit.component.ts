import { Component, HostBinding, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { AppCtx } from '../../app.context';
import { DAPI } from '../../services/dapi';
import { slideInDownAnimation } from '../../app.animations';
import { IPropertyChangedEvent, IResultRestModel} from '../../model';
import { IQNode} from '../../nodes/model';
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'qs-node-edit',
    styleUrls: ['./node-edit.component.scss'],
    templateUrl: './node-edit.component.html'
  })

export class NodeEditComponent implements OnInit {

@Input() data: IQNode;
@Output() expanded: EventEmitter<void> = new EventEmitter<void>();
@Output() onChanged : EventEmitter<IPropertyChangedEvent> = new EventEmitter<IPropertyChangedEvent>();

id: string;
owner: string;
parent: string;
subtype: number;
name: string;
//status: Status;
category: number;
createdOn?: Date;
modifiedOn?: Date;

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
        console.log('NODE:', this.data);
      }

  }
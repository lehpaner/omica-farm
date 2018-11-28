import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { SyncQuestionariService } from '../services/admin.sync.service';
import { RestResponse } from '../../model';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'qs-flow-view',
  styleUrls: ['./flow-view.component.scss'],
  templateUrl: './flow-view.component.html',
})

export class FlowViewComponent implements OnInit, OnChanges {

    @ViewChild('flow') private flowContainer: ElementRef;
    @Input() private flow: any= [];
    @Output() onNodeChanged: EventEmitter<any>= new EventEmitter();
    @Output() onNodeSelected: EventEmitter<any>= new EventEmitter();

    constructor( private _syncService: SyncQuestionariService ) {

        _syncService.setNodeChangedListener((node) => {
          this.onNodeChanged.emit(node);
        });
        _syncService.setNodeSelectedListener((node) => {
          this.onNodeSelected.emit(node);
        });
    }

    ngOnInit(): void { }

    ngOnChanges(changes: any): void {
        console.log('CHANGE CALL');
        this.seedView();
    }

    seedView(): void {
      if (!!this.flow) {
        this._syncService.createFlow(this.flowContainer, this.flow);
        this._syncService.updateFlow();
      }
    }
}

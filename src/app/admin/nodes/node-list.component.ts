import { Component, HostBinding, AfterViewInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { AppCtx } from '../../app.context';
import { DAPI } from '../../services/dapi';
import { slideInDownAnimation } from '../../app.animations';
import { IPropertyChangedEvent, IResultRestModel} from '../../model';
import { IQNode } from '../../nodes/model';
import 'rxjs/add/operator/toPromise';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, 
    ITdDataTableColumn } from '@covalent/core/data-table';

@Component({
    selector: 'qs-node-table-view',
    styleUrls: ['./node-list.component.scss'],
    templateUrl: './node-list.component.html'
  })

export class NodeListViewComponent implements AfterViewInit {

//@Input() data: IQNode[];
@Output() onChanged : EventEmitter<IPropertyChangedEvent> = new EventEmitter<IPropertyChangedEvent>();

columns: ITdDataTableColumn[] = [
    { name: 'id',  label: 'Node', sortable: false, width: 250},
    { name: 'subtype',  label: 'Type', sortable: true, width: 100},
    { name: 'status',  label: 'Status', sortable: false, width: 150},
    { name: 'name',  label: 'Name', sortable: true, width: 300},
    { name: 'parent', label: 'Parent' , sortable: false, width: 150},
];
nodeStatus: any[] = [
    {value: 0, viewValue: 'Created'},
    {value: 1, viewValue: 'Modified'},
    {value: 2, viewValue: 'Deleted'},
    {value: 3, viewValue: 'Archived'},
    {value: 4, viewValue: 'Reserved'},
  ];

nodeSubType: any[] = [
    {value: 1000, viewValue: 'Generic'},
    {value: 1142, viewValue: 'Workspace'},
    {value: 2, viewValue: 'Deleted'},
    {value: 3, viewValue: 'Archived'},
    {value: 4, viewValue: 'Reserved'},
  ];

  @Input() nodes: IQNode[];
  @Input() data: IQNode[];
  @Input() selectable: boolean = false;
  @Input() clickable: boolean = false;
  @Input() multiple: boolean = false;
  @Input() sortable: boolean = true;
  @Input() sortBy: string = 'name';
  @Input() selectedRows: any[];
  @Input() sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

///SEARCH BOX 
searchTerm: string = '';
//// PAGINATOR
    filteredTotal: number = 0;
    fromRow: number = 0;
    currentPage: number = 0;
    pageSize: number = 25;

constructor(private _appCtx: AppCtx, private _router: Router, private _route: ActivatedRoute,
    private _dialogService: TdDialogService, private _dataTableService: TdDataTableService) {

}

ngAfterViewInit(): void {

}
/**
 * 
 * @param id Opens edit form
 */
goToEdit(id: string): void {
    this._router.navigate(['admin', 'node', id]);
}
/**
 * Get description for numeric value of status
 * @param val  status value
 */
private getStatus(val: number): string {
    let td = this.nodeStatus.filter((uno) => uno.value === val);
    if ( td.length > 0) {
       return <string> td[0].viewValue;
    }
    return 'Created';
}

private filter(): void {
    let newData: any[] = this.nodes;
    let excludedColumns: string[] = this.columns
    .filter((column: ITdDataTableColumn) => {
      return ((column.filter === undefined && column.hidden === true) ||
              (column.filter !== undefined && column.filter === false));
    }).map((column: ITdDataTableColumn) => {
      return column.name;
    });
    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
//    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
//    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.data = newData;
}

public onSortChanged(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
} 
public onRowClick(event) {
    
}
}
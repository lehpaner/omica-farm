import { Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';
import { AppCtx } from '../../app.context';
import { DAPI } from '../../services/dapi';
import { NodeListViewComponent} from './node-list.component'
import { slideInDownAnimation } from '../../app.animations';
import { IResultRestModel} from '../../model';
import { IQNode, INodeWhere } from '../../nodes/model';

@Component({
    selector: 'qs-nodes-list',
    styleUrls: ['./nodes.component.scss'],
    templateUrl: './nodes.component.html',
    animations: [slideInDownAnimation],
  })


export class NodeListComponent  implements OnInit {

    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;
    @ViewChild('nodesTableView')
    _nodesTable: NodeListViewComponent;

////DATA TABLE VARS
    filteredNodes: IQNode[];
    selectable: boolean = false;
    clickable: boolean = false;
    multiple: boolean = false;
    sortable: boolean = true;
    sortBy: string = 'name';
    selectedRows: any[];
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
///SEARCH BOX 
    searchTerm: string = '';
//// PAGINATOR
    filteredTotal: number = 0;
    fromRow: number = 0;
    currentPage: number = 0;
    pageSize: number = 25;

    constructor(private _appCtx: AppCtx, private _dapi:DAPI, private _loadingService: TdLoadingService,
                private _dialogService: TdDialogService,
                private _titleService: Title, public media: TdMediaService, private _router: Router) {

    }

    ngOnInit(): void {
        console.log('NODES INIT');
        this._titleService.setTitle('Nodes');
        let initSearch: INodeWhere[] = [];//= [{ field:"name", operator:"==", val:"*"}];
        this.load( initSearch, 'name', this.pageSize, this.currentPage*this.pageSize);
      }
/**
 * Load nodes in table
 * @param q - query string
 * @param rows - rows by page
 * @param start - page number
 */
 async load(q: INodeWhere[], orderBy:string, rows: number, start: number): Promise<void> {
    let result: IResultRestModel
    try {
        console.log('Loading nodes', q, orderBy, rows, start);
        this._loadingService.register('nodes.search');
        result = await this._dapi.nodeGetAsync(q, orderBy, rows, start);
        //if(result.errorNumber===0) {
            this.filteredNodes = Object.assign([], result.data);
       // }
        console.log('Loading nodes result', result);
    } catch (error) {
        console.log(`An error has occured : ${error}`);
        this._dialogService.openAlert({title: 'Recupero utenti nin riuscito', message: 'Errore di sistema', closeButton: 'CHIUDI' });
    } finally {
       // this.filteredNodes = Object.assign([], this.nodes);
        this._loadingService.resolve('nodes.search');
    }
}

addNode(): void {
    this._router.navigate(['admin', 'node', 'new'], { queryParams: { action: 'new', subtype:1142, nextUrl: '/admin'} });
}
doSearch($event) {

}
save () {
    
}
page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    let q = [{field:'name', operator:'==', val: this.searchTerm}];
    this.load(q, this.sortBy, this.pageSize, this.currentPage*this.pageSize);
}
private onRowClick(event: any): void {
    let row: any = event.row;
    console.log('Row click event', event);
    // .. do something with event.row
}
}
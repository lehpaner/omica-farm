import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Title } from '@angular/platform-browser';

import { TdDigitsPipe } from '@covalent/core/common';
import { TdLoadingService } from '@covalent/core/loading';
import { AppDataCtx } from '../app.data.context';
import { AppCtx } from '../app.context';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';
import { ConsultazioniService } from './services/consultazioni.service';

import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { ConsultazioniDataDialog } from './consultazioni-dialog.component';

@Component({
  selector: 'qs-commissari-consultazioni',
  templateUrl: './consultazioni.component.html',
  styleUrls: ['./consultazioni.component.scss'],
})
export class ConsultazioniComponent implements OnInit {

  // Current date
  year: any = new Date().getFullYear();


  selectedSearch: string = '0';
  tokens: any;
  disabled: boolean = false;
  accept = '.doc,.pdf,.p7m';

  tipoSearch: any[] = [
    {value: 0, viewValue: 'Schelta tipo'},
    {value: 10, viewValue: 'Libera (tutti dati)'},
    {value: 20, viewValue: 'Categorie'},
    {value: 30, viewValue: 'Sottocategorie'}];

  toolbarTitle: string = '';
  copyrightString: string = '';
  columns: ITdDataTableColumn[] = [
    { name: 'rawData.numero',  label: 'Iscrizione n°', sortable: true, width: 80},
    { name: 'rawData.datiPersonali.nome',  label: 'Nome', sortable: true},
    { name: 'rawData.datiPersonali.cognome', label: 'Cognome', filter: true, sortable: false },
    { name: 'rawData.datiPersonali.dataDiNascitaString', label: 'Data nascita', hidden: false },
    { name: 'rawData.datiPersonali.comunenascita', label: 'Luogo nascita', hidden: false },
    { name: 'rawData.sezioni', label: 'Sezioni', sortable: true},
    { name: 'rawData.sottosezioni', label: 'Sottosezioni', sortable: false, width: { min: 250, max: 450 }},
    { name: 'rawData', label: 'Azioni', sortable: true, width: 100, hidden: true },
  ];

  searchResponse: any;
  data: any = [];
  filteredData: any = this.data;
  filteredTotal: number = this.data.length;

  searchTerm: string = '';
  fromRow: number = 0;
  currentPage: number = 1;
  pageSize: number = 50;
  sortBy: string = 'rawData.datiPersonali.cognome';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  sezioniAutocomplete: any[] = [];

  sottoSezioniAutocomplete: any[] = [];

  /**
   * 'di possedere l\'esperienza richiesta per gli affidamenti complessi',
   * 'di NON possedere l\'esperienza richiesta per gli affidamenti complessi',
   */
  livelloEsperienzaAutocomplete: string[] = [
    'con esperienza',
    'senza esperienza',
  ];

  filteredSezioniAutocomplete: any[];
  filteredSottoSezioniAutocomplete: any[];
  filteredLivelliEsperienzaAutocomplete: string[];

  sezioniStringsModel: any[] = [];
  sottoSezioniStringsModel: any[] = [];
  livelliEseperienzaStringsModel: string[] = [];

  constructor(private _titleService: Title,  private _consultazioniService: ConsultazioniService,
    private _dataCtx: AppDataCtx, private _ctx: AppCtx,
    private ref: ChangeDetectorRef, private dataDialog: MatDialog,
    private _dialogRef: MatDialogRef<ConsultazioniDataDialog>,
    private _loadingService: TdLoadingService) {
      this.sezioniAutocomplete = _dataCtx.getDefaultSezioni();
      this.sottoSezioniAutocomplete = _dataCtx.getDefaultProfessioniTechniche();
      this.sottoSezioniAutocomplete = this.sottoSezioniAutocomplete.concat(_dataCtx.getDefaultSettoreSanitarioElements());
      this.sottoSezioniAutocomplete = this.sottoSezioniAutocomplete.concat(_dataCtx.getDefaultAltriServiziElements());
      this.toolbarTitle = <string>_ctx.getConfig('toolbarTitle');
      this.copyrightString = <string>_ctx.getConfig('copyrightString');
}

  filterSezioniStrings(value: string): void {
    this.filteredSezioniAutocomplete = this.sezioniAutocomplete.filter((item: any) => {
      if (value) {
        return item.label.toLowerCase().indexOf(value.toLowerCase()) > -1;
      } else {
        return false;
      }
    });
  }

  filtersottoSezioniStrings(value: string): void {
    this.filteredSottoSezioniAutocomplete = this.sottoSezioniAutocomplete.filter((item: any) => {
      if (value) {
        return item.label.toLowerCase().indexOf(value.toLowerCase()) > -1;
      } else {
        return false;
      }
    });
  }

  /**
   * 
   * @param value 
   */
  filterlivelliEsperienzaStrings(value: string): void {
    this.filteredLivelliEsperienzaAutocomplete = this.livelloEsperienzaAutocomplete.filter((item: any) => {
      if (value) {
        return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
      } else {
        return false;
      }
    });
  }

  ngOnInit(): void {
    this._titleService.setTitle( 'Consultazioni' );
  }

  // ngx transform using covalent digits pipe
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val);
  }

  seeData(row: any): void {

    let config: MatDialogConfig = {width:'90%', height:'400px', data: row};
    this._dialogRef = this.dataDialog.open(ConsultazioniDataDialog, config);

    this._dialogRef.afterClosed().subscribe( result => {
      console.log(`Dialog result: ${result}`);
    });

  }
  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {

    this.data = this.searchResponse.searchResults;
    let newData: any[] = this.data;
    let excludedColumns: string[] = this.columns
    .filter((column: ITdDataTableColumn) => {
      return ((column.filter === undefined && column.hidden === true) ||
              (column.filter !== undefined && column.filter === false));
    }).map((column: ITdDataTableColumn) => {
      return column.name;
    });
// newData = this._iscrizioneService.filterData(newData, this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
// newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
//   newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;

  }
/**
 * compone stringa di query e esegue la ricerca
 * @param term 
 * @param srtipo 
 */
doSearch(term: string, srtipo): void {
    let searchString: string = this.composeSearchString(term);
    this.cerca(searchString).then(() => {this.filter(); });
}
/**
 * concatena sezioni
 */
getSezioni(): string {
  let arr = this.sezioniStringsModel.map( uno => uno.label);
  return arr.join(',');
}

/**
 * concatena sottosezioni
 */
getSottoSezioni(): string {
  let arr = this.sottoSezioniStringsModel.map( uno => uno.label);
  return arr.join(',');
}

 async cerca(query: string): Promise<void> {
    try {
//      console.log('CERCA' + query);
      this._loadingService.register('consultazioni.search');
      this.searchResponse = await this._consultazioniService.cercaIscrizioni(query, this.pageSize, this.fromRow).toPromise();
      // }
    } catch (error) {
      console.log(`An error has occured : ${error}`);
    } finally {
      this._loadingService.resolve('consultazioni.search');
    }
  }
 
private composeSearchString(term: string): string {
  let retval: string = term;
  let sezioniContrib: string = undefined;
  let sottoSezioniContrib: string = undefined;
  let esperienzaContrib: string = undefined;

  if (this.sezioniStringsModel.length > 0 ) {
      sezioniContrib = 'sezioni.nome=' + this.getSezioni();
      retval = retval + ' AND ' + sezioniContrib;
  }
  if (this.sottoSezioniStringsModel.length > 0 ) {
    sottoSezioniContrib = 'sottosezioni.nome=' + this.getSottoSezioni();
    retval = retval + ' AND ' + sottoSezioniContrib;
}
  return retval;
}
  private toggleDisabled(val: boolean): void {
    this.disabled = val;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }
}

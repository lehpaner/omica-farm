import { Component, HostBinding, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core/data-table';
import { IPageChangeEvent } from '@covalent/core/paging';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';
import { Router } from '@angular/router';

import { slideInDownAnimation } from '../../app.animations';

import { UserService, IUser } from '../services/admin.user.service';
import { AppCtx } from '../../app.context';
import { Profile } from '../../model';

@Component({
  selector: 'qs-lista-utenti',
  styleUrls: ['./utenti.component.scss'],
  templateUrl: './utenti.component.html',
  animations: [slideInDownAnimation],
})
export class ListaUtentiComponent  implements OnInit {

  currentUser: Profile;

  users: any;
  filteredUsers: IUser[];
  filteredTotal: number = 0;


  searchTerm: string = '';
  fromRow: number = 0;

  currentPage: number = 1;
  pageSize: number = 50;

  statiUtente: any[] = [
    {value: 0, viewValue: 'Stato'},
    {value: 10, viewValue: 'Iscritto'},
    {value: 20, viewValue: 'Sospeso'},
    {value: 30, viewValue: 'Cancellato'},
    {value: 40, viewValue: 'Rimosso'},
  ];

  columns: ITdDataTableColumn[] = [
    { name: 'codiceFiscale',  label: 'Codice utente'},
    { name: 'stato',  label: 'Stato'},
    { name: 'isAdmin', label: 'Admin' },
    { name: 'options', label: 'Actions'},
  ];

  constructor(private _titleService: Title,
              private _appCtx: AppCtx,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService,
              private _userService: UserService,
              private _router: Router,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {
  }

  ngOnInit(): void {
    this._titleService.setTitle('Gestione commissari');
    this.load(this.searchTerm, this.pageSize, this.currentPage);
  }

  page(page): void {
    this.currentPage = page;
    this.load(this.searchTerm, this.pageSize, page);
}

  searchUsers(query): void {
    this.searchTerm = query;
    this.load(this.searchTerm, this.pageSize, this.currentPage);
}
  goToEdit(id: string): void {
    this._router.navigate(['admin', 'user', id]);
}

  filterUsers(displayName: string = ''): void {
  this.filteredUsers = Object.assign([], this.users.data);
  }

  async load(q: string, rows: number, start: number): Promise<void> {
    try {
//      this._loadingService.register('users.list');
      this.users = await this._userService.searchUsers(q, rows, start - 1).toPromise();
    } catch (error) {
      console.log(`An error has occured : ${error}`);
      this._dialogService.openAlert({title: 'Recupero utenti non riuscito', message: 'Errore di sistema', closeButton: 'CHIUDI' });
    } finally {
      this.filteredUsers = Object.assign([], this.users.data);
      this.filteredTotal = this.users.total;
    }
  }

  delete(id: string): void {
    this._dialogService
      .openConfirm({message: 'Are you sure you want to delete this user?'})
      .afterClosed().toPromise().then((confirm: boolean) => {
        if (confirm) {
          this._delete(id);
        }
      });
  }

  private async _delete(id: string): Promise<void> {
    try {
      this._loadingService.register('users.list');
      await this._userService.delete(id).toPromise();
      this.users = this.users.filter((user: IUser) => {
        return user.codiceFiscale !== id;
      });
      this.filteredUsers = this.filteredUsers.filter((user: IUser) => {
        return user.codiceFiscale !== id;
      });
    } catch (error) {
      this._dialogService.openAlert({message: 'There was an error trying to delete the user'});
    } finally {
      this._loadingService.resolve('users.list');
    }
  }

  private getStato4Value(val: number): string {
    if (val === 10 ) { 
        return 'Iscritto';
    }
    let td = this.statiUtente.filter((uno) => uno.value === val);
    if ( td.length > 0) {
       return <string> td[0].viewValue;
    }
    return '';
}
private getIcon4Val(val:boolean): string {
   return (val === true) ? 'thumb_up' : 'thumb_down';
}
}

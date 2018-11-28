import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';

import { UserService, IUser } from '../services/admin.user.service';
import { AppCtx } from '../../app.context';
import { Profile } from '../../model';

import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';

@Component({
  selector: 'qs-user-form',
  templateUrl: './utente-edit.component.html',
  styleUrls: ['./utente-edit.component.scss'],
})
export class UserFormComponent implements OnInit {

  profile: Profile = undefined;
  currentUser: firebase.User = undefined;
  displayName: string;
  email: string;
  id: string;
  admin: boolean;
  user: IUser;
  action: string;

  userStatus: number;
  isAdmin: boolean = false;
  statiUtente: any[] = [
    {value: 0, viewValue: 'Stato'},
    {value: 10, viewValue: 'Iscritto'},
    {value: 20, viewValue: 'Sospeso'},
    {value: 30, viewValue: 'Cancellato'}
  ];

  constructor(private _userService: UserService,
              private _appCtx: AppCtx,
              private _router: Router,
              private _route: ActivatedRoute,
              private _snackBarService: MatSnackBar,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService) {
                this.currentUser = this._appCtx.getCurrentUser();

  }

  userStatusChanged(newVal): void {
    console.log(newVal );
     this.userStatus = newVal.value;
}

  goBack(): void {
    this._router.navigate(['/admin']);
  }

  ngOnInit(): void {

    this._route.params.subscribe((params: {id: string}) => {
      this.id = params.id;
      if (this.id) {
        this.load(this.id);
      }
    });
  }

  async load(id: string): Promise<void> {
    try {
      this._loadingService.register('user.form');
      this.user = await this._userService.getUser(this.id).toPromise();
      this.userStatus = this.user.stato;
      this.isAdmin = this.user.isAdmin;
    } catch (error) {
      console.log(`An error has occured : ${error}`);
      this._dialogService.openAlert({message: 'There was an error loading the user'});
    } finally {
      console.log('Loaded user: ' + this.userStatus + this.isAdmin );
      this._loadingService.resolve('user.form');
    }
  }

  async save(): Promise<void> {
    try {
      this._loadingService.register('user.form');
      this.user.stato = this.userStatus;
      this.user.isAdmin = this.isAdmin;
      console.log('saving user user: ' + this.user );
      await this._userService.saveUser(this.user).toPromise();
    } catch (error) {
      console.log(`An error has occured : ${error}`);
      this._dialogService.openAlert({message: 'There was an error saving the user:'});
    } finally {
      if (this.user.uid === this.currentUser.uid) { //SE UTENTE E ATTUALMENTE LOGGATO
        let roles: string[] = [];
        if (this.user.isAdmin) {
          roles.push('admin');
          this._appCtx.setConfig('isAdmin', true);
        } else {
          this._appCtx.setConfig('isAdmin', false);
        }
        if (this.user.stato === 10) {
          roles.push('iscritto');
        } else if (this.user.stato === 20) {//SOSPE SO
          roles.push('sospeso');
        } else if (this.user.stato === 30) {
          roles.push('cancellato');
        }
        this._appCtx.setConfig('roles', roles);
      }
      this._loadingService.resolve('user.form');
      this.goBack();
    }
  }
}

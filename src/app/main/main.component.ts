import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppCtx} from '../app.context';
import { DAPI } from '../services/dapi';
import { User } from 'firebase';
import { IAuthChangedEvent, IResultRestModel, Workspace } from '../model';
import { TdNavigationDrawerComponent } from '@covalent/core';
import { TdLoadingService } from '@covalent/core/loading';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'qs-commissari-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  routes: Object[] = [

  ];

  authChangeSubscription: any;
  currentUser: User;
  logged: boolean = false;
  currentWS: Workspace;
  

  @ViewChild('sidePanel')
  _sidePanel: TdNavigationDrawerComponent;

  constructor(private _appCtx: AppCtx, private _dapi:DAPI, private _router: Router,
    private _loadingService: TdLoadingService, private _titleService: Title) {
  }

  public ngOnInit(): void {
    console.log('MainComponent init');
    this.authChangeSubscription = this._appCtx.authChangedEvent.subscribe(u => this.onAuthChanged(u))
    if(this.currentUser) {
      this.loadWorkspace(this.currentUser.uid).then (()=>{console.log("Workspace loaded")});
    }
  }

  private onAuthChanged(event: IAuthChangedEvent): void {
    console.log('Main Fired Auth:', event);
    this.currentUser = event.user;
    if((event.user === null) || event.user.isAnonymous){
        this._sidePanel.sidenavTitle = 'Menu';
        this._sidePanel.icon = '';
        this._sidePanel.name = '';
        this._sidePanel.email = '';
        this.logged = false;
      } else {
        this._sidePanel.sidenavTitle = 'Utente';
        this._sidePanel.name = event.user.displayName;
        this._sidePanel.icon = 'person';
        this._sidePanel.email = event.user.email;
        this.logged = true;
        if(this.currentUser.isAnonymous){
          this.currentWS = null;
        } else {
          this.loadProfile(this.currentUser.uid).then(() => {
            this.loadWorkspace(this.currentUser.uid).then(() => {
              console.log('WS&PROFILE LOADED');
            });
          });
        }
    }
    
  }

  /**
   * setup worspace parameters
   */
  public setupWorkspace(seed:IResultRestModel): void {
    let ws: Workspace = seed.data;
    this._appCtx.setConfig('workspace', ws);
    console.log('Setting workspace :', ws);
    if(ws === null) return;
    this.routes = <object[]>ws.extendedData;
  }
/**
 * Load workspace description 
 */
  async loadWorkspace(userId: string): Promise<void> {
    this._dapi.nodeGetByOwnerAndTypeAsync(userId, 1142).then((res:IResultRestModel) => {
      this.setupWorkspace(res);
    }) ;
      
  }
  async loadProfile(userId: string): Promise<void> {
    await this._dapi.nodeGetByOwnerAndTypeAsync(userId, 1999).then((prof:IResultRestModel) => {
      console.log('PROFILE DATA:', prof.data);
      this._appCtx.profile = prof.data;
    });
  }
  
  admin():void {
    this._sidePanel.close();
    this._router.navigate(['/admin']);
  }

  public logout(): void {
    this._sidePanel.close();
    this._appCtx.logout().then(() => {
      this._router.navigate(['/']);
    });
    
  }
}

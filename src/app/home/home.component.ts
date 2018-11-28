import { Component, OnInit, AfterViewInit, HostBinding } from '@angular/core';

import { Title } from '@angular/platform-browser';

import { TdDigitsPipe } from '@covalent/core/common';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';

import { AppCtx } from '../app.context';
import { DAPI } from '../services/dapi';
import { IAuthChangedEvent, IPropertyChangedEvent, IResultRestModel} from '../model';
import { IQNode, IDataRep} from '../nodes/model';

import { slideInDownAnimation } from '../app.animations';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'qs-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [slideInDownAnimation],
})
export class HomeComponent implements OnInit, AfterViewInit {

  @HostBinding('@routeAnimation') routeAnimation: boolean = true;
  @HostBinding('class.td-route-animation') classAnimation: boolean = true;
  
  currentUser: firebase.User = null;
  currentUserCallback: Subscription;
  contextChanged: Subscription;

  toolbarTitle: string = '';
  copyrightString: string = '';
  starCount: number = 0;


  wsChildren: IQNode[] = [];
  farmList: IQNode[] = [];

  sections: Object[] = [{
      color: 'deep-purple-A400',
      description: 'Guida utilizzo applicazione',
      icon: 'library_books',
      route: 'docs',
      title: 'Documentazione',
    }, {
      color: 'teal-A700',
      description: 'Consultazione albo commissari',
      icon: 'picture_in_picture',
      route: 'components',
      title: 'Consultazione dati',
    }, {
      color: 'cyan-A700',
      description: 'Inserimento dati',
      icon: 'view_quilt',
      route: 'layouts',
      title: 'Aggiornamento dati',
    },
  ];

  constructor(private _appCtx: AppCtx, private _dapi:DAPI, 
              private _titleService: Title, private _dialogService: TdDialogService,
              private _loadingService: TdLoadingService) { 
    this.toolbarTitle = <string>_appCtx.getConfig('toolbarTitle');
    this.copyrightString = <string>_appCtx.getConfig('copyrightString');
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this._titleService.setTitle('Manage records');
    this.currentUserCallback = this._appCtx.authChangedEvent.subscribe(u => this.onUserChanged(u));
    this.contextChanged =this._appCtx.configChanged.subscribe(c => this.onContextChanged(c));
  }
  private onContextChanged(event:IPropertyChangedEvent): void {
    if(event.name ==='workspace'){
       this.setupWorkspace(event.newVal);
    }
  }
  private onUserChanged(event: IAuthChangedEvent): void {
    console.log('Main Fired Auth:', event);
    this.currentUser = event.user;
  //  if(this.currentUser.isAnonymous){
  //    this.wsChildren = []; //Clear data
  //  } else {
  //      let wsid = <IQNode>this._appCtx.getConfig('workspace');      
  //  }
  }
  ///Setup workspace
  private setupWorkspace(ws:IQNode):void {
    if(ws){
      this.load(ws.id).then(() => { console.log('SETUP WORKSPACE...');});
    }
  }

  async load(wsId: string): Promise<void> {
    let response: IResultRestModel;
    try {
      console.log(`Loading children of ws : ${wsId}`);
      response = await this._dapi.nodeGetChildren(wsId);
    } catch (error) {
      this.wsChildren = [];
      console.log(`An error has occured : ${error}`);
      this._dialogService.openAlert({title: 'Data load failed', message: error , closeButton: 'CLOSE'});
    } finally {
      
      if(response.result==='SUCESS') {
        if(! Array.isArray(response.data) ){
          this.wsChildren.push(response.data);
        } else {
          this.wsChildren =  Object.assign([], response.data);
        }
        console.log(`Loaded children  : ${JSON.stringify(response.data)}`);
        this.farmList = this.wsChildren.filter((one: IQNode) => one.subtype === 2000);
      } else {
        this._dialogService.openAlert({title: 'Error loading data', message: response.message , closeButton: 'CLOSE'});
      }
      
    }
  }
 
  public addNode() {
    
  }
}

import { NgModule, Type, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, Title }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';

import { RequestInterceptor } from './services/request.interceptor';

import { routedComponents, AppRoutingModule } from './app-routing.module';
import { ToolbarModule } from './common/toolbar/toolbar.module';
import { SharedModule } from './shared/shared.module';
import { ConsultazioniService } from './consultazioni/services/consultazioni.service';
import { ConsultazioniComponent } from './consultazioni/consultazioni.component';
import { ConsultazioniDataDialog } from './consultazioni/consultazioni-dialog.component';
import { MatDialogModule, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { CovalentChipsModule } from '@covalent/core/chips';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

import { AppCtx }       from './app.context';
import { AppDataCtx }   from './app.data.context';
import { DAPI } from './services/dapi';
import { DOPI } from './services/dopi';
import { NodeFactory } from './nodes/services/node-factory.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth.guard.service';
import { JwtHelperService } from './services/jwt-helper.service';

const httpInterceptorProviders: Type<any>[] = [
  RequestInterceptor,
];

@NgModule({
  declarations: [
    AppComponent,
    ConsultazioniComponent,
    ConsultazioniDataDialog,
    routedComponents,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase), /// imports firebase/app needed for everything
    AngularFirestoreModule,       // imports firebase/firestore, only needed for database features
    AngularFireAuthModule,        // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule,      // imports firebase/storage only needed for storage features
    AppRoutingModule,
    BrowserModule,
    MatDialogModule,
    CovalentChipsModule,
    ToolbarModule,
    BrowserAnimationsModule,
    SharedModule,
    CovalentHttpModule.forRoot({
      interceptors: [{
        interceptor: RequestInterceptor, paths: ['**'],
      }],
    }),
    CovalentHighlightModule,
    CovalentMarkdownModule,
  ],
  providers: [
    httpInterceptorProviders,
    AuthService, AuthGuardService, AppDataCtx, ConsultazioniService, JwtHelperService,
    AppCtx, { provide: APP_INITIALIZER, useFactory: (config: AppCtx) => () => config.load(), deps: [AppCtx], multi: true },
    Title,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }, 
    DAPI, DOPI,
    NodeFactory],
    entryComponents: [ ConsultazioniDataDialog ],
  bootstrap: [AppComponent]
})
export class AppModule { }

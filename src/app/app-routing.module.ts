import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { ConsultazioniComponent } from './consultazioni/consultazioni.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth.guard.service';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
            },
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                component: ConsultazioniComponent,
                path: 'consultazioni',
               // canActivate: [ AuthGuardService ],
            },
            { path: '', loadChildren: './admin/admin.module#AdminModule' },
			{ path: '', loadChildren: './iscrizione/iscrizione.module#IscrizioneModule' },
            { path: '', loadChildren: './docs/docs.module#DocsModule' },
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true }),
    ],
    exports: [
        RouterModule,
    ]
})
export class AppRoutingModule { }
export const routedComponents: any[] = [
    MainComponent, LoginComponent, HomeComponent,
    ConsultazioniComponent,
];

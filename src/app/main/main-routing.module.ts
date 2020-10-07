import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { DocumentationComponent } from './documentation/docs.component';
import { LandsComponent } from './land-admnistration/lands.component';
import { LandComponent } from './land-admnistration/land.component';
import { ExternalComponent } from './third-parties/external.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'landhome', component: HomeComponent, data: { permission: null }},
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'documentation', component: DocumentationComponent, data: { permission: null }},
                    { path: 'lands', component: LandsComponent, data: { permission: null }},
                    { path: 'land/:id', component: LandComponent, data: { permission: null }},
                    { path: 'land/:id/edit', component: LandComponent, data: { permission: null }},
                    { path: 'external', component: ExternalComponent, data: { permission: null }}
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }

import { Routes, RouterModule } from '@angular/router';

import { NifiComponent } from './nifi.component';
import { SyncFlowComponent } from './sync-flow/sync-flow.component';


const routes: Routes = [{
  children: [{
    component: SyncFlowComponent,
    path: '',
  },/* {
      component: NodeComponent,
      path: 'node/:id',
    }, {
      component: ListaUtentiComponent,
      path: 'users',
    }, {
      component: UserFormComponent,
      path: 'user/:id',
    }, {
      component: AdminDocsComponent,
      path: 'docs',
    }, {
      component: AdminDocComponent,
      path: 'doc',
    }, {
      component: AdminGestioneComponent,
      path: 'forms',
    },*/
  ],
  component: NifiComponent,
  path: 'nifi',
}];
export const nifiRoutes: any = RouterModule.forChild(routes);

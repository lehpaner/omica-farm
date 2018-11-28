import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminDocsComponent } from './admindoc/doc-manage.component';
import { AdminDocComponent } from './admindoc/doc-edit.component';
import { ListaUtentiComponent } from './utenti/utenti.component';
import { UserFormComponent } from './utenti/utente-edit.component';
import { AdminGestioneComponent } from './admingestione/admingestione.component';
import { FormEditorComponent } from './admingestione/form-editor.component';
import { SyncFlowComponent } from './sync/sync.component';

const routes: Routes = [{
  children: [{
      component: ListaUtentiComponent,
      path: '',
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
    }, {
      component: FormEditorComponent,
      path: 'form',
    }, {
      component: SyncFlowComponent,
      path: 'nifi',
    },
  ],
  component: AdminComponent,
  path: 'admin',
}];
export const adminRoutes: any = RouterModule.forChild(routes);

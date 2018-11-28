import { ModuleWithProviders} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FarmsComponent } from './farms.component';
import { IscrizioneFormComponent } from './form/form.component';
import { DocsComponent } from './docs/docs.component';
import { AuthGuardService } from '../services/auth.guard.service';

const routes: Routes = [{
    path: 'farms',
    children: [{
      path: '',
      component: FarmsComponent,
      canActivate: [AuthGuardService],
    }, {
      path: 'add',
      component: IscrizioneFormComponent,
    }, {
      path: ':id/edit',
      component: IscrizioneFormComponent,
    }, {
      path: ':id/allegati',
      component: DocsComponent,
    }],
}];

export const farmsRoutes: ModuleWithProviders = RouterModule.forChild(routes);

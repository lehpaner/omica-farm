import { ModuleWithProviders} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FarmsComponent } from './farms.component';
import { FarmViewComponent } from './view/farm.view.component';
import { FarmOverviewComponent } from './view/farm.overview.component';
import { IscrizioneFormComponent } from './form/form.component';
import { DocsComponent } from './docs/docs.component';
import { AuthGuardService } from '../services/auth.guard.service';

const routes: Routes = [{
    path: 'farm',
    children: [{
      path: '',
      component: FarmsComponent,
      canActivate: [AuthGuardService],
    }, {
      path: 'add',
      component: IscrizioneFormComponent,
    }, {
      path: ':id/view',
      component: FarmOverviewComponent,
    },
    {
      path: ':id/edit',
      component: IscrizioneFormComponent,
    }, {
      path: ':id/allegati',
      component: DocsComponent,
    }],
}];

export const farmsRoutes: ModuleWithProviders = RouterModule.forChild(routes);

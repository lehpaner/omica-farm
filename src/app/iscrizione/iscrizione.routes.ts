import { ModuleWithProviders} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IscrizioneComponent } from './iscrizione.component';
import { IscrizioneFormComponent } from './form/form.component';
import { AllegatiComponent } from './allegati/allegati.component';
import { AuthGuardService } from '../services/auth.guard.service';

const routes: Routes = [{
    path: 'iscrizione',
    children: [{
      path: '',
      component: IscrizioneComponent,
//      canActivate: [AuthGuardService],
    }, {
      path: 'add',
      component: IscrizioneFormComponent,
    }, {
      path: ':id/edit',
      component: IscrizioneFormComponent,
    }, {
      path: ':id/allegati',
      component: AllegatiComponent,
    }],
}];

export const iscrizioneRoutes: ModuleWithProviders = RouterModule.forChild(routes);

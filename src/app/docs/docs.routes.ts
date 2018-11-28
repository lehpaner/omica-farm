import { Routes, RouterModule } from '@angular/router';

import { AnacDocsComponent } from './docs.component';
import { DocsOverviewComponent } from './overview/overview.component';
import { DocsConsultazioneComponent } from './consultazione/consultazione.component';
import { DocsGestioneComponent } from './gestione/gestione.component';

const routes: Routes = [{
  children: [{
      component: DocsOverviewComponent,
      path: '',
    }, {
      component: DocsConsultazioneComponent,
      path: 'consultazione',
    }, {
          component: DocsGestioneComponent,
      path: 'gestione',
    },
  ],
  component: AnacDocsComponent,
  path: 'docs',
}];

export const docsRoutes: any = RouterModule.forChild(routes);

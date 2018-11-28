import { Routes, RouterModule } from '@angular/router';
import { NodesComponent } from './nodes.component';

const routes: Routes = [{
  children: [{
    component: NodesComponent,
    path: '',
    } 
  ],
  component: NodesComponent,
  path: 'node',
}];
export const NodesRoutes: any = RouterModule.forChild(routes);

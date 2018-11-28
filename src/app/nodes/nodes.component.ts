import { Component, HostBinding, ChangeDetectorRef } from '@angular/core';
import { TdMediaService } from '@covalent/core/media';

@Component({
  selector: 'qs-nodes',
  styleUrls: ['./nodes.component.scss'],
  templateUrl: './nodes.component.html',
})
export class NodesComponent {

  items: Object[] = [{
    description: 'Node management',
    icon: 'service',
    route: '.',
    title: 'Nodes',
  },{
      description: 'User management',
      icon: 'people',
      route: 'users',
      title: 'Users',
    },
  {
    description: 'Gestione pagine documentazione',
    icon: 'chrome_reader_mode',
    route: 'docs',
    title: 'Gestione documenti',
  },{
    description: 'Gestione elementi di modulo',
    icon: 'build',
    route: 'forms',
    title: 'Gestione elementi',
  }];

  constructor(private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {}

}
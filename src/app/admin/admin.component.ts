import { Component, HostBinding, ChangeDetectorRef } from '@angular/core';
import { TdMediaService } from '@covalent/core/media';

@Component({
  selector: 'qs-admin-components',
  styleUrls: ['./admin.component.scss'],
  templateUrl: './admin.component.html',
})
export class AdminComponent {

  items: Object[] = [{
      description: 'Gestione stato utenti',
      icon: 'people',
      route: '.',
      title: 'Utenti',
    },
  /*{
    description: 'Gestione pagine documentazione',
    icon: 'chrome_reader_mode',
    route: 'docs',
    title: 'Gestione documenti',
  },*/
{
    description: 'Gestione elementi di modulo',
    icon: 'build',
    route: 'forms',
    title: 'Gestione elementi',
  },
  {
    description: 'Gestione scambio dati',
    icon: 'sync',
    route: 'nifi',
    title: 'Scambio dati',
  }];

  constructor(private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {}

}

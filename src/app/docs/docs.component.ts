import { Component, HostBinding, ChangeDetectorRef } from '@angular/core';
import { TdMediaService } from '@covalent/core/media';

@Component({
  selector: 'app-docs',
  styleUrls: ['./docs.component.scss'],
  templateUrl: './docs.component.html',
})
export class AnacDocsComponent {

  items: Object[] = [{
    description: 'Introduzione alla applicazione',
    icon: 'chrome_reader_mode',
    route: '.',
    title: 'Introduzione',
  }, {
    description: 'Interrogazione dati raccolti da applicazione',
    icon: 'flash_on',
    route: 'consultazione',
    title: 'Consultazione iscrizioni',
  }, {
    description: 'Inserimento dati alla raccolta',
    icon: 'build',
    route: 'gestione',
    title: 'Gestione iscrizioni',
  }];

  constructor(private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {}

}

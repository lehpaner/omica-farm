import { Component, HostBinding, ChangeDetectorRef } from '@angular/core';
import { TdMediaService } from '@covalent/core/media';

@Component({
  selector: 'app-docs',
  styleUrls: ['./docs.component.scss'],
  templateUrl: './docs.component.html',
})
export class AnacDocsComponent {

  items: Object[] = [{
    description: 'Overview of application',
    icon: 'chrome_reader_mode',
    route: '.',
    title: 'Overview',
  }, {
    description: 'Managing farm data',
    icon: 'flash_on',
    route: 'consultazione',
    title: 'Farm management',
  }, {
    description: 'Management of seed&harvest',
    icon: 'build',
    route: 'gestione',
    title: 'Task management',
  }];

  constructor(private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {}

}

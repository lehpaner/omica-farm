import { Component, HostBinding } from '@angular/core';

import { slideInDownAnimation } from '../../app.animations';

@Component({
  selector: 'docs-consultazione',
  styleUrls: ['./consultazione.component.scss'],
  templateUrl: './consultazione.component.html',
  animations: [slideInDownAnimation],
})
export class DocsConsultazioneComponent {

  @HostBinding('@routeAnimation') routeAnimation: boolean = true;
  @HostBinding('class.td-route-animation') classAnimation: boolean = true;

}

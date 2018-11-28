import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'qs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

constructor(private _iconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer) {

  this._iconRegistry.addSvgIconInNamespace('assets', 'logo',
  this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/logo.svg'));
}
}

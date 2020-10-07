import { Type } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
//import { MatRippleModule } from '@angular/material/core';
//import { MatIconModule } from '@angular/material/icon';

import {ItemPanelComponent, ItemPanelHeaderDirective, ItemPanelLabelDirective, ItemPanelSublabelDirective, ItemPanelSummaryComponent } from './item-panel.component';
import { ItemPanelGroupComponent } from './item-panel-group.component';

const ITEM_EXPANSION_PANEL: Type<any>[] = [
  ItemPanelGroupComponent,
  ItemPanelComponent,
  ItemPanelHeaderDirective,
  ItemPanelLabelDirective,
  ItemPanelSublabelDirective,
  ItemPanelSummaryComponent,
];

@NgModule({
  imports: [CommonModule/*, MatRippleModule, MatIconModule*/, PortalModule],
  declarations: [ITEM_EXPANSION_PANEL],
  exports: [ITEM_EXPANSION_PANEL],
})
export class ItemPanelModule {}
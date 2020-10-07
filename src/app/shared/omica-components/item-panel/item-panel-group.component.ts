import { Component, Renderer2, ElementRef, QueryList, ContentChildren, AfterContentInit, Input, OnDestroy } from '@angular/core';
  import { ItemPanelComponent } from './item-panel.component';
  import { coerceBooleanProperty } from '@angular/cdk/coercion';
  import { takeUntil } from 'rxjs/operators';
  import { Subject } from 'rxjs';
  
  @Component({
    selector: 'item-panel-group',
    styleUrls: ['./item-panel-group.component.less'],
    templateUrl: './item-panel-group.component.html',
  })
  export class ItemPanelGroupComponent implements AfterContentInit, OnDestroy {
    private _multi: boolean = false;
  
    private _lastOpenedPanels: ItemPanelComponent[] = [];
  
    private _destroyed: Subject<boolean> = new Subject<boolean>();
    private _stopWatchingPanels: Subject<boolean> = new Subject<boolean>();
  
    /**
     * multi?: boolean
     * Sets whether multiple panels can be opened at a given time.
     * Set to false for accordion mode.
     * Defaults to false.
     */
    @Input('multi')
    set multi(multi: boolean) {
      this._multi = coerceBooleanProperty(multi);
      if (this._multi === false && this._lastOpenedPanels.length > 0) {
        this._closeAllExcept(this._lastOpenedPanels[this._lastOpenedPanels.length - 1]);
      }
    }
  
    @ContentChildren(ItemPanelComponent, { descendants: true }) expansionPanels: QueryList<ItemPanelComponent>;
  
    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {
      this._renderer.addClass(this._elementRef.nativeElement, 'item-panel-group');
    }
  
    ngOnDestroy(): void {
      this._destroyed.next(true);
      this._destroyed.unsubscribe();
      this._stopWatchingPanels.next(true);
      this._stopWatchingPanels.unsubscribe();
    }
  
    public ngAfterContentInit(): void {
      if (!this._multi) {
        const openedPanels: ItemPanelComponent[] = this.expansionPanels.filter(
          (expansionPanel: ItemPanelComponent) => expansionPanel.expand,
        );
        const numOpenedPanels: number = openedPanels.length;
        if (numOpenedPanels > 1) {
          this._closeAllExcept(openedPanels[numOpenedPanels - 1]);
        }
      }
  
      this._attachListeners(this.expansionPanels);
  
      this.expansionPanels.changes
        .pipe(takeUntil(this._destroyed))
        .subscribe((expansionPanels: QueryList<ItemPanelComponent>) => {
          this._stopWatchingPanels.next(true);
          this._stopWatchingPanels.unsubscribe();
          this._stopWatchingPanels = new Subject<boolean>();
          this._attachListeners(expansionPanels);
        });
    }
  
    /**
     * Opens all expansion panels, only if multi set set to true.
     */
    public openAll(): void {
      if (this._multi) {
        this.expansionPanels.forEach((expansionPanel: ItemPanelComponent) => {
          expansionPanel.open();
        });
      }
    }
  
    /**
     * Closes all expansion panels
     */
    public closeAll(): void {
      this.expansionPanels.forEach((expansionPanel: ItemPanelComponent) => {
        expansionPanel.close();
      });
    }
  
    private _attachListeners(expansionPanels: QueryList<ItemPanelComponent>): void {
      this._lastOpenedPanels = [];
      expansionPanels.forEach((expansionPanel: ItemPanelComponent) => {
        expansionPanel.expanded.pipe(takeUntil(this._stopWatchingPanels)).subscribe(() => {
          const indexOfPanel: number = this._lastOpenedPanels.indexOf(expansionPanel);
          if (indexOfPanel !== -1) {
            this._lastOpenedPanels.splice(indexOfPanel, 1);
          }
          this._lastOpenedPanels.push(expansionPanel);
  
          if (!this._multi) {
            this._closeAllExcept(expansionPanel);
          }
        });
  
        expansionPanel.collapsed.pipe(takeUntil(this._stopWatchingPanels)).subscribe(() => {
          const indexOfPanel: number = this._lastOpenedPanels.indexOf(expansionPanel);
          if (indexOfPanel !== -1) {
            this._lastOpenedPanels.splice(indexOfPanel, 1);
          }
        });
      });
    }
  
    private _closeAllExcept(expansionPanel: ItemPanelComponent): void {
      this.expansionPanels.forEach((panel: ItemPanelComponent) => {
        if (panel !== expansionPanel) {
          panel.close();
        }
      });
    }
  }
import { Component, Directive, Input, Output, TemplateRef, ViewContainerRef, ContentChild, ElementRef, Renderer2 } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { TemplatePortalDirective } from '@angular/cdk/portal';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { tdCollapseAnimation, tdRotateAnimation } from '../common/animations'
import { ICanDisable, mixinDisabled, ICanDisableRipple, mixinDisableRipple } from '../common/behaviour';

@Directive({ selector: '[item-panel-header]ng-template' })
export class ItemPanelHeaderDirective extends TemplatePortalDirective {
    constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
      super(templateRef, viewContainerRef);
    }
}

@Directive({ selector: '[item-panel-label]ng-template' })
export class ItemPanelLabelDirective extends TemplatePortalDirective {
    constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
      super(templateRef, viewContainerRef);
    }
}
  
  @Directive({ selector: '[item-panel-sublabel]ng-template' })
  export class ItemPanelSublabelDirective extends TemplatePortalDirective {
    constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
      super(templateRef, viewContainerRef);
    }
  }
  
  @Component({
    selector: 'item-summary',
    template: '<ng-content></ng-content>',
  })
  export class ItemPanelSummaryComponent {}
  
  export class ItemPanelBase {}
  
  /* tslint:disable-next-line */
  export const _ItemPanelMixinBase = mixinDisableRipple(mixinDisabled(ItemPanelBase));
  
  @Component({
    selector: 'item-panel',
    styleUrls: ['./item-panel.component.less'],
    templateUrl: './item-panel.component.html',
    inputs: ['disabled', 'disableRipple'],
    animations: [tdCollapseAnimation, tdRotateAnimation],
  })
  export class ItemPanelComponent extends _ItemPanelMixinBase implements ICanDisable, ICanDisableRipple {
    private _expand: boolean = false;
  
    @ContentChild(ItemPanelHeaderDirective)
    expansionPanelHeader: ItemPanelHeaderDirective;
    @ContentChild(ItemPanelLabelDirective) expansionPanelLabel: ItemPanelLabelDirective;
    @ContentChild(ItemPanelSublabelDirective)
    expansionPanelSublabel: ItemPanelSublabelDirective;
  
    /**
     * label?: string
     * Sets label of [ItemPanelComponent] header.
     * Defaults to 'Click to expand'
     */
    @Input() label: string;
  
    /**
     * sublabel?: string
     * Sets sublabel of [ItemPanelComponent] header.
     */
    @Input() sublabel: string;
  
    /**
     * expand?: boolean
     * Toggles [ItemPanelComponent] between expand/collapse.
     */
    @Input('expand')
    set expand(expand: boolean) {
      this._setExpand(coerceBooleanProperty(expand));
    }
    get expand(): boolean {
      return this._expand;
    }
  
    /**
     * expanded?: function
     * Event emitted when [ItemPanelComponent] is expanded.
     */
    @Output() expanded: EventEmitter<void> = new EventEmitter<void>();
  
    /**
     * collapsed?: function
     * Event emitted when [TdExpansionPanelComponent] is collapsed.
     */
    @Output() collapsed: EventEmitter<void> = new EventEmitter<void>();
  
    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {
      super();
      this._renderer.addClass(this._elementRef.nativeElement, 'item-panel');
    }
  
    /**
     * Method executed when [ItemPanelComponent] is clicked.
     */
    clickEvent(): void {
      this._setExpand(!this._expand);
    }
  
    /**
     * Toggle expand state of [ItemPanelComponent]
     * retuns 'true' if successful, else 'false'.
     */
    toggle(): boolean {
      return this._setExpand(!this._expand);
    }
  
    /**
     * Opens [TdExpansionPanelComponent]
     * retuns 'true' if successful, else 'false'.
     */
    open(): boolean {
      return this._setExpand(true);
    }
  
    /**
     * Closes [TdExpansionPanelComponent]
     * retuns 'true' if successful, else 'false'.
     */
    close(): boolean {
      return this._setExpand(false);
    }
  
    /** Method executed when the disabled value changes */
    onDisabledChange(v: boolean): void {
      if (v && this._expand) {
        this._expand = false;
        this._onCollapsed();
      }
    }
  
    /**
     * Method to change expand state internally and emit the [onExpanded] event if 'true' or [onCollapsed]
     * event if 'false'. (Blocked if [disabled] is 'true')
     */
    private _setExpand(newExpand: boolean): boolean {
      if (this.disabled) {
        return false;
      }
      if (this._expand !== newExpand) {
        this._expand = newExpand;
        if (newExpand) {
          this._renderer.addClass(this._elementRef.nativeElement, 'item-expanded');
          this._onExpanded();
        } else {
          this._renderer.removeClass(this._elementRef.nativeElement, 'item-expanded');
          this._onCollapsed();
        }
        return true;
      }
      return false;
    }
  
    private _onExpanded(): void {
      this.expanded.emit();
    }
  
    private _onCollapsed(): void {
      this.collapsed.emit();
    }
  }
/** Angular Imports */
import { Directive, HostListener, Input, Optional } from '@angular/core';

/** Popover Ref */
import { PopoverRef } from './popover-ref';

/**
 * Button that will close the current popover.
 */
@Directive({
  selector: '[mifosxPopoverClose]'
})
export class PopoverCloseDirective<T = any> {
  @Input('mifosxPopoverClose') popoverResult: T;

  /**
   * @param {PopoverRef<T>} popoverRef PopoverRef<T>.
   */
  constructor(
    @Optional() private popoverRef: PopoverRef<T>
  ) {}

  @HostListener('click') onClick(): void {
    if (!this.popoverRef) {

      return;
    }

    this.popoverRef.close(this.popoverResult);
  }
}

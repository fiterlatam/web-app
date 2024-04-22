/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Custom Directives */
import { HasPermissionDirective } from './has-permission/has-permission.directive';
import {FormatIntegerDirective} from './format-integer/format-integer.directive';
import {FormatDecimalDirective} from './format-decimal/format-decimal.directive';

/**
 *  Directives Module
 *
 *  All custom directives should be declared and exported here.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HasPermissionDirective, FormatIntegerDirective, FormatDecimalDirective],
  exports: [HasPermissionDirective, FormatIntegerDirective, FormatDecimalDirective]
})
export class DirectivesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLookupPipe } from './status-lookup.pipe';
import { AccountsFilterPipe } from './accounts-filter.pipe';
import { ChargesFilterPipe } from './charges-filter.pipe';
import { ChargesPenaltyFilterPipe } from './charges-penalty-filter.pipe';
import { FindPipe } from './find.pipe';
import { UrlToStringPipe } from './url-to-string.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { DatetimeFormatPipe } from './datetime-format.pipe';
import { ExternalIdentifierPipe } from './external-identifier.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { YesnoPipe } from './yesno.pipe';
import { FormatDisplayNamePipe } from './format-display-name.pipe';
import { PrettyPrintPipe } from './pretty-print.pipe';
import { MaskedNumberPipe } from './masked-number-pipe';
import { MaskedDatePipe } from './masked-date-pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StatusLookupPipe, AccountsFilterPipe, ChargesFilterPipe, ChargesPenaltyFilterPipe, FindPipe, UrlToStringPipe, DateFormatPipe, DatetimeFormatPipe, ExternalIdentifierPipe, FormatNumberPipe, YesnoPipe, FormatDisplayNamePipe,PrettyPrintPipe, MaskedNumberPipe, MaskedDatePipe ],
  providers: [StatusLookupPipe, AccountsFilterPipe, ChargesFilterPipe, ChargesPenaltyFilterPipe, FindPipe, UrlToStringPipe, DateFormatPipe, DatetimeFormatPipe, ExternalIdentifierPipe, FormatNumberPipe, YesnoPipe, FormatDisplayNamePipe, PrettyPrintPipe, MaskedNumberPipe, MaskedDatePipe ],
  exports: [StatusLookupPipe, AccountsFilterPipe, ChargesFilterPipe, ChargesPenaltyFilterPipe, FindPipe, UrlToStringPipe, DateFormatPipe, DatetimeFormatPipe, ExternalIdentifierPipe, FormatNumberPipe, YesnoPipe, FormatDisplayNamePipe, PrettyPrintPipe, MaskedNumberPipe, MaskedDatePipe ]
})
export class PipesModule { }

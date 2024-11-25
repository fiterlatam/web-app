/** Angular Imports */
import {Injectable, Injector} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

/** Environment Configuration */
import { environment } from 'environments/environment';

/** Custom Services */
import { Logger } from '../logger/logger.service';
import { AlertService } from '../alert/alert.service';
import {TranslateService} from '@ngx-translate/core';

/** Initialize Logger */
const log = new Logger('ErrorHandlerInterceptor');

/**
 * Http Request interceptor to add a default error handler to requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  /**
   * @param {AlertService} alertService Alert Service.
   * @param translateService
   */

  private _translateService: TranslateService;

  constructor(private alertService: AlertService,
              private injector: Injector) { }

  private get translateService(): TranslateService {
    if (!this._translateService) {
      this._translateService = this.injector.get(TranslateService);
    }
    return this._translateService;
  }

  /**
   * Intercepts a Http request and adds a default error handler.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Error handler.
   */
  private handleError(response: HttpErrorResponse): Observable<HttpEvent<any>> {
    const status = response.status;
    let errorMessage = (response.error.developerMessage || response.message);
    if (response.error.errors) {
      if (response.error.errors[0]) {
        errorMessage = response.error.errors[0].userMessageGlobalisationCode || response.error.errors[0].defaultUserMessage || response.error.errors[0].developerMessage;
        const params = response.error.errors[0].args || [];
        errorMessage = this.translateService.instant('errors.' + errorMessage);
        if (params && params.length > 0) {
          for (let i = 0; i < params.length; i++) {
            errorMessage = errorMessage.replace('{{params[' + i + '].value}}', params[i].value);
          }
        }
      }
    }

    if (!environment.production) {
      log.error(`Request Error: ${errorMessage}`);
    }

    if (status === 401 || (environment.oauth.enabled && status === 400)) {
      this.alertService.alert({ type: 'Authentication Error', message: 'Invalid User Details. Please try again!' });
    } else if (status === 403 && errorMessage === 'The provided one time token is invalid') {
      this.alertService.alert({ type: 'Invalid Token', message: 'Invalid Token. Please try again!' });
    } else if (status === 400) {
      this.alertService.alert({ type: 'Bad Request', message: errorMessage || 'Invalid parameters were passed in the request!' });
    } else if (status === 403) {
      this.alertService.alert({ type: 'Unauthorized Request', message: errorMessage || 'You are not authorized for this request!' });
    } else if (status === 404) {
      this.alertService.alert({ type: 'Resource does not exist', message: errorMessage || 'Resource does not exist!' });
    }  else if (status === 500) {
      this.alertService.alert({ type: 'Internal Server Error', message: 'Internal Server Error. Please try again later.' });
    } else {
      this.alertService.alert({ type: 'Unknown Error', message: 'Unknown Error. Please try again later.' });
    }

    throw response;
  }

}

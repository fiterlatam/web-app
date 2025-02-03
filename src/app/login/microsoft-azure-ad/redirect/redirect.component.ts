import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Credentials} from '../../../core/authentication/credentials.model';
import {AuthenticationService} from '../../../core/authentication/authentication.service';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'mifosx-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly http: HttpClient,
              private readonly authenticationService: AuthenticationService,
              private readonly router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const authorizationCode = params['code'];
      if(authorizationCode){
        this.http.post('/authentication', {authorizationCode, isMicrosoftSsoLogin: true})
          .subscribe((credentials: Credentials) => {
              this.authenticationService.onLoginSuccess(credentials);
              this.router.navigate(['/home']).then(r => logger.info('Redirected to home'));
            },
            error => {
              this.router.navigate(['/login']).then(r => logger.info('Redirected to login'));
            }
          );
      }
    });
  }

}

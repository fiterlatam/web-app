/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

/** rxjs Imports */
import {filter, finalize} from 'rxjs/operators';

/** Custom Services */
import { AuthenticationService } from '../../core/authentication/authentication.service';
import {MsalBroadcastService, MsalService} from "@azure/msal-angular";
import {
  AuthenticationResult,
  BrowserAuthError,
  InteractionStatus,
  PopupRequest, PublicClientApplication,
  RedirectRequest
} from "@azure/msal-browser";
import {logger} from "codelyzer/util/logger";
import {environment} from "../../../environments/environment";

/**
 * Login form component.
 */
@Component({
  selector: 'mifosx-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  /** Login form group. */
  loginForm: UntypedFormGroup;
  /** Password input field type. */
  passwordInputType: string;
  /** True if loading. */
  loading = false
  isMicrosoftSsoLogin: boolean = false;

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {AuthenticationService} authenticationService Authentication Service.
   */
  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService: AuthenticationService) {
  }

  /**
   * Creates login form.
   *
   * Initializes password input field type.
   */
  ngOnInit() {
    this.isMicrosoftSsoLogin = environment.oauth.enabled;
    this.createLoginForm();
    this.passwordInputType = 'password';
  }

  /**
   * Authenticates the user if the credentials are valid.
   */
  login() {
      this.loading = true;
      this.loginForm.disable();
      this.authenticationService.login(this.loginForm.value)
        .pipe(finalize(() => {
          this.loginForm.reset();
          this.loginForm.markAsPristine();
          // Angular Material Bug: Validation errors won't get removed on reset.
          this.loginForm.enable();
          this.loading = false;
        })).subscribe();
  }

  /**
   * TODO: Decision to be taken on providing this feature.
   */
  forgotPassword() {
    console.log('Forgot Password feature currently unavailable.');
  }

  /**
   * Creates login form.
   */
  private createLoginForm() {
    const formValidators = []
    if(this.isMicrosoftSsoLogin){
      formValidators.push(Validators.required);
    }
    this.loginForm = this.formBuilder.group({
      'username': ['', formValidators],
      'password': ['', formValidators],
      'remember': false
    });
  }

}

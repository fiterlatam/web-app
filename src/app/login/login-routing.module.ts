/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Custom Components */
import { LoginComponent } from './login.component';
import {RedirectComponent} from "./microsoft-azure-ad/redirect/redirect.component";

/** Login Routes */
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'microsoft/redirect',
    component: RedirectComponent,
    data: { title: 'Redirect' }
  }
];

/**
 * Login Routing Module
 *
 * Configures the login routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LoginRoutingModule { }

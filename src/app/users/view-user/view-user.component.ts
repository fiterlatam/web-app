/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

/** Custom Services */
import { UsersService } from '../users.service';

/** Custom Components */
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { ChangePasswordDialogComponent } from 'app/shared/change-password-dialog/change-password-dialog.component';
import {DeactivateUserDialogComponent} from "../deactivate-user-dialog/deactivate-user-dialog.component";
import {SettingsService} from "../../settings/settings.service";
import {Dates} from "../../core/utils/dates";
import {ConfirmationDialogComponent} from "../../shared/confirmation-dialog/confirmation-dialog.component";
import {TranslateService} from "@ngx-translate/core";

/**
 * View user component.
 */
@Component({
  selector: 'mifosx-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  /** User Data. */
  userData: any;

  /**
   * Retrieves the user data from `resolve`.
   * @param {UsersService} usersService Users Service.
   * @param settingsService
   * @param dateUtils
   * @param translateService
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(private usersService: UsersService,
              private settingsService: SettingsService,
              private dateUtils: Dates,
              private translateService: TranslateService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) {
    this.route.data.subscribe((data: { user: any }) => {
      this.userData = data.user;
    });
  }

  ngOnInit() {
  }

  /**
   * Deletes the user and redirects to users.
   */
  delete() {
    const deleteUserDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `user ${this.userData.id}` }
    });
    deleteUserDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.usersService.deleteUser(this.userData.id)
          .subscribe(() => {
            this.router.navigate(['/appusers']);
          });
      }
    });
  }

  /**
   * Change Password of the Users.
   */
  changeUserPassword() {
    const changeUserPasswordDialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      height: '300px'
    });
    changeUserPasswordDialogRef.afterClosed().subscribe((response: any) => {
      if (response.password && response.repeatPassword) {
        const password = response.password;
        const repeatPassword = response.repeatPassword;
        const firstname = this.userData.firstname;
        const data = {password: password, repeatPassword: repeatPassword, firstname: firstname};
        this.usersService.changePassword(this.userData.id, data).subscribe(() => {
          this.router.navigate(['/appusers']);
        });
      }
    });
  }

  isActive(){
    return this.userData.status.id === 300;
  }

  /**
   * Deactivate user.
   */
  deactivateUser() {
    const deactivateUserDialogRef = this.dialog.open(DeactivateUserDialogComponent, {
      width: '700px',
      height: '270px'
    });
    deactivateUserDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        const deactivationType = response.temporaryDeactivation ? "TEMPORARY" : "PERMANENT";
        let deactivatedFromDate = response.deactivatedFromDate;
        let deactivatedToDate = response.deactivatedToDate;
        const locale = this.settingsService.language.code;
        const dateFormat = this.settingsService.dateFormat;
        deactivatedFromDate = this.dateUtils.formatDate(deactivatedFromDate, dateFormat);
        deactivatedToDate = this.dateUtils.formatDate(deactivatedToDate, dateFormat);
        const data = {deactivationType, deactivatedFromDate, deactivatedToDate, locale, dateFormat};
        this.usersService.deactivateUser(this.userData.id, data).subscribe(() => {
          this.router.navigate(['/appusers']);
        });
      }
    });
  }

  /**
   * Reactivate back a user
   */
  reactivateUser() {
    const reactivateConfirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { heading: this.translateService.instant('labels.heading.Reactivate User'), dialogContext: this.translateService.instant('labels.dialogContext.Are you sure you want to reactivate back user'), type: 'Strong' }
    });
    reactivateConfirmationDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        this.usersService.reactivateUser(this.userData.id)
          .subscribe(() => {
            this.router.navigate(['/appusers']);
          });
      }
    });
  }
}

/** Angular Imports */
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

/** RxJS Imports */
import { forkJoin } from 'rxjs';

/** Custom Services */
import { NotificationsService } from 'app/notifications/notifications.service';
import { environment } from 'environments/environment';

/**
 * Notifications Tray Component
 */
@Component({
  selector: 'mifosx-notifications-tray',
  templateUrl: './notifications-tray.component.html',
  styleUrls: ['./notifications-tray.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsTrayComponent implements OnInit, OnDestroy {
  /** Wait time between API status calls 60 seg */
  waitTime = environment.waitTimeForNotifications || 60;
  /** Read Notifications */
  readNotifications: any[] = [];
  /** Displayed Read Notifications */
  displayedReadNotifications: any[] = [];
  /** Unread Notifications */
  unreadNotifications: any[] = [];
  /** Timer to refetch notifications every 60 seconds */
  timer: any;
  private static hasRun = false;
  /**
   * Gets router link prefix from notification's objectType attribute
   * Shares, Savings, Deposits, Loans routes inaccessible because of dependency on entity ID.
   */
  routeMap: any = {
    'client' : '/clients/',
    'group' : '/groups/',
    'loan': '/loans-accounts/',
    'center' : '/centers/',
    'shareAccount' : '/shares-accounts/',
    'fixedDeposit' : '/fixed-deposits-accounts/',
    'recurringDepositAccount': '/recurring-deposits-accounts/',
    'savingsAccount' : '/savings-accounts/',
    'shareProduct': '/products/share-products/',
    'loanProduct' : '/products/loan-products/'
  };

  /**
   * @param {NotificationsService} notificationsService Notifications Service
   */
  constructor(public notificationsService: NotificationsService) {
  }

  ngOnInit() {
    if (!NotificationsTrayComponent.hasRun) {
      console.log('Notification component runs once!');
      this.notificationsService.getNotifications(true).subscribe((response: any) => {
        this.readNotifications = response.pageItems;
      });
      this.fetchUnreadNotifications();
      NotificationsTrayComponent.hasRun = true;
    }

  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  /**
   * Restructures displayed read notifications vis-a-vis unread notifications.
   */
  setNotifications() {
    const length = this.unreadNotifications.length;
    this.displayedReadNotifications = length < 9 ? this.readNotifications.slice(0, 9 - length) : [];
  }

  /**
   * Recursively fetch unread notifications.
   */
  fetchUnreadNotifications() {
    this.notificationsService.getNotifications(false).subscribe((response: any) => {
      this.unreadNotifications = this.unreadNotifications.concat(response.pageItems);
      this.setNotifications();
    });
    // this.mockNotifications(); // Uncomment for Testing.
    this.timer = setTimeout(() => { this.fetchUnreadNotifications(); }, this.waitTime * 10000);
  }

  /**
   * Update read/unread notifications.
   */
  menuClosed() {
    // Update the server for read notifications.
    this.notificationsService.updateNotifications().subscribe(() => {});
    // Update locally for read notifications.
    this.readNotifications = this.unreadNotifications.concat(this.readNotifications);
    this.unreadNotifications = [];
    this.setNotifications();
  }

  /**
   * Function to test notifications in case of faulty backend.
   */
  mockNotifications() {
    this.notificationsService.getMockUnreadNotification().subscribe((response: any) => {
      this.unreadNotifications = this.unreadNotifications.concat(response.pageItems);
      this.setNotifications();
    });
  }

}

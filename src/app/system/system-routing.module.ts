import { NgModule } from '@angular/core';

/** Routing Imports */
import { Routes, RouterModule } from '@angular/router';
import { Route } from '../core/route/route.service';

/** Component Imports */
import { SystemComponent } from './system.component';
import { CodesComponent } from './codes/codes.component';
import { CreateCodeComponent } from './codes/create-code/create-code.component';
import { ViewCodeComponent } from './codes/view-code/view-code.component';
import { EditCodeComponent } from './codes/edit-code/edit-code.component';
import { ExternalServicesComponent } from './external-services/external-services.component';
import { ManageDataTablesComponent } from './manage-data-tables/manage-data-tables.component';
import { CreateDataTableComponent } from './manage-data-tables/create-data-table/create-data-table.component';
import { ViewDataTableComponent } from './manage-data-tables/view-data-table/view-data-table.component';
import { EditDataTableComponent } from './manage-data-tables/edit-data-table/edit-data-table.component';
import { ManageHooksComponent } from './manage-hooks/manage-hooks.component';
import { ViewHookComponent } from './manage-hooks/view-hook/view-hook.component';
import { CreateHookComponent } from './manage-hooks/create-hook/create-hook.component';
import { EditHookComponent } from './manage-hooks/edit-hook/edit-hook.component';
import { RolesAndPermissionsComponent } from './roles-and-permissions/roles-and-permissions.component';
import { AddRoleComponent } from './roles-and-permissions/add-role/add-role.component';
import { ManageSurveysComponent } from './manage-surveys/manage-surveys.component';
import { CreateSurveyComponent } from './manage-surveys/create-survey/create-survey.component';
import { ViewSurveyComponent } from './manage-surveys/view-survey/view-survey.component';
import { EditSurveyComponent } from './manage-surveys/edit-survey/edit-survey.component';
import { AmazonS3Component } from './external-services/amazon-s3/amazon-s3.component';
import { EmailComponent } from './external-services/email/email.component';
import { SMSComponent } from './external-services/sms/sms.component';
import { NotificationComponent } from './external-services/notification/notification.component';
import { EditAmazonS3Component } from './external-services/amazon-s3/edit-amazon-s3/edit-amazon-s3.component';
import { EditEmailComponent } from './external-services/email/edit-email/edit-email.component';
import { EditNotificationComponent } from './external-services/notification/edit-notification/edit-notification.component';
import { EditSMSComponent } from './external-services/sms/edit-sms/edit-sms.component';
import { AccountNumberPreferencesComponent } from './account-number-preferences/account-number-preferences.component';
import { CreateAccountNumberPreferenceComponent } from './account-number-preferences/create-account-number-preference/create-account-number-preference.component';
import { ViewAccountNumberPreferenceComponent } from './account-number-preferences/view-account-number-preference/view-account-number-preference.component';
import { EditAccountNumberPreferenceComponent } from './account-number-preferences/edit-account-number-preference/edit-account-number-preference.component';
import { ManageReportsComponent } from './manage-reports/manage-reports.component';
import { EditReportComponent } from './manage-reports/edit-report/edit-report.component';
import { CreateReportComponent } from './manage-reports/create-report/create-report.component';
import { ViewReportComponent } from './manage-reports/view-report/view-report.component';
import { AuditTrailsComponent } from './audit-trails/audit-trails.component';
import { ViewAuditComponent } from './audit-trails/view-audit/view-audit.component';
import { ViewRoleComponent } from './roles-and-permissions/view-role/view-role.component';
import { EditRoleComponent } from './roles-and-permissions/edit-role/edit-role.component';
import { EntityToEntityMappingComponent } from './entity-to-entity-mapping/entity-to-entity-mapping.component';

/** Custom Resolvers */
import { CodesResolver } from './codes/codes.resolver';
import { CodeResolver } from './codes/code.resolver';
import { CodeValuesResolver } from './codes/view-code/code-values.resolver';
import { ManageDataTablesResolver } from './manage-data-tables/manage-data-tables.resolver';
import { DataTableResolver } from './manage-data-tables/data-table.resolver';
import { ManageHooksResolver } from './manage-hooks/manage-hooks.resolver';
import { HookResolver } from './manage-hooks/view-hook/hook.resolver';
import { HooksTemplateResolver } from './manage-hooks/hooks-template.resolver';
import { RolesAndPermissionsResolver } from './roles-and-permissions/roles-and-permissions.resolver';
import { ManageSurveysResolver } from './manage-surveys/manage-surveys.resolver';
import { GlobalConfigurationsResolver } from './configurations/global-configurations-tab/global-configurations.resolver';
import { AmazonS3ConfigurationResolver } from './external-services/amazon-s3/amazon-s3.resolver';
import { EmailConfigurationResolver } from './external-services/email/email.resolver';
import { SMSConfigurationResolver } from './external-services/sms/sms.resolver';
import { NotificationConfigurationResolver } from './external-services/notification/notification.resolver';
import { AccountNumberPreferencesResolver } from './account-number-preferences/account-number-preferences.resolver';
import { AccountNumberPreferencesTemplateResolver } from './account-number-preferences/create-account-number-preference/account-number-preferences-template.resolver';
import { AccountNumberPreferenceResolver } from './account-number-preferences/view-account-number-preference/account-number-preference.resolver';
import { AuditTrailSearchTemplateResolver } from './audit-trails/audit-trail-search-template.resolver';
import { AuditTrailResolver } from './audit-trails/view-audit/audit-trail.resolver';
import { ReportsResolver } from './manage-reports/reports.resolver';
import { ReportResolver } from './manage-reports/report.resolver';
import { SurveyResolver } from './manage-surveys/survey.resolver';
import { ReportTemplateResolver } from './manage-reports/report-template.resolver';
import { ViewSchedulerJobComponent } from './manage-jobs/scheduler-jobs/view-scheduler-job/view-scheduler-job.component';
import { ViewSchedulerJobResolver } from './manage-jobs/scheduler-jobs/view-scheduler-job/view-scheduler-job.resolver';
import { EditSchedulerJobComponent } from './manage-jobs/scheduler-jobs/edit-scheduler-job/edit-scheduler-job.component';
import { ManageSchedulerJobResolver } from './manage-jobs/scheduler-jobs/manage-scheduler-job.resolver';
import { ViewRoleResolver } from './roles-and-permissions/view-role/view-role.resolver';
import { EntityToEntityMappingResolver } from './entity-to-entity-mapping/entity-to-entity-mapping.resolver';
import { ConfigureMakerCheckerTasksComponent } from './configure-maker-checker-tasks/configure-maker-checker-tasks.component';
import { MakerCheckerTasksResolver } from './configure-maker-checker-tasks/configure-maker-checker-tasks.resolver';
import { ViewHistorySchedulerJobComponent } from './manage-jobs/scheduler-jobs/view-history-scheduler-job/view-history-scheduler-job.component';
import { ViewHistorySchedulerJobsResolver } from './manage-jobs/scheduler-jobs/view-history-scheduler-job/view-history-scheduler-job.resolver';
import { ConfigurationsComponent } from './configurations/configurations.component';
import { GlobalConfigurationResolver } from './configurations/global-configurations-tab/global-configuration.resolver';
import { EditConfigurationComponent } from './configurations/global-configurations-tab/edit-configuration/edit-configuration.component';
import { ManageJobsComponent } from './manage-jobs/manage-jobs.component';
import { ManageExternalEventsComponent } from './manage-external-events/manage-external-events.component';
import { ManageExternalEventsResolver } from './manage-external-events/manage-external-events.resolver';
import { ManageBlockingReasonsComponent } from './manage-blocking-reasons/manage-blocking-reasons.component';
import { CreateManageBlockingReasonsComponent } from './manage-blocking-reasons/create-manage-blocking-reasons/create-manage-blocking-reasons.component';
import { ManageBlockingReasonsTemplateResolver } from './manage-blocking-reasons/create-manage-blocking-reasons/manage-blocking-reasons-template.resolver';
import { ManageBlockingReasonsResolver } from './manage-blocking-reasons/manage-blocking-reasons.resolver';
import { ViewManageBlockingReasonsComponentResolverService } from './manage-blocking-reasons/view-manage-blocking-reasons/view-manage-blocking-reasons-component-resolver.service';
import { ViewManageBlockingReasonsComponent } from './manage-blocking-reasons/view-manage-blocking-reasons/view-manage-blocking-reasons.component';
import { EditManageBlockingReasonsComponent } from './manage-blocking-reasons/edit-manage-blocking-reasons/edit-manage-blocking-reasons.component';

const routes: Routes = [
  Route.withShell([
    {
      path: 'system',
      data: { title: 'System', breadcrumb: 'System' },
      children: [
        {
          path: '',
          component: SystemComponent
        },
        {
          path: 'codes',
          data: { title: 'View Codes', breadcrumb: 'Codes' },
          children: [
            {
              path: '',
              component: CodesComponent,
              resolve: {
                codes: CodesResolver
              }
            },
            {
              path: 'create',
              component: CreateCodeComponent,
              data: { title: 'Create Code', breadcrumb: 'Create' }
            },
            {
              path: ':id',
              data: { title: 'View Code', routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewCodeComponent,
                  resolve: {
                    code: CodeResolver,
                    codeValues: CodeValuesResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditCodeComponent,
                  data: { title: 'Edit Code', breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    code: CodeResolver
                  }
                }
              ]
            }
          ],
        },
        {
          path: 'external-events',
          data: { title: 'Manage External Events', breadcrumb: 'Manage External Events' },
          children: [
            {
              path: '',
              component: ManageExternalEventsComponent,
              resolve: {
                events: ManageExternalEventsResolver
              }
            },
          ]
        },
        {
          path: 'entity-to-entity-mapping',
          component: EntityToEntityMappingComponent,
          data: { title: 'Entity to Entity Mapping', breadcrumb: 'Entity to Entity Mapping' },
          resolve: {
            entityMappings: EntityToEntityMappingResolver
          }
        },
        {
          path: 'external-services',
          data: { title: 'External Services', breadcrumb: 'External Services' },
          children: [
            {
              path: '',
              component: ExternalServicesComponent
            },
            {
              path: 'amazon-s3',
              data: { title: 'View Amazon S3 Configuration', breadcrumb: 'Amazon S3' },
              children: [
                {
                  path: '',
                  component: AmazonS3Component,
                  resolve: {
                    amazonS3Configuration: AmazonS3ConfigurationResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditAmazonS3Component,
                  data: { title: 'Edit Amazon S3 Configuration', breadcrumb: 'Edit' },
                  resolve: {
                    amazonS3Configuration: AmazonS3ConfigurationResolver
                  }
                }
              ]
            },
            {
              path: 'email',
              data: { title: 'View Email Configuration', breadcrumb: 'Email' },
              children: [
                {
                  path: '',
                  component: EmailComponent,
                  resolve: {
                    emailConfiguration: EmailConfigurationResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditEmailComponent,
                  data: { title: 'Edit Email Configuration', breadcrumb: 'Edit' },
                  resolve: {
                    emailConfiguration: EmailConfigurationResolver
                  }
                }
              ]
            },
            {
              path: 'sms',
              data: { title: 'View SMS Configuration', breadcrumb: 'SMS' },
              children: [
                {
                  path: '',
                  component: SMSComponent,
                  resolve: {
                    smsConfiguration: SMSConfigurationResolver
                  }
                },
                {
                  path: 'edit',
                  data: { title: 'Edit SMS Configuration', breadcrumb: 'Edit' },
                  component: EditSMSComponent,
                  resolve: {
                    smsConfiguration: SMSConfigurationResolver
                  }
                }
              ]
            },
            {
              path: 'notification',
              data: { title: 'View Notification Configuration', breadcrumb: 'Notification' },
              children: [
                {
                  path: '',
                  component: NotificationComponent,
                  resolve: {
                    notificationConfiguration: NotificationConfigurationResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditNotificationComponent,
                  data: { title: 'Edit Notification Configuration', breadcrumb: 'Edit' },
                  resolve: {
                    notificationConfiguration: NotificationConfigurationResolver
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'data-tables',
          data: { title: 'Manage Data Tables', breadcrumb: 'Manage Data Tables' },
          children: [
            {
              path: '',
              component: ManageDataTablesComponent,
              resolve: {
                dataTables: ManageDataTablesResolver
              },
            },
            {
              path: 'create',
              component: CreateDataTableComponent,
              data: { title: 'Create Data Table', breadcrumb: 'Create' },
              resolve: {
                columnCodes: CodesResolver
              }
            },
            {
              path: ':datatableName',
              data: { title: 'View Data Table', routeParamBreadcrumb: 'datatableName' },
              children: [
                {
                  path: '',
                  component: ViewDataTableComponent,
                  resolve: {
                    dataTable: DataTableResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditDataTableComponent,
                  data: { title: 'Edit Data table', breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    dataTable: DataTableResolver,
                    columnCodes: CodesResolver
                  }
                }
              ]
            }
          ],
        },
        {
          path: 'hooks',
          data: { title: 'Manage Hooks', breadcrumb: 'Manage Hooks' },
          children: [
            {
              path: '',
              component: ManageHooksComponent,
              resolve: {
                hooks: ManageHooksResolver
              }
            },
            {
              path: 'create',
              component: CreateHookComponent,
              data: { title: 'Create Hook', breadcrumb: 'Create' },
              resolve: {
                hooksTemplate: HooksTemplateResolver
              }
            },
            {
              path: ':id',
              data: { title: 'View Hook', routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewHookComponent,
                  resolve: {
                    hook: HookResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditHookComponent,
                  data: { title: 'Edit Hook', breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    hooksTemplate: HooksTemplateResolver,
                    hook: HookResolver
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'roles-and-permissions',
          data: { title: 'Roles and Permissions', breadcrumb: 'Roles and Permissions' },
          children: [
            {
              path: '',
              component: RolesAndPermissionsComponent,
              resolve: {
                roles: RolesAndPermissionsResolver
              }
            },
            {
              path: 'add',
              component: AddRoleComponent,
              data: { title: 'Add Role', breadcrumb: 'Add' }
            },
            {
              path: ':id',
              data: { title: 'View Role', routeParamBreadcrumb: 'id' },
              runGuardsAndResolvers: 'always',
              children: [
                {
                  path: '',
                  component: ViewRoleComponent,
                  resolve: {
                    roledetails: ViewRoleResolver,
                  }
                },
                {
                  path: 'edit',
                  component: EditRoleComponent,
                  data: { title: 'Edit Role', breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    role: ViewRoleResolver,
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'configure-mc-tasks',
          data: { title: 'Configure Maker Checker Tasks', breadcrumb: 'Configure Maker Checker Tasks' },
          component: ConfigureMakerCheckerTasksComponent,
          resolve: {
            permissions: MakerCheckerTasksResolver
          }
        },
        {
          path: 'surveys',
          data: { title: 'Manage Surveys', breadcrumb: 'Manage Surveys' },
          children: [
            {
              path: '',
              component: ManageSurveysComponent,
              resolve: {
                surveys: ManageSurveysResolver
              }
            },
            {
              path: 'create',
              component: CreateSurveyComponent,
              data: { title: 'Create Survey', breadcrumb: 'Create' },
            },
            {
              path: ':id',
              data: { title: 'View Survey', routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewSurveyComponent,
                  resolve: {
                    survey: SurveyResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditSurveyComponent,
                  data: { title: 'Edit Survey', breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    survey: SurveyResolver
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'manage-jobs',
          data: { title: 'Manage Scheduler and COB Jobs', breadcrumb: 'Manage Scheduler and COB Jobs' },
          children: [
            {
              path: '',
              component: ManageJobsComponent,
              resolve: {},
            },
            {
              path: ':id',
              data: { title: 'View Scheduler Job', routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewSchedulerJobComponent,
                  resolve: {
                    selectedJob: ViewSchedulerJobResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditSchedulerJobComponent,
                  data: { title: 'Edit Scheduler Job', routeParamBreadcrumb: false, breadcrumb: 'Edit' },
                  resolve: {
                    jobSelected: ManageSchedulerJobResolver
                  }
                },
                {
                  path: 'viewhistory',
                  component: ViewHistorySchedulerJobComponent,
                  data: { title: 'Scheduler Job History', breadcrumb: 'View History' },
                  resolve: {
                    jobsSchedulerHistory: ViewHistorySchedulerJobsResolver
                  },
                }
              ]
            }
          ],
        },
        {
          path: 'configurations',
          data: { title: 'Configurations', breadcrumb: 'Configurations' },
          children: [
            {
              path: '',
              component: ConfigurationsComponent,
              resolve: {
                configurations: GlobalConfigurationsResolver
              }
            },
            {
              path: ':id/edit',
              data: { title: 'Edit Configuration', routeParamBreadcrumb: 'id' },
              component: EditConfigurationComponent,
              resolve: {
                configuration: GlobalConfigurationResolver
              }
            }
          ]
        },
        {
          path: 'account-number-preferences',
          data: { title: 'Account Number Preferences', breadcrumb: 'Account Number Preferences' },
          children: [
            {
              path: '',
              component: AccountNumberPreferencesComponent,
              resolve: {
                accountNumberPreferences: AccountNumberPreferencesResolver
              }
            },
            {
              path: 'create',
              component: CreateAccountNumberPreferenceComponent,
              data: { title: 'Create Account Number Preference', breadcrumb: 'Create' },
              resolve: {
                accountNumberPreferencesTemplate: AccountNumberPreferencesTemplateResolver
              }
            },
            {
              path: ':id',
              data: { title: 'View Account Number Preference', routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewAccountNumberPreferenceComponent,
                  resolve: {
                    accountNumberPreference: AccountNumberPreferenceResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditAccountNumberPreferenceComponent,
                  data: { title: 'Edit Account Number Preference', breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    accountNumberPreference: AccountNumberPreferenceResolver,
                    accountNumberPreferencesTemplate: AccountNumberPreferencesTemplateResolver
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'reports',
          data: { title: 'Manage Reports', breadcrumb: 'Manage Reports' },
          children: [
            {
              path: '',
              component: ManageReportsComponent,
              resolve: {
                reports: ReportsResolver
              }
            },
            {
              path: 'create',
              component: CreateReportComponent,
              data: { title: 'Create Report', breadcrumb: 'Create' },
              resolve: {
                reportTemplate: ReportTemplateResolver
              }
            },
            {
              path: ':id',
              data: { title: 'View Report', routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewReportComponent,
                  resolve: {
                    report: ReportResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditReportComponent,
                  data: { title: 'Edit Report', routeParamBreadcrumb: false, breadcrumb: 'Edit' },
                  resolve: {
                    report: ReportResolver,
                    reportTemplate: ReportTemplateResolver
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'audit-trails',
          data: { title: 'Audit Trails', breadcrumb: 'Audit Trails' },
          children: [
            {
              path: '',
              component: AuditTrailsComponent,
              resolve: {
                auditTrailSearchTemplate: AuditTrailSearchTemplateResolver
              }
            },
            {
              path: ':id',
              component: ViewAuditComponent,
              data: { title: 'View Audit', routeParamBreadcrumb: 'id' },
              resolve: {
                auditTrail: AuditTrailResolver
              }
            }
          ]
        },
        {
          path: 'manage-blocking-reasons',
          data: { title: 'Manage Blocking Reasons', breadcrumb: 'Manage Blocking Reasons' },
          children: [
            {
              path: '',
              component: ManageBlockingReasonsComponent,
              resolve: {
                manageBlockingReasonsResolver: ManageBlockingReasonsResolver
              }
            },
            {
              path: 'create',
              component: CreateManageBlockingReasonsComponent,
              data: { title: 'Create Blocking Reason', breadcrumb: 'Create' },
              resolve: {
                manageBlockingReasonTemplateResolver: ManageBlockingReasonsTemplateResolver
              }
            },
            {
              path: ':id',
              data: { title: 'View Blocking Reason Setting', routeParamBreadcrumb: 'id' },
          children: [
            {
              path: '',
              component: ViewManageBlockingReasonsComponent,
              resolve: {
                viewBlockingReasonItem: ViewManageBlockingReasonsComponentResolverService
              }
            },
            {
              path: 'edit',
              component: EditManageBlockingReasonsComponent,
              data: { title: 'Edit Blocking Reason Settings', breadcrumb: 'Edit', routeParamBreadcrumb: false },
              resolve: {
                viewBlockingReasonItem: ViewManageBlockingReasonsComponentResolverService
              }
            }
        ]
        }  
        ]
        }
      ]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CodesResolver,
    CodeResolver,
    CodeValuesResolver,
    ManageDataTablesResolver,
    DataTableResolver,
    ManageHooksResolver,
    HookResolver,
    HooksTemplateResolver,
    RolesAndPermissionsResolver,
    ManageSurveysResolver,
    SurveyResolver,
    GlobalConfigurationsResolver,
    GlobalConfigurationResolver,
    AmazonS3ConfigurationResolver,
    EmailConfigurationResolver,
    SMSConfigurationResolver,
    NotificationConfigurationResolver,
    AccountNumberPreferencesResolver,
    AccountNumberPreferencesTemplateResolver,
    AccountNumberPreferenceResolver,
    ReportsResolver,
    ReportResolver,
    ReportTemplateResolver,
    AuditTrailSearchTemplateResolver,
    AuditTrailResolver,
    ViewSchedulerJobResolver,
    ManageSchedulerJobResolver,
    ViewRoleResolver,
    EntityToEntityMappingResolver,
    MakerCheckerTasksResolver,
    ViewHistorySchedulerJobsResolver,
    ManageBlockingReasonsTemplateResolver,
    ManageBlockingReasonsResolver,
    ViewManageBlockingReasonsComponentResolverService,
    ViewManageBlockingReasonsComponent,
    EditManageBlockingReasonsComponent
  ]
})
export class SystemRoutingModule { }

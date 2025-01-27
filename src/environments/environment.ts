// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// `.env.ts` is generated by the `npm run env` command
import env from './.env';

export const environment = {
  production: false,
  version: env.mifos_x.version,
  hash: env.mifos_x.hash,
  // For connecting to server running elsewhere update the tenant identifier
  fineractPlatformTenantId: window['env']['fineractPlatformTenantId'] || 'default',
  fineractPlatformTenantIds: window['env']['fineractPlatformTenantIds'] || 'default, migration',
  fineractPlatformTenantChannel: window['env']['fineractPlatformTenantChannel'] || 'Mifos',
  // For connecting to others servers running elsewhere update the base API URL
  baseApiUrls: window['env']['fineractApiUrls'] ||
    'https://dev.mifos.io,https://demo.mifos.io,https://qa.mifos.io,https://staging.mifos.io,https://mobile.mifos.io,https://demo.fineract.dev,https://localhost:8443,https://entreamigos-dev.fiter.io,http://localhost:8080',
  // For connecting to server running elsewhere set the base API URL
  baseApiUrl: window['env']['baseApiUrl'] || 'https://demo.fineract.dev',
  allowServerSwitch: env.allow_switching_backend_instance,
  apiProvider: window['env']['apiProvider'] || '/fineract-provider/api',
  apiVersion: window['env']['apiVersion'] || '/v1',
  serverUrl: '',
  oauth: {
    enabled: false,  // For connecting to Mifos X using OAuth2 Authentication change the value to true
    serverUrl: ''
  },
  warningDialog: {
    title: 'Warning',
    content: 'This system is for authorized use only. Unauthorized access will result in possible legal action. By accessing this system, you acknowledge that you are authorized to do so and that all data stored and processed here is confidential.',
    buttonText: 'Close'
  },
  defaultLanguage: window['env']['defaultLanguage'] || 'es-MX',
  supportedLanguages: window['env']['supportedLanguages'] || 'cs-CS,de-DE,en-US,es-MX,fr-FR,it-IT,ko-KO,lt-LT,lv-LV,ne-NE,pt-PT,sw-SW',
  preloadClients: window['env']['preloadClients'] || true,

  defaultCharDelimiter: window['env']['defaultCharDelimiter'] || ',',

  displayBackEndInfo: window['env']['displayBackEndInfo'] || 'false',
  // Time in seconds, default 60 seconds
  waitTimeForNotifications: window['env']['waitTimeForNotifications'] || 60,
  // Time in seconds, default 30 seconds
  waitTimeForCOBCatchUp: window['env']['waitTimeForCOBCatchUp'] || 30,

  languageSelector: window['env']['languageSelector'] || false,

  session: {
    timeout: {
      idleTimeout: window['env']['sessionIdleTimeout'] || 300000, // 5 minutes
    }
  }
};

// Server URL
environment.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}${environment.apiVersion}`;
environment.oauth.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}`;

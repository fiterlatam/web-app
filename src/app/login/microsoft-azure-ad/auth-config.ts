import { Configuration, LogLevel } from '@azure/msal-browser';
import {environment} from '../../../environments/environment';

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.oauth.clientId,
    authority: environment.oauth.authority,
    redirectUri: environment.oauth.redirectUri,
    navigateToLoginRequestUrl: false,
    postLogoutRedirectUri: environment.oauth.postLogoutRedirectUri,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            return;
          case LogLevel.Info:
            return;
          case LogLevel.Verbose:
            return;
          case LogLevel.Warning:
            return;
        }
      },
      piiLoggingEnabled: false,
    },
  },
};

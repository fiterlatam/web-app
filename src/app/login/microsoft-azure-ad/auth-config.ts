import { Configuration, LogLevel } from '@azure/msal-browser';
import {environment} from "../../../environments/environment";

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
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      piiLoggingEnabled: false,
    },
  },
};

import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { provideRouter } from '@angular/router';
import { environment } from '@environments/environment.development';
import { graphqlProvider } from './graphql.provider';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
  withNoIncrementalHydration,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideZoneChangeDetection(),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    //graphqlProvider,
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: `${environment.platziApi}/api/graphql` }),
        cache: new InMemoryCache({
          typePolicies: {
            Query: { fields: {} },
          },
        }),
      };
    }),
  ],
};

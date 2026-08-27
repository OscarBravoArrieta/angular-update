import {
    ApplicationConfig,
    inject,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { provideRouter, withExperimentalAutoCleanupInjectors } from '@angular/router';
import { environment } from '@environments/environment.development';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

//import { graphqlProvider } from './graphql.provider';

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
        provideZonelessChangeDetection(),
        provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
        provideRouter(routes, withExperimentalAutoCleanupInjectors()),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: 'none',
                    cssLayer: false,
                    cssVariables: true,
                },
            },
            license:
                'eyJpZCI6ImIwYjIwNDQ1LTlmODctNDJkMS04MjgzLTEwMmViOWQ3ZjVlMSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODc1MjkxNzcsImV4cCI6MTgxOTA2NTE3N30.jKu-Gt7tFQEoT3qSPvxrI_tR0Xg8GbM_LjF7I6Gd7OXTWNKzPnLT8XHCndWwI3nDypOWaiB-qAN7DWo1t3FtBw',
        }),
        //graphqlProvider,
        provideApollo(() => {
            const httpLink = inject(HttpLink);
            return {
                link: httpLink.create({ uri: environment.platziGraphqlApi }),
                cache: new InMemoryCache({
                    typePolicies: {
                        Query: { fields: {} },
                    },
                }),
            };
        }),
    ],
};

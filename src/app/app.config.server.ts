import { mergeApplicationConfig, ApplicationConfig, inject } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { provideHttpClient } from '@angular/common/http';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideApollo(() => ({
      link: inject(HttpLink).create({ uri: 'https://your-graphql-endpoint.com' }),
      cache: new InMemoryCache(),
    })),
    provideServerRendering(withRoutes(serverRoutes)),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

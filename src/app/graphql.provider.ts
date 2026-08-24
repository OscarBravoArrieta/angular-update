// import { ApplicationConfig, inject } from '@angular/core';
// import { InMemoryCache } from '@apollo/client/core';
// import { ApolloClientOptions } from '@apollo/client';
// import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
// import { HttpLink } from 'apollo-angular/http';
// import { environment } from '@environments/environment.development';

// export function apolloOptionsFactory(): ApolloClientOptions<any> {
//   const httpLink = inject(HttpLink);
//   return {
//     link: httpLink.create({ uri: `${environment.platziApi}/api/graphql` }),
//     cache: new InMemoryCache({
//       typePolicies: {
//         Query: { fields: {} },
//       },
//     }),
//   };
// }
// export const graphqlProvider: ApplicationConfig['providers'] = [
//   Apollo,
//   {
//     provide: APOLLO_OPTIONS,
//     useFactory: apolloOptionsFactory,
//   },
//];

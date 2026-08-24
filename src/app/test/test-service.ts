import { Service, inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';


@Service()
//@Injectable({ providedIn: 'root' })
export class TestService {

 private apollo = inject(Apollo)
//  getUsers(): Observable<unknown> {
//     return this.apollo
//       .watchQuery({
//         query: gql`query {
//           users {
//              id
//              name
//              email
//           }
//         }`,
//       }).valueChanges.pipe(map((result: unknown) => result)
//   }
}


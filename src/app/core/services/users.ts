import { Service, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountError, RegisterResult, UserToRegister } from '@core/models/users.model';

const REGISTER_MUTATION = gql`
    mutation AccountRegister($input: AccountRegisterInput!) {
        accountRegister(input: $input) {
            requiresConfirmation
            errors {
                field
                message
                code
            }
        }
    }
`;

@Service()
export class Users {
    private apollo = inject(Apollo);

    register(input: UserToRegister): Observable<RegisterResult> {
        return this.apollo
            .mutate<{ accountRegister: RegisterResult & { errors: AccountError[] } }>({
                mutation: REGISTER_MUTATION,
                variables: { input },
            })
            .pipe(
                map(({ data }) => {
                    const { errors, ...result } = data!.accountRegister;
                    if (errors.length > 0) {
                        throw new Error(errors[0].message ?? 'No se pudo crear la cuenta.');
                    }

                    return result;
                }),
            );
    }
}

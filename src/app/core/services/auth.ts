import { Service, inject, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Token, UserProfile, UserToLog } from '@core/models/users.model';

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            access_token
            refresh_token
        }
    }
`;

const MY_PROFILE_QUERY = gql`
    query MyProfile {
        myProfile {
            id
            name
            avatar
        }
    }
`;

const REFRESH_TOKEN_MUTATION = gql`
    mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
            access_token
            refresh_token
        }
    }
`;

@Service()
export class Auth {
    private readonly apollo = inject(Apollo);

    readonly tokens = signal<Token | null>(null);

    login(credentials: UserToLog): Observable<Token> {
        return this.apollo
            .mutate<{ login: Token }>({
                mutation: LOGIN_MUTATION,
                variables: credentials,
            })
            .pipe(
                map(({ data }) => {
                    const token = data!.login;
                    this.tokens.set(token);
                    return token;
                }),
            );
    }

    getProfile(): Observable<UserProfile> {
        return this.apollo
            .watchQuery<{ myProfile: UserProfile }>({
                query: MY_PROFILE_QUERY,
                context: {
                    headers: {
                        Authorization: `Bearer ${this.tokens()?.access_token}`,
                    },
                },
            })
            .valueChanges.pipe(map(({ data }) => data!.myProfile as UserProfile));
    }

    refreshToken(): Observable<Token> {
        return this.apollo
            .mutate<{ refreshToken: Token }>({
                mutation: REFRESH_TOKEN_MUTATION,
                variables: { refreshToken: this.tokens()?.refresh_token },
            })
            .pipe(
                map(({ data }) => {
                    const token = data!.refreshToken;
                    this.tokens.set(token);
                    return token;
                }),
            );
    }
}

import { Injector, Service, computed, inject, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import type { Token, UserProfile, UserToLog } from '@core/models/users.model';
import { toObservable } from '@angular/core/rxjs-interop';

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
    private apollo = inject(Apollo);
    readonly tokens = signal<Token | null>(null);

    // 1. Inyectamos el Injector de Angular en el servicio
    private injector = inject(Injector);

    #userProfileState = signal<UserProfile | null>(null);
    public userProfile = this.#userProfileState.asReadonly();

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
                    //this.getProfile();

                    return token;
                }),
            );
    }

    getProfile(): Observable<UserProfile> {
        // 2. Le pasamos explícitamente el injector a toObservable
        return toObservable(this.tokens, { injector: this.injector }).pipe(
            switchMap((tokens) => {
                return this.apollo.watchQuery<{ myProfile: UserProfile }>({
                    query: MY_PROFILE_QUERY,
                    context: {
                        headers: { Authorization: `Bearer ${tokens?.access_token}` },
                    },
                }).valueChanges;
            }),
            map((result) => {
                if (!result.data?.myProfile) {
                    throw new Error('No se pudo obtener el perfil de usuario');
                }
                return result.data.myProfile as UserProfile;
            }),
            tap((profile) => this.#userProfileState.set(profile)),
        );
    }

    // getProfile(): Observable<UserProfile> {
    //     //console.log('Token:...', this.tokens()?.access_token);
    //     return this.apollo
    //         .watchQuery<{ myProfile: UserProfile }>({
    //             query: MY_PROFILE_QUERY,
    //             context: {
    //                 headers: {
    //                     Authorization: `Bearer ${this.tokens()?.access_token}`,
    //                 },
    //             },
    //         })
    //         .valueChanges.pipe(map(({ data }) => data!.myProfile as UserProfile));
    // }

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

    logout() {
        this.#userProfileState.set(null);
    }
}

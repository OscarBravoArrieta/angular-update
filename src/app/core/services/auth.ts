import { Injector, Service, inject, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { Token, UserProfile, UserToLog } from '@core/models/users.model';
import { TokenTreatment } from '@core/services/token-treatment';

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
    private tokenTreatment = inject(TokenTreatment)
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
                    this.getProfile();
                    this.tokenTreatment.saveToken(token)
                    return token;
                }),
            );
    }

    getProfile(): Observable<UserProfile> {
        const access_token: string = this.tokenTreatment.getToken()?.access_token
        return this.apollo
            .watchQuery<{ myProfile: UserProfile }>({
                query: MY_PROFILE_QUERY,
                context: {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                },
            })
            .valueChanges.pipe(map(({ data }) => (data!.myProfile as UserProfile)));
            // .valueChanges.pipe(map(({ data }) => data!.myProfile as UserProfile));
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

    logout() {
        this.#userProfileState.set(null);
    }
}

import { Injector, Service, inject, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountError, Token, UserProfile, UserToLog } from '@core/models/users.model';
import { TokenTreatment } from '@core/services/token-treatment';

const LOGIN_MUTATION = gql`
    mutation TokenCreate($email: String!, $password: String!) {
        tokenCreate(email: $email, password: $password) {
            token
            refreshToken
            errors {
                field
                message
                code
            }
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
    private tokenTreatment = inject(TokenTreatment);
    readonly tokens = signal<Token | null>(null);

    // 1. Inyectamos el Injector de Angular en el servicio
    private injector = inject(Injector);

    #userProfileState = signal<UserProfile | null>(null);
    public userProfile = this.#userProfileState.asReadonly();

    login(credentials: UserToLog): Observable<Token> {
        return this.apollo
            .mutate<{ tokenCreate: Token & { errors: AccountError[] } }>({
                mutation: LOGIN_MUTATION,
                variables: credentials,
            })
            .pipe(
                map(({ data }) => {
                    const { errors, ...token } = data!.tokenCreate;
                    if (errors.length > 0) {
                        throw new Error(errors[0].message ?? 'No se pudo iniciar sesión.');
                    }

                    this.tokens.set(token);
                    this.tokenTreatment.saveToken(token);
                    this.getProfile().subscribe({
                        next: (perfil) => {
                            console.log('Datos del perfil en el componente:', perfil);
                        },
                        error: (error) => {
                            console.error('Error al obtener el perfil:', error);
                        },
                    });

                    return token;
                }),
            );
    }

    getProfile(): Observable<UserProfile> {
        const access_token: string = this.tokenTreatment.getToken()?.token;
        return this.apollo
            .watchQuery<{ myProfile: UserProfile }>({
                query: MY_PROFILE_QUERY,
                context: {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                },
            })
            .valueChanges.pipe(map(({ data }) => data!.myProfile as UserProfile));
    }

    refreshToken(): Observable<Token> {
        return this.apollo
            .mutate<{ refreshToken: Token }>({
                mutation: REFRESH_TOKEN_MUTATION,
                variables: { refreshToken: this.tokens()?.refreshToken },
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

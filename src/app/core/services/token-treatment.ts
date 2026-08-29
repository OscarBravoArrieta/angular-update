import { inject, Service } from '@angular/core';
import { LocalStorage } from '@core/services/local-storage';
import type { Token } from '@core/models/users.model';

@Service()
export class TokenTreatment {
    private localStorage = inject(LocalStorage);

    //--------------------------------------------------------------------------------------------

    saveToken(token: Token) {
        this.localStorage.setItem('token', token);
    }

    //--------------------------------------------------------------------------------------------

    getToken() {
        const token: Token = this.localStorage.getItem('token');
        return token;
    }

    //--------------------------------------------------------------------------------------------
}

import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '@shared/imports/primeng';
import { ImageModule } from 'primeng/image';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@/app/core/services/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-header',
    imports: [PrimeNgModule, ImageModule],

    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {
    readonly router = inject(Router);
    auth = inject(Auth);
    items: MenuItem[] | undefined;

    public userProfile = toSignal(this.auth.getProfile());

    ngOnInit() {
        this.items = [
            {
                label: 'My Account',
                items: [
                    { label: 'Actualizar perfil' },
                    { label: 'Billing' },
                    { label: 'Settings' },
                ],
            },
            { separator: true },
            {
                label: 'Notifications',
                items: [{ label: 'Enable notifications' }, { label: 'Play sound' }],
            },
            { separator: true },
            {
                label: 'Appearance',
                items: [{ label: 'Light' }, { label: 'Dark' }, { label: 'System' }],
            },
        ];
    }

    callLogin() {
        console.log('Login');
        this.router.navigate(['auth-login']);
    }
}

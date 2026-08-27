import { Component } from '@angular/core';
import { PrimeNgModule } from '@shared/imports/primeng';
import { ImageModule } from 'primeng/image';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-header',
    imports: [PrimeNgModule, ImageModule],

    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {
    items: MenuItem[] | undefined;
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
}

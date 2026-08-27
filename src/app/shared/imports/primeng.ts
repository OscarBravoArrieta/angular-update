import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { Box } from '@primeicons/angular/box';
import { Tablet } from '@primeicons/angular/tablet';
import { ButtonModule } from 'primeng/button';
import { User } from '@primeicons/angular/user';
import { Users } from '@primeicons/angular/users';
import { Calendar } from '@primeicons/angular/calendar';
import { Envelope } from '@primeicons/angular/envelope';
import { UserEdit } from '@primeicons/angular/user-edit';
import { SignIn } from '@primeicons/angular/sign-in';
import { ImageModule } from 'primeng/image';
import { BadgeModule } from 'primeng/badge';
import { ShoppingCart } from '@primeicons/angular/shopping-cart';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { Bell } from '@primeicons/angular/bell';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuModule } from 'primeng/menu';

@NgModule({
    imports: [
        CommonModule,
        InputTextModule,
        User,
        Box,
        Tablet,
        ButtonModule,
        Users,
        ImageModule,
        BadgeModule,
        ShoppingCart,
        OverlayBadgeModule,
        Bell,
        Calendar,
        Envelope,
        UserEdit,
        SignIn,
        SpeedDialModule,
        MenuModule,
    ],

    exports: [
        InputTextModule,
        User,
        Box,
        Tablet,
        ButtonModule,
        Users,
        ImageModule,
        BadgeModule,
        ShoppingCart,
        OverlayBadgeModule,
        Bell,
        Calendar,
        Envelope,
        UserEdit,
        SignIn,
        SpeedDialModule,
        MenuModule,
    ],
})
export class PrimeNgModule {}

import { Component, signal } from '@angular/core';
import { Header } from './shared/components/header/header';
import { LeftPanel } from './shared/components/left-panel/left-panel';
import { Layout } from './shared/components/layout/layout';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [Header, LeftPanel, Layout, RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('angular-update');
    sidebarVisible: boolean = false;
}

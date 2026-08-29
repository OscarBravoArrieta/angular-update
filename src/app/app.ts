import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from '@core/services/auth';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('angular-update');
    private auth = inject(Auth);
    sidebarVisible: boolean = false;

    ngOnInit() {
        // Si hay un token guardado, disparamos la carga del perfil
        this.auth.getProfile().subscribe({
            error: (err) => console.error('Error al cargar perfil inicial', err),
        });
    }

    private profileSubscription = this.auth.getProfile().subscribe({
        next: (profile) => console.log('Perfil global inicializado con éxito'),
        error: (err) => console.error('Error al cargar perfil inicial', err),
    });
}

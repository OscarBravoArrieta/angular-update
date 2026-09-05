import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
    FormField,
    email,
    form,
    minLength,
    required,
    schema,
    submit,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { Auth } from '@core/services/auth';
import { DialogService } from 'primeng/dynamicdialog';

interface LoginModel {
    email: string;
    password: string;
    remember: boolean;
}

const loginSchema = schema<LoginModel>((path) => {
    required(path.email, { message: 'El correo es obligatorio.' });
    email(path.email, { message: 'Ingresa un correo válido.' });
    required(path.password, { message: 'La contraseña es obligatoria.' });
    minLength(path.password, 8, { message: 'Debe tener al menos 8 caracteres.' });
});

@Component({
    selector: 'app-login',
    imports: [FormField],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export default class Login {
    private readonly auth = inject(Auth);
    private readonly router = inject(Router);
    private readonly dialogService = inject(DialogService);

    readonly showRemember = input<boolean>(true);

    protected readonly showPassword = signal(false);
    protected readonly submitting = signal(false);
    protected readonly submitError = signal<string | null>(null);

    protected readonly model = signal<LoginModel>({ email: '', password: '', remember: true });
    protected readonly loginForm = form(this.model, loginSchema);

    protected togglePasswordVisibility(): void {
        this.showPassword.update((show) => !show);
    }

    protected async openRegisterDialog(event: Event): Promise<void> {
        event.preventDefault();
        const { default: Register } = await import('../register/register');
        this.dialogService.open(Register, {
            header: 'Crear cuenta',
            modal: true,
            closable: false,
            draggable: true,
            width: '28rem',
        });
    }

    protected async onSubmit(event: Event): Promise<void> {
        event.preventDefault();
        this.submitError.set(null);

        const attempted = await submit(this.loginForm, async (field) => {
            this.submitting.set(true);
            try {
                await firstValueFrom(this.auth.login(field().value()));
            } catch (error) {
                this.submitError.set(
                    error instanceof Error
                        ? error.message
                        : 'Correo o contraseña incorrectos. Intenta nuevamente.',
                );
            } finally {
                this.submitting.set(false);
            }
        });

        if (attempted && !this.submitError()) {
            await this.router.navigateByUrl('/');
        }
    }
}
